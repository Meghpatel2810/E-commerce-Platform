import { Link } from 'react-router-dom'

export default function Sidebar({ open, onClose }) {
  return (
    <>
      <div className={`sidebar ${open ? 'open' : ''}`}>
        <div className="sidebar-header">
          <span style={{ fontWeight: 800, color: 'var(--primary)' }}>StyleCart</span>
          <button className="btn btn-ghost" onClick={onClose}>✕</button>
        </div>
        <nav className="sidebar-nav">
          <Link className="sidebar-link" to="/cart" onClick={onClose}>🛒 My Cart</Link>
          <Link className="sidebar-link" to="/orders" onClick={onClose}>📦 My Orders</Link>
          <Link className="sidebar-link" to="/wishlist" onClick={onClose}>💖 My Wishlist</Link>
        </nav>
      </div>
      {open && <div className="sidebar-backdrop" onClick={onClose} />}
    </>
  )
}


