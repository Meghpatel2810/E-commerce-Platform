import { useEffect, useState } from 'react'
import { api, absoluteUrl } from '../api'

export default function AdminProducts() {
  const empty = { name: '', price: '', stock: '', category: '', description: '', image: null }
  const [items, setItems] = useState([])
  const [form, setForm] = useState(empty)
  const [editingId, setEditingId] = useState(null)
  const [categoryFilter, setCategoryFilter] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [categories, setCategories] = useState([])

  const load = async () => {
    const { data } = await api.get('/products')
    setItems(data)
  }
  useEffect(() => { load() }, [])
  useEffect(() => {
    api.get('/products/meta/categories/list').then(({ data }) => setCategories(data))
  }, [])

  const onChange = (e) => {
    const { name, value, files } = e.target
    setForm(f => ({ ...f, [name]: files ? files[0] : value }))
  }

  const submit = async (e) => {
    e.preventDefault()
    try {
      const fd = new FormData()
      Object.entries(form).forEach(([k, v]) => {
        if (v !== null && v !== undefined && v !== '') fd.append(k, v)
      })
      if (editingId) {
        await api.put(`/products/${editingId}`, fd)
      } else {
        await api.post('/products', fd)
      }
      setForm(empty); setEditingId(null); await load()
      alert('Saved')
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to save'
      alert(msg)
    }
  }

  const edit = (p) => {
    setEditingId(p._id)
    setForm({
      name: p.name ?? '',
      price: p.price ?? '',
      stock: p.stock ?? '',
      category: p.category ?? '',
      description: p.description ?? '',
      image: null
    })
    // Scroll to form after a brief delay to allow state update
    setTimeout(() => {
      const formElement = document.getElementById('product-form')
      if (formElement) {
        formElement.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }, 100)
  }

  const del = async (id) => {
    const product = items.find(p => p._id === id)
    const productName = product?.name || 'this product'
    
    if (!confirm(`Are you sure you want to delete "${productName}"? This action cannot be undone.`)) {
      return
    }
    
    try {
      await api.delete(`/products/${id}`)
      alert('Product deleted successfully')
      await load()
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to delete product'
      alert(errorMsg)
    }
  }

  return (
    <div className="container">
      <h2 style={{ color: 'var(--primary)' }}>Admin: Products</h2>
      <div className="card" style={{ marginBottom: 24 }} id="product-form">
        <h3>{editingId ? 'Edit Product' : 'Add Product'}</h3>
        <form onSubmit={submit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              <label>Name</label>
              <input className="input" name="name" value={form.name} onChange={onChange} placeholder="e.g., Nike Air Jordan 1" />
            </div>
            <div>
              <label>Category</label>
              <input className="input" name="category" value={form.category} onChange={onChange} placeholder="Electronics" />
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 16 }}>
            <div>
              <label>Price</label>
              <input className="input" name="price" value={form.price} onChange={onChange} type="number" step="0.01" placeholder="1999" />
            </div>
            <div>
              <label>Stock</label>
              <input className="input" name="stock" value={form.stock} onChange={onChange} type="number" placeholder="50" />
            </div>
          </div>
          <div style={{ marginTop: 16 }}>
            <label>Description</label>
            <textarea className="input" name="description" value={form.description} onChange={onChange} rows={3} placeholder="Short product description" />
          </div>
          <div style={{ marginTop: 16 }}>
            <label>Image</label>
            <input className="input" name="image" onChange={onChange} type="file" accept="image/*" />
          </div>
          <div style={{ marginTop: 16 }}>
            <button className="btn">{editingId ? 'Update' : 'Create'}</button>
            {editingId && <button type="button" className="btn" style={{ marginLeft: 8, background: '#999' }} onClick={() => { setEditingId(null); setForm(empty) }}>Cancel</button>}
          </div>
        </form>
      </div>
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, gap: 12, flexWrap: 'wrap' }}>
          <h3 style={{ margin: 0 }}>Products</h3>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <input 
              className="input" 
              type="text" 
              placeholder="Search products..." 
              value={searchQuery} 
              onChange={e => setSearchQuery(e.target.value)} 
              style={{ width: 200 }} 
            />
            <select className="input" value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)} style={{ width: 200 }}>
              <option value="">All Categories</option>
              {categories.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>
        <div style={{ display: 'grid', gap: 12 }}>
          {items.filter(p => {
            const matchesCategory = !categoryFilter || p.category === categoryFilter
            const matchesSearch = !searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase())
            return matchesCategory && matchesSearch
          }).map(p => (
            <div key={p._id} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              {p.imageUrl && <img src={absoluteUrl(p.imageUrl)} alt={p.name} style={{ width: 64, height: 64, objectFit: 'cover', borderRadius: 8 }} />}
              <div style={{ flex: 1, textAlign: 'left' }}>
                <div style={{ fontWeight: 600 }}>{p.name}</div>
                <div>₹{p.price} • {p.category} • Stock: {p.stock}</div>
              </div>
              <button type="button" className="btn" onClick={() => edit(p)}>Edit</button>
              <button type="button" className="btn" style={{ background: '#e11' }} onClick={() => del(p._id)}>Delete</button>
            </div>
          ))}
        </div>
        {items.filter(p => {
          const matchesCategory = !categoryFilter || p.category === categoryFilter
          const matchesSearch = !searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase())
          return matchesCategory && matchesSearch
        }).length === 0 && (
          <div style={{ textAlign: 'center', padding: 24, color: '#666' }}>
            {searchQuery || categoryFilter 
              ? `No products found${searchQuery ? ` matching "${searchQuery}"` : ''}${categoryFilter ? ` in category "${categoryFilter}"` : ''}` 
              : 'No products found'}
          </div>
        )}
      </div>
    </div>
  )
}


