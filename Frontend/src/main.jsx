import React, { StrictMode, Suspense, lazy, useState, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Admin from './pages/Admin.jsx'
import Catalog from './pages/Catalog.jsx'
import ProductDetail from './pages/ProductDetail.jsx'
import Cart from './pages/Cart.jsx'
import Checkout from './pages/Checkout.jsx'
import MyOrders from './pages/MyOrders.jsx'
import AdminOrders from './pages/AdminOrders.jsx'
import { CartProvider, useCart } from './state/cart.jsx'
import { WishlistProvider } from './state/wishlist.jsx'
const Wishlist = lazy(() => import('./pages/Wishlist.jsx'))
const Wholesale = lazy(() => import('./pages/Wholesale.jsx'))
import Home from './pages/Home.jsx'
import Profile from './pages/Profile.jsx'
import { BrowserRouter, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom'
import Sidebar from './components/Sidebar.jsx'

function Root() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  return (
    <BrowserRouter>
      <CartProvider>
        <WishlistProvider>
        <div className="navbar">
          <div className="inner">
            <button className="navlink" onClick={() => setSidebarOpen(true)}>☰</button>
            <NavLinks />
            <div className="nav-right">
              <ProfileIcon />
              <LogoutButton />
            </div>
          </div>
        </div>
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="spacer"></div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auth" element={<App />} />
          <Route path="/catalog" element={<Catalog />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/wishlist" element={<Suspense fallback={<div className="container">Loading...</div>}><Wishlist /></Suspense>} />
          <Route path="/orders" element={<MyOrders />} />
          <Route path="/admin/orders" element={<AdminOrders />} />
          <Route path="/wholesale" element={<Suspense fallback={<div className="container">Loading...</div>}><Wholesale /></Suspense>} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
        </WishlistProvider>
      </CartProvider>
    </BrowserRouter>
  )
}

function CartNav() {
  const { count } = useCart()
  return (
    <Link to="/cart" className="btn" style={{ position: 'relative' }}>
      Cart
      {count > 0 && (
        <span style={{ position: 'absolute', top: -8, right: -8, background: 'var(--primary)', color: '#fff', borderRadius: 12, padding: '0 6px', fontSize: 12 }}>
          {count}
        </span>
      )}
    </Link>
  )
}

function NavLinks() {
  const location = useLocation()
  const is = (path) => location.pathname === path
  return (
    <>
      <Link to="/" className={`navlink ${is('/') ? 'active' : ''}`}>Home</Link>
      <Link to="/catalog" className={`navlink ${is('/catalog') ? 'active' : ''}`}>Catalog</Link>
      <Link to="/cart" className={`navlink ${is('/cart') ? 'active' : ''}`}>Cart</Link>
      <Link to="/checkout" className={`navlink ${is('/checkout') ? 'active' : ''}`}>Checkout</Link>
      <Link to="/orders" className={`navlink ${is('/orders') ? 'active' : ''}`}>Orders</Link>
      <Link to="/wholesale" className={`navlink ${is('/wholesale') ? 'active' : ''}`}>Wholesale</Link>
      <Link to="/wishlist" className={`navlink ${is('/wishlist') ? 'active' : ''}`}>Wishlist</Link>
      <Link to="/admin" className={`navlink ${is('/admin') ? 'active' : ''}`}>Admin</Link>
    </>
  )
}

function ProfileIcon() {
  const navigate = useNavigate()
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    try {
      return !!localStorage.getItem('user:email')
    } catch {
      return false
    }
  })

  useEffect(() => {
    const checkLogin = () => {
      try {
        setIsLoggedIn(!!localStorage.getItem('user:email'))
      } catch {}
    }
    
    checkLogin()
    window.addEventListener('storage', checkLogin)
    const interval = setInterval(checkLogin, 500)
    
    return () => {
      window.removeEventListener('storage', checkLogin)
      clearInterval(interval)
    }
  }, [])

  if (!isLoggedIn) return null

  return (
    <button 
      className="btn btn-ghost" 
      onClick={() => navigate('/profile')}
      style={{ 
        borderRadius: '50%', 
        width: 40, 
        height: 40, 
        padding: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 20,
        background: 'var(--primary)',
        color: '#fff',
        border: 'none',
        cursor: 'pointer'
      }}
      title="View Profile"
    >
      👤
    </button>
  )
}

function LogoutButton() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    try {
      return !!localStorage.getItem('user:email')
    } catch {
      return false
    }
  })

  // Listen for storage changes (when user logs in/out in another tab)
  useEffect(() => {
    const checkLogin = () => {
      try {
        setIsLoggedIn(!!localStorage.getItem('user:email'))
      } catch {}
    }
    
    // Check on mount and when storage changes
    checkLogin()
    window.addEventListener('storage', checkLogin)
    
    // Also check periodically (for same-tab changes)
    const interval = setInterval(checkLogin, 500)
    
    return () => {
      window.removeEventListener('storage', checkLogin)
      clearInterval(interval)
    }
  }, [])

  const handleLogout = () => {
    try { 
      localStorage.removeItem('user:email')
      setIsLoggedIn(false)
      alert('Logged out')
      window.location.href = '/'
    } catch {}
  }

  if (!isLoggedIn) {
    return (
      <Link to="/auth" className="btn btn-ghost">Login</Link>
    )
  }

  return (
    <button className="btn btn-ghost" onClick={handleLogout}>Logout</button>
  )
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Root />
  </StrictMode>,
)
