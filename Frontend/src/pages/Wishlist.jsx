import { useWishlist } from '../state/wishlist'
import { absoluteUrl } from '../api'
import { useCart } from '../state/cart'
import { Link } from 'react-router-dom'

export default function Wishlist() {
  const { items, toggle } = useWishlist()
  const { add } = useCart()
  return (
    <div className="container">
      <h2 style={{ color: 'var(--primary)' }}>Wishlist</h2>
      {items.length === 0 ? <p>No items in wishlist.</p> : (
        <div className="row">
          {items.map(p => (
            <div className="col-6" key={p._id}>
              <div className="card" style={{ display: 'flex', gap: 12 }}>
                {p.imageUrl && <img src={absoluteUrl(p.imageUrl)} alt={p.name} style={{ width: 120, height: 120, objectFit: 'cover', borderRadius: 8 }} />}
                <div style={{ textAlign: 'left', flex: 1 }}>
                  <Link to={`/product/${p._id}`} style={{ color: 'var(--primary)', fontWeight: 700 }}>{p.name}</Link>
                  <div style={{ marginTop: 6 }}>₹{p.price} • {p.category}</div>
                  <div style={{ marginTop: 8, display: 'flex', gap: 8 }}>
                    <button type="button" className="btn" onClick={() => add(p, 1)}>Add to Cart</button>
                    <button type="button" className="btn" style={{ background: '#999' }} onClick={() => toggle(p)}>Remove</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}


