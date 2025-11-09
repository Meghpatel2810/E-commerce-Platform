import { Link } from 'react-router-dom'
import { absoluteUrl } from '../api'

export default function Home() {
  const isLoggedIn = (() => { try { return !!localStorage.getItem('user:email') } catch { return false } })()
  const features = [
    { title: '⚡ Fast Delivery', desc: 'Lightning-fast shipping to your doorstep.' },
    { title: '✅ Quality Guaranteed', desc: 'Top brands with full authenticity.' },
    { title: '🔒 Secure Payments', desc: 'Multiple safe and trusted options.' },
    { title: '💬 Helpful Support', desc: 'We’re here to help, anytime.' },
    { title: '🧡 Easy Returns', desc: 'Hassle-free returns on eligible items.' },
    { title: '📦 Bulk Orders', desc: 'Wholesale interface with flat 25% discount.' },
  ]

  return (
    <div>
      <section className="hero" style={{ marginTop: 16 }}>
        <div style={{ maxWidth: 840, margin: '0 auto', textAlign: 'left' }}>
          <h1>Your Style. Your Cart. Your Marketplace.</h1>
          <p style={{ marginTop: 10, lineHeight: 1.8 }}>
            Welcome to StyleCart — your modern destination for stylish products at great prices. Browse curated
            collections across electronics, fashion, and daily essentials. Enjoy seamless shopping with a clean, fast,
            and mobile-friendly experience. For businesses and bulk buyers, our Wholesale section offers a simple bulk
            ordering flow with a flat 25% discount and live stock checks.
          </p>
          <div style={{ display: 'flex', gap: 12, marginTop: 16, flexWrap: 'wrap' }}>
            <Link to="/catalog" className="btn" style={{ background: '#fff', color: '#333' }}>🛒 Start Shopping</Link>
            <Link to="/catalog" className="btn btn-secondary">Explore</Link>
            <Link to="/wishlist" className="btn btn-ghost">View Wishlist</Link>
            {!isLoggedIn && <Link to="/auth" className="btn btn-ghost">Login / Register</Link>}
          </div>
        </div>
      </section>

      <section className="mt-3">
        <h2 style={{ color: 'var(--primary)', textAlign: 'left' }}>Why Shop with Us</h2>
        <div className="row mt-1">
          {features.map((f, idx) => (
            <div className="col-6" key={idx}>
              <div className="card" style={{ height: '100%' }}>
                <h3 style={{ marginTop: 0 }}>{f.title}</h3>
                <p style={{ margin: 0 }}>{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-3 card">
        <h2 style={{ marginTop: 0 }}>About StyleCart</h2>
        <p style={{ margin: 0, lineHeight: 1.8 }}>
          At StyleCart, we believe great design and affordability go hand in hand. Our mission is to deliver a
          frictionless shopping experience with clear navigation, fast performance, and a consistent orange-white theme that feels modern and welcoming.
        </p>
      </section>
    </div>
  )
}


