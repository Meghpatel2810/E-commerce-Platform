import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from './api'
import './App.css'


function App() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [mode, setMode] = useState('login')

  const onChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const route = mode === 'login' ? '/auth/login' : '/auth/register'
      const payload = mode === 'login' ? { email: form.email, password: form.password } : form
      const { data } = await api.post(route, payload)
      try { localStorage.setItem('user:email', data.user?.email || '') } catch {}
      alert(mode === 'login' ? 'Login successful!' : 'Account created successfully!')
      navigate('/')
    } catch (err) {
      alert(err.response?.data?.message || 'Request failed')
    } finally { setLoading(false) }
  }

  return (
    <div className="container" style={{ maxWidth: 500, margin: '40px auto' }}>
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <h1 style={{ 
          color: 'var(--primary)', 
          fontSize: 36, 
          fontWeight: 800, 
          marginBottom: 8,
          background: 'linear-gradient(90deg, var(--primary), #ff5500)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          StyleCart
        </h1>
        <p style={{ 
          fontSize: 18, 
          color: '#666', 
          fontWeight: 500,
          marginTop: 8,
          lineHeight: 1.5
        }}>
          Your Style. Your Cart. Your Marketplace.
        </p>
      </div>
      
      <div className="card" style={{ padding: 32 }}>
        <div style={{ display: 'flex', gap: 8, marginBottom: 24, background: '#f5f5f5', padding: 4, borderRadius: 8 }}>
          <button 
            className="btn" 
            onClick={() => { setMode('login'); setForm({ name: '', email: '', password: '' }) }} 
            style={{ 
              flex: 1, 
              background: mode === 'login' ? 'var(--primary)' : 'transparent',
              color: mode === 'login' ? '#fff' : '#666',
              border: 'none',
              padding: '10px 16px',
              borderRadius: 6,
              fontWeight: mode === 'login' ? 600 : 400,
              transition: 'all 0.2s'
            }}
          >
            Login
          </button>
          <button 
            className="btn" 
            onClick={() => { setMode('register'); setForm({ name: '', email: '', password: '' }) }} 
            style={{ 
              flex: 1, 
              background: mode === 'register' ? 'var(--primary)' : 'transparent',
              color: mode === 'register' ? '#fff' : '#666',
              border: 'none',
              padding: '10px 16px',
              borderRadius: 6,
              fontWeight: mode === 'register' ? 600 : 400,
              transition: 'all 0.2s'
            }}
          >
            Register
          </button>
        </div>
        
        <form onSubmit={submit}>
          {mode === 'register' && (
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', marginBottom: 8, fontWeight: 500, color: '#333' }}>Name</label>
              <input 
                className="input" 
                name="name" 
                value={form.name} 
                onChange={onChange} 
                placeholder="Enter your name" 
                required
                style={{ width: '100%', padding: '12px' }}
              />
            </div>
          )}
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', marginBottom: 8, fontWeight: 500, color: '#333' }}>Email</label>
            <input 
              className="input" 
              name="email" 
              type="email"
              value={form.email} 
              onChange={onChange} 
              placeholder="Enter your email" 
              required
              style={{ width: '100%', padding: '12px' }}
            />
          </div>
          <div style={{ marginBottom: 24 }}>
            <label style={{ display: 'block', marginBottom: 8, fontWeight: 500, color: '#333' }}>Password</label>
            <input 
              type="password" 
              className="input" 
              name="password" 
              value={form.password} 
              onChange={onChange} 
              placeholder="Enter your password" 
              required
              style={{ width: '100%', padding: '12px' }}
            />
          </div>
          <button 
            className="btn" 
            disabled={loading}
            style={{ 
              width: '100%', 
              padding: '14px', 
              fontSize: 16, 
              fontWeight: 600,
              background: 'var(--primary)',
              border: 'none'
            }}
          >
            {loading ? 'Please wait...' : (mode === 'login' ? 'Login' : 'Create Account')}
          </button>
        </form>
      </div>
    </div>
  )
}

export default App