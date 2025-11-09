import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../api'

export default function Profile() {
  const navigate = useNavigate()
  const [email] = useState(() => {
    try { return localStorage.getItem('user:email') || '' } catch { return '' }
  })
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [profile, setProfile] = useState(null)
  const [form, setForm] = useState({
    name: '',
    phone: '',
    address: {
      line1: '',
      line2: '',
      city: '',
      state: '',
      postalCode: '',
      country: ''
    }
  })

  useEffect(() => {
    if (!email) {
      alert('Please login to view profile')
      navigate('/auth')
      return
    }
    loadProfile()
  }, [email, navigate])

  const loadProfile = async () => {
    setLoading(true)
    try {
      const { data } = await api.get('/auth/profile', { params: { email } })
      setProfile(data)
      setForm({
        name: data.name || '',
        phone: data.phone || '',
        address: {
          line1: data.address?.line1 || '',
          line2: data.address?.line2 || '',
          city: data.address?.city || '',
          state: data.address?.state || '',
          postalCode: data.address?.postalCode || '',
          country: data.address?.country || ''
        }
      })
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to load profile')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    if (name.startsWith('address.')) {
      const field = name.split('.')[1]
      setForm(f => ({
        ...f,
        address: { ...f.address, [field]: value }
      }))
    } else {
      setForm(f => ({ ...f, [name]: value }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const { data } = await api.put('/auth/profile', form, { params: { email } })
      setProfile(data)
      alert('Profile updated successfully!')
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  if (!email) return null

  if (loading) {
    return (
      <div className="container">
        <div style={{ textAlign: 'center', padding: 40 }}>Loading profile...</div>
      </div>
    )
  }

  return (
    <div className="container">
      <h2 style={{ color: 'var(--primary)' }}>My Profile</h2>
      
      <div className="card" style={{ maxWidth: 600, margin: '0 auto' }}>
        <h3 style={{ marginTop: 0 }}>Personal Information</h3>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>Name</label>
            <input 
              className="input" 
              name="name" 
              value={form.name} 
              onChange={handleChange}
              placeholder="Enter your name"
              required
              style={{ width: '100%', padding: '12px' }}
            />
          </div>
          
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>Email</label>
            <input 
              className="input" 
              value={profile?.email || email} 
              disabled
              style={{ width: '100%', padding: '12px', background: '#f5f5f5', color: '#666' }}
            />
            <div style={{ fontSize: 12, color: '#666', marginTop: 4 }}>Email cannot be changed</div>
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>Phone (Optional)</label>
            <input 
              className="input" 
              name="phone" 
              value={form.phone} 
              onChange={handleChange}
              placeholder="Enter your phone number"
              style={{ width: '100%', padding: '12px' }}
            />
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>Role</label>
            <input 
              className="input" 
              value={profile?.role ? profile.role.charAt(0).toUpperCase() + profile.role.slice(1) : 'Customer'} 
              disabled
              style={{ width: '100%', padding: '12px', background: '#f5f5f5', color: '#666' }}
            />
          </div>

          <div style={{ marginTop: 32, paddingTop: 24, borderTop: '1px solid #eee' }}>
            <h3 style={{ marginTop: 0, marginBottom: 16 }}>Home Address (Optional)</h3>
            <p style={{ fontSize: 14, color: '#666', marginBottom: 20 }}>
              Save your home address for faster checkout. You can always choose a different delivery address during checkout.
            </p>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
              <div>
                <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>Address Line 1</label>
                <input 
                  className="input" 
                  name="address.line1" 
                  value={form.address.line1} 
                  onChange={handleChange}
                  placeholder="Street address"
                  style={{ width: '100%', padding: '12px' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>Address Line 2</label>
                <input 
                  className="input" 
                  name="address.line2" 
                  value={form.address.line2} 
                  onChange={handleChange}
                  placeholder="Apartment, suite, etc."
                  style={{ width: '100%', padding: '12px' }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
              <div>
                <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>City</label>
                <input 
                  className="input" 
                  name="address.city" 
                  value={form.address.city} 
                  onChange={handleChange}
                  placeholder="City"
                  style={{ width: '100%', padding: '12px' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>State</label>
                <input 
                  className="input" 
                  name="address.state" 
                  value={form.address.state} 
                  onChange={handleChange}
                  placeholder="State"
                  style={{ width: '100%', padding: '12px' }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
              <div>
                <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>Postal Code</label>
                <input 
                  className="input" 
                  name="address.postalCode" 
                  value={form.address.postalCode} 
                  onChange={handleChange}
                  placeholder="Postal code"
                  style={{ width: '100%', padding: '12px' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>Country</label>
                <input 
                  className="input" 
                  name="address.country" 
                  value={form.address.country} 
                  onChange={handleChange}
                  placeholder="Country"
                  style={{ width: '100%', padding: '12px' }}
                />
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
            <button 
              type="button" 
              className="btn" 
              onClick={() => navigate(-1)}
              style={{ background: '#999' }}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn" 
              disabled={saving}
              style={{ background: 'var(--primary)' }}
            >
              {saving ? 'Saving...' : 'Save Profile'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

