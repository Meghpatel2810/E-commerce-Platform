import { useEffect, useState } from 'react'
import AdminProducts from './AdminProducts.jsx'
import AdminOrders from './AdminOrders.jsx'
import { api } from '../api'

export default function Admin() {
  const [tab, setTab] = useState('products')
  const [token, setToken] = useState('')
  const [form, setForm] = useState({ username: 'Aum Shah', password: 'bobby26' })
  const [error, setError] = useState('')

  useEffect(() => {
    try { setToken(localStorage.getItem('admin:token') || '') } catch {}
  }, [])

  const login = async (e) => {
    e.preventDefault()
    setError('')
    try {
      const { data } = await api.post('/admin/login', form)
      setToken(data.token)
      localStorage.setItem('admin:token', data.token)
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed')
    }
  }

  const logout = () => {
    if (confirm('Are you sure you want to logout?')) {
      localStorage.removeItem('admin:token')
      setToken('')
      alert('Logged out successfully')
    }
  }
  if (!token) {
    return (
      <div className="container" style={{ maxWidth: 420 }}>
        <div className="card">
          <h3 style={{ marginTop: 0, color: 'var(--primary)' }}>Admin Login</h3>
          <form onSubmit={login}>
            <div className="mb-2">
              <label>Username</label>
              <input className="input" value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} />
            </div>
            <div className="mb-2">
              <label>Password</label>
              <input type="password" className="input" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
            </div>
            {error && <div style={{ color: '#b00', marginBottom: 8 }}>{error}</div>}
            <button className="btn" type="submit">Login</button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="container" style={{ textAlign: 'center' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <div style={{ flex: 1 }}></div>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flex: 1 }}>
          <button className={`btn ${tab==='products' ? '' : 'btn-ghost'}`} onClick={() => setTab('products')}>Product Management</button>
          <button className={`btn ${tab==='orders' ? '' : 'btn-ghost'}`} onClick={() => setTab('orders')}>Order Management</button>
        </div>
        <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
          <button className="btn" onClick={logout} style={{ background: '#e11' }}>Logout</button>
        </div>
      </div>
      <div>
        {tab === 'products' ? <AdminProducts /> : <AdminOrders />}
      </div>
    </div>
  )
}


