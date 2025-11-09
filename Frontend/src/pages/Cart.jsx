import { useCart } from '../state/cart'
import { Link, useNavigate } from 'react-router-dom'
import { absoluteUrl } from '../api'

export default function Cart() {
  const { items, setQty, remove, total, clear } = useCart()
  const navigate = useNavigate()
  const isLoggedIn = () => {
    try {
      return !!localStorage.getItem('user:email')
    } catch {
      return false
    }
  }

  const handleQtyChange = (productId, newQty, productName) => {
    if (newQty >= 10) {
      const proceed = confirm(`You're ordering ${newQty} items of ${productName}. For quantities of 10 or more, we recommend using our Wholesale Bulk Order feature to get a 25% discount! Would you like to go to Wholesale page?`)
      if (proceed) {
        navigate('/wholesale')
        return
      }
      // If they cancel, still update the quantity but show a message
      alert('Tip: Use Wholesale Bulk Order for quantities of 10+ to get 25% discount!')
    }
    setQty(productId, newQty)
  }

  const handleCheckout = () => {
    if (!isLoggedIn()) {
      const proceed = confirm('Please login to proceed to checkout. Would you like to go to login page?')
      if (proceed) {
        navigate('/auth')
      }
      return
    }
    navigate('/checkout')
  }

  return (
    <div className="container">
      <h2 style={{ color: 'var(--primary)' }}>Cart</h2>
      {!isLoggedIn() && (
        <div className="card" style={{ background: '#fff3cd', border: '1px solid #ffc107', marginBottom: 16, padding: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
            <strong style={{ color: '#856404', flex: 1, minWidth: 200 }}>Please login to add items to cart and place orders.</strong>
            <button className="btn" onClick={() => navigate('/auth')} style={{ whiteSpace: 'nowrap' }}>Go to Login</button>
          </div>
        </div>
      )}
      {items.length === 0 ? <p>Your cart is empty.</p> : (
        <div className="row">
          <div className="col-12">
            {items.map(p => (
              <div key={p._id} className="card" style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                {p.imageUrl && <img src={absoluteUrl(p.imageUrl)} alt={p.name} style={{ width: 64, height: 64, objectFit: 'cover', borderRadius: 8 }} />}
                <div style={{ flex: 1, textAlign: 'left' }}>
                  <div style={{ fontWeight: 600 }}>{p.name}</div>
                  <div>₹{p.price}</div>
                  {typeof p.stock === 'number' && p.qty > p.stock && (
                    <div style={{ color: '#b00', fontSize: 12 }}>Only {p.stock} left in stock</div>
                  )}
                </div>
                <input type="number" min="1" className="input" value={p.qty} onChange={e => handleQtyChange(p._id, Number(e.target.value || 1), p.name)} style={{ width: 90 }} />
                <button className="btn" style={{ background: '#e11' }} onClick={() => remove(p._id)}>Remove</button>
              </div>
            ))}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12 }}>
              <strong>Total: ₹{total.toFixed(2)}</strong>
              <div>
                <button className="btn" style={{ background: '#999', marginRight: 8 }} onClick={clear} disabled={items.length===0}>Clear</button>
                <button className="btn" onClick={handleCheckout} disabled={items.length===0 || items.some(p => typeof p.stock === 'number' && p.qty > p.stock) || !isLoggedIn()}>Proceed to Checkout</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}


