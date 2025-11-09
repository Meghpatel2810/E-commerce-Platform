import { useState, useEffect } from 'react'
import { useCart } from '../state/cart'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { api } from '../api'

export default function Checkout() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const isWholesale = searchParams.get('type') === 'wholesale'
  const { items: cartItems, total: cartTotal, clear } = useCart()
  const [email] = useState(() => {
    try { return localStorage.getItem('user:email') || '' } catch { return '' }
  })
  const [addr, setAddr] = useState({ line1: '', line2: '', city: '', state: '', postalCode: '', country: '' })
  const [loading, setLoading] = useState(false)
  const [wholesaleData, setWholesaleData] = useState(null)
  const [profile, setProfile] = useState(null)
  const [addressType, setAddressType] = useState('home') // 'home' or 'other'

  useEffect(() => {
    // Redirect to login if not logged in
    if (!email) {
      alert('Please login to proceed to checkout.')
      navigate('/auth')
      return
    }
    
    // Load user profile to get saved address
    const loadProfile = async () => {
      try {
        const { data } = await api.get('/auth/profile', { params: { email } })
        setProfile(data)
        // If user has a saved address, default to using it
        if (data.address && (data.address.line1 || data.address.city)) {
          setAddressType('home')
          setAddr({
            line1: data.address.line1 || '',
            line2: data.address.line2 || '',
            city: data.address.city || '',
            state: data.address.state || '',
            postalCode: data.address.postalCode || '',
            country: data.address.country || ''
          })
        }
      } catch (err) {
        console.error('Failed to load profile:', err)
      }
    }
    loadProfile()

    if (isWholesale) {
      try {
        const stored = localStorage.getItem('wholesale:order')
        if (stored) {
          const data = JSON.parse(stored)
          setWholesaleData(data)
        } else {
          alert('No wholesale order found. Redirecting...')
          navigate('/wholesale')
        }
      } catch (err) {
        alert('Error loading wholesale order')
        navigate('/wholesale')
      }
    }
  }, [isWholesale, navigate, email])

  const handleAddressTypeChange = (type) => {
    setAddressType(type)
    if (type === 'home' && profile?.address) {
      setAddr({
        line1: profile.address.line1 || '',
        line2: profile.address.line2 || '',
        city: profile.address.city || '',
        state: profile.address.state || '',
        postalCode: profile.address.postalCode || '',
        country: profile.address.country || ''
      })
    } else {
      setAddr({ line1: '', line2: '', city: '', state: '', postalCode: '', country: '' })
    }
  }

  const items = isWholesale ? (wholesaleData?.rows || []) : cartItems
  const total = isWholesale ? (wholesaleData?.quote?.totalAmount || 0) : cartTotal

  const submit = async (e) => {
    e.preventDefault()
    if (!email) {
      alert('Please login to place an order.')
      navigate('/auth')
      return
    }
    if (isWholesale) {
      if (!wholesaleData || !wholesaleData.items || wholesaleData.items.length === 0) return alert('No items in wholesale order')
    } else {
      if (cartItems.length === 0) return alert('Cart is empty')
    }
    setLoading(true)
    try {
      if (isWholesale) {
        // Place wholesale order
        const wholesaleItems = wholesaleData.items
        const { data } = await api.post('/wholesale/place', { buyerEmail: email, items: wholesaleItems, address: addr })
        localStorage.removeItem('wholesale:order')
        alert('Wholesale order placed! Order ID: ' + data._id)
        navigate('/orders')
      } else {
        // Place retail order
        const payload = {
          customerEmail: email,
          address: addr,
          items: items.map(p => ({ productId: p._id, name: p.name, price: p.price, qty: p.qty, imageUrl: p.imageUrl }))
        }
        const { data } = await api.post('/orders', payload)
        clear()
        alert('Order placed! Order ID: ' + data._id)
        navigate('/orders')
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to place order')
    } finally { setLoading(false) }
  }

  if (!email) {
    return (
      <div className="container">
        <h2 style={{ color: 'var(--primary)' }}>Checkout</h2>
        <div className="card" style={{ background: '#fff3cd', border: '1px solid #ffc107', padding: 24, textAlign: 'center' }}>
          <strong style={{ color: '#856404', display: 'block', marginBottom: 16 }}>Please login to proceed to checkout.</strong>
          <button className="btn" onClick={() => navigate('/auth')}>Go to Login</button>
        </div>
      </div>
    )
  }

  return (
    <div className="container">
      <h2 style={{ color: 'var(--primary)' }}>{isWholesale ? 'Wholesale Order Checkout' : 'Checkout'}</h2>
      {isWholesale && wholesaleData && (
        <div className="card" style={{ marginBottom: 16 }}>
          <h3 style={{ marginTop: 0 }}>Order Summary</h3>
          <div style={{ display: 'grid', gap: 8 }}>
            {wholesaleData.rows.filter(r => r.productId).map((row, idx) => (
              <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: 8, background: '#f9f9f9', borderRadius: 8 }}>
                <div>{row.name} × {row.qty}</div>
                <div>₹{row.lineTotal?.toFixed?.(2) || '0.00'}</div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid #eee', display: 'flex', justifyContent: 'space-between', fontWeight: 700 }}>
            <div>Total:</div>
            <div>₹{wholesaleData.quote?.totalAmount?.toFixed?.(2) || '0.00'}</div>
          </div>
        </div>
      )}
      <form onSubmit={submit} className="card" style={{ maxWidth: 720 }}>
        <div style={{ marginBottom: 12 }}>
          <label>Email</label>
          <input className="input" value={email} readOnly />
        </div>
        
        <div style={{ marginBottom: 20 }}>
          <label style={{ display: 'block', marginBottom: 12, fontWeight: 500 }}>Delivery Address</label>
          {profile?.address && (profile.address.line1 || profile.address.city) ? (
            <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                <input 
                  type="radio" 
                  name="addressType" 
                  value="home" 
                  checked={addressType === 'home'}
                  onChange={() => handleAddressTypeChange('home')}
                />
                <span>Use Home Address</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                <input 
                  type="radio" 
                  name="addressType" 
                  value="other" 
                  checked={addressType === 'other'}
                  onChange={() => handleAddressTypeChange('other')}
                />
                <span>Deliver to Different Location</span>
              </label>
            </div>
          ) : (
            <div style={{ padding: 12, background: '#f0f0f0', borderRadius: 6, marginBottom: 16, fontSize: 14, color: '#666' }}>
              No saved home address. You can save one in your <a href="/profile" style={{ color: 'var(--primary)' }}>Profile</a> for faster checkout.
            </div>
          )}
        </div>

        <div className="row">
          <div className="col-6">
            <label style={{ display: 'block', marginBottom: 4, fontSize: 14 }}>Address line 1</label>
            <input 
              className="input" 
              placeholder="Street address" 
              value={addr.line1} 
              onChange={e => setAddr({ ...addr, line1: e.target.value })} 
              required={addressType === 'other'}
              disabled={addressType === 'home' && profile?.address}
            />
          </div>
          <div className="col-6">
            <label style={{ display: 'block', marginBottom: 4, fontSize: 14 }}>Address line 2</label>
            <input 
              className="input" 
              placeholder="Apartment, suite, etc." 
              value={addr.line2} 
              onChange={e => setAddr({ ...addr, line2: e.target.value })} 
              disabled={addressType === 'home' && profile?.address}
            />
          </div>
          <div className="col-6">
            <label style={{ display: 'block', marginBottom: 4, fontSize: 14 }}>City</label>
            <input 
              className="input" 
              placeholder="City" 
              value={addr.city} 
              onChange={e => setAddr({ ...addr, city: e.target.value })} 
              required={addressType === 'other'}
              disabled={addressType === 'home' && profile?.address}
            />
          </div>
          <div className="col-6">
            <label style={{ display: 'block', marginBottom: 4, fontSize: 14 }}>State</label>
            <input 
              className="input" 
              placeholder="State" 
              value={addr.state} 
              onChange={e => setAddr({ ...addr, state: e.target.value })} 
              required={addressType === 'other'}
              disabled={addressType === 'home' && profile?.address}
            />
          </div>
          <div className="col-6">
            <label style={{ display: 'block', marginBottom: 4, fontSize: 14 }}>Postal Code</label>
            <input 
              className="input" 
              placeholder="Postal Code" 
              value={addr.postalCode} 
              onChange={e => setAddr({ ...addr, postalCode: e.target.value })} 
              required={addressType === 'other'}
              disabled={addressType === 'home' && profile?.address}
            />
          </div>
          <div className="col-6">
            <label style={{ display: 'block', marginBottom: 4, fontSize: 14 }}>Country</label>
            <input 
              className="input" 
              placeholder="Country" 
              value={addr.country} 
              onChange={e => setAddr({ ...addr, country: e.target.value })} 
              required={addressType === 'other'}
              disabled={addressType === 'home' && profile?.address}
            />
          </div>
        </div>
        <div style={{ marginTop: 12, display: 'flex', justifyContent: 'space-between' }}>
          <strong>Total: ₹{total.toFixed(2)}</strong>
          <button className="btn" disabled={loading}>{loading ? 'Placing...' : isWholesale ? 'Place Wholesale Order' : 'Place Order (Mock Pay)'}</button>
        </div>
      </form>
    </div>
  )
}


