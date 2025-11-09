import { useEffect, useMemo, useRef, useState } from 'react'
import { api, absoluteUrl } from '../api'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../state/cart'
import { useWishlist } from '../state/wishlist'

export default function Catalog() {
  const navigate = useNavigate()
  const [items, setItems] = useState([])
  const [q, setQ] = useState('')
  const [category, setCategory] = useState('')
  const [categories, setCategories] = useState([])
  const [sort, setSort] = useState('date_desc')
  const { add, items: cartItems, setQty, remove } = useCart()
  const { toggle, has } = useWishlist()
  
  const getCartQty = (productId) => {
    const item = cartItems.find(i => i._id === productId)
    return item ? item.qty : 0
  }

  const isLoggedIn = () => {
    try {
      return !!localStorage.getItem('user:email')
    } catch {
      return false
    }
  }

  const handleAddToCart = (product) => {
    if (!isLoggedIn()) {
      const proceed = confirm('Please login to add items to cart. Would you like to go to login page?')
      if (proceed) {
        navigate('/auth')
      }
      return
    }
    const currentQty = getCartQty(product._id)
    if (currentQty + 1 >= 10) {
      const proceed = confirm(`You're adding ${currentQty + 1} items. For quantities of 10 or more, we recommend using our Wholesale Bulk Order feature to get a 25% discount! Would you like to go to Wholesale page?`)
      if (proceed) {
        navigate('/wholesale')
        return
      }
      // If they cancel, still add the item but show a message
      alert('Tip: Use Wholesale Bulk Order for quantities of 10+ to get 25% discount!')
    }
    add(product, 1)
  }
  const debounceRef = useRef(0)

  const load = async () => {
    const { data } = await api.get('/products', { params: { q, category, sort } })
    setItems(data)
  }
  useEffect(() => { load() }, [sort, category])
  useEffect(() => {
    api.get('/products/meta/categories/list').then(({ data }) => setCategories(data))
  }, [])

  useEffect(() => {
    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => { load() }, 350)
    return () => clearTimeout(debounceRef.current)
  }, [q])

  return (
    <div className="container">
      <h2 style={{ color: 'var(--primary)' }}>Products</h2>
      <div style={{ display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
        <input className="input" placeholder="Search products..." value={q} onChange={e => setQ(e.target.value)} style={{ flex: '0.6', minWidth: 200 }} />
        <select className="input" value={category} onChange={e => setCategory(e.target.value)} style={{ flex: '0.2', minWidth: 150 }}>
          <option value="">All Categories</option>
          {categories.map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <select className="input" value={sort} onChange={e => setSort(e.target.value)} style={{ flex: '0.2', minWidth: 150 }}>
          <option value="date_desc">Newest</option>
          <option value="date_asc">Oldest</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
        </select>
      </div>
      <div className="row">
        {items.map(p => (
          <div className="col-6" key={p._id}>
            <div className="card" style={{ display: 'grid', gridTemplateColumns: '140px 1fr', gap: 16 }}>
              {p.imageUrl && <img src={absoluteUrl(p.imageUrl)} alt={p.name} style={{ width: 140, height: 140, objectFit: 'cover', borderRadius: 10 }} />}
              <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <Link to={`/product/${p._id}`} style={{ color: 'var(--primary)', fontWeight: 800, fontSize: 18 }}>{p.name}</Link>
                  <div className="mt-1">₹{p.price} • {p.category}</div>
                </div>
                <div style={{ display: 'flex', gap: 8, marginTop: 8, alignItems: 'center' }}>
                  {getCartQty(p._id) > 0 ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#f0f0f0', padding: '4px 8px', borderRadius: 8 }}>
                      <button type="button" className="btn" style={{ padding: '4px 10px', minWidth: 32 }} onClick={(e) => { e.preventDefault(); e.stopPropagation(); const newQty = getCartQty(p._id) - 1; newQty > 0 ? setQty(p._id, newQty) : remove(p._id) }}>-</button>
                      <span style={{ minWidth: 24, textAlign: 'center', fontWeight: 600 }}>{getCartQty(p._id)}</span>
                      <button type="button" className="btn" style={{ padding: '4px 10px', minWidth: 32 }} onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleAddToCart(p) }}>+</button>
                    </div>
                  ) : (
                    <button type="button" className="btn" onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleAddToCart(p) }}>Add to Cart</button>
                  )}
                  <button type="button" className="btn btn-secondary" onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggle(p) }}>{has(p._id) ? 'Wishlisted' : 'Wishlist'}</button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}


