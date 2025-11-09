import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { api, absoluteUrl } from '../api'
import { useCart } from '../state/cart'
import { useWishlist } from '../state/wishlist'

export default function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [p, setP] = useState(null)
  const { add, items: cartItems } = useCart()
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

  const handleAddToCart = () => {
    if (!isLoggedIn()) {
      const proceed = confirm('Please login to add items to cart. Would you like to go to login page?')
      if (proceed) {
        navigate('/auth')
      }
      return
    }
    const currentQty = getCartQty(p._id)
    if (currentQty + 1 >= 10) {
      const proceed = confirm(`You're adding ${currentQty + 1} items. For quantities of 10 or more, we recommend using our Wholesale Bulk Order feature to get a 25% discount! Would you like to go to Wholesale page?`)
      if (proceed) {
        navigate('/wholesale')
        return
      }
      // If they cancel, still add the item but show a message
      alert('Tip: Use Wholesale Bulk Order for quantities of 10+ to get 25% discount!')
    }
    add(p, 1)
  }

  useEffect(() => {
    api.get(`/products/${id}`).then(({ data }) => setP(data))
  }, [id])

  if (!p) return <div className="container">Loading...</div>
  return (
    <div className="container">
      <div className="row">
        <div className="col-6">
          {p.imageUrl && <img src={absoluteUrl(p.imageUrl)} alt={p.name} style={{ width: '100%', maxWidth: 520, borderRadius: 16, boxShadow: '0 8px 28px rgba(0,0,0,.08)' }} />}
        </div>
        <div className="col-6">
          <h2 style={{ color: 'var(--primary)', fontSize: 28, marginBottom: 8 }}>{p.name}</h2>
          <div style={{ fontSize: 22, fontWeight: 700 }}>₹{p.price}</div>
          <div className="mt-1">Category: {p.category}</div>
          <p className="mt-2" style={{ lineHeight: 1.6 }}>{p.description}</p>
          <div style={{ display: 'flex', gap: 8 }}>
            <button type="button" className="btn" onClick={handleAddToCart}>Add to Cart</button>
            <button type="button" className="btn btn-secondary" onClick={() => toggle(p)}>{has(p._id) ? 'Wishlisted' : 'Wishlist'}</button>
          </div>
        </div>
      </div>
    </div>
  )
}


