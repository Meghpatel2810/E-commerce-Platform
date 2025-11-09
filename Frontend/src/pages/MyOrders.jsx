import { useEffect, useState } from 'react'
import { api, absoluteUrl } from '../api'

export default function MyOrders() {
  const [orders, setOrders] = useState([])
  const [email] = useState(() => {
    try { return localStorage.getItem('user:email') || '' } catch { return '' }
  })

  const load = async () => {
    if (!email) return
    const { data } = await api.get('/orders/mine', { params: { email } })
    setOrders(data)
  }

  useEffect(() => {
    load()
  }, [email])

  const cancelOrder = async (orderId) => {
    if (!confirm('Are you sure you want to cancel this order?')) return
    try {
      const { data } = await api.put(`/orders/${orderId}/cancel`, {}, { params: { email } })
      alert('Order cancelled successfully. The amount will be refunded to your bank account within 5-7 business days.')
      // Force refresh after a small delay to ensure database is updated
      setTimeout(() => {
        load()
      }, 300)
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to cancel order')
    }
  }

  if (!email) return <div className="container">Login first to view orders.</div>

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <h2 style={{ color: 'var(--primary)', margin: 0 }}>My Orders</h2>
        <button className="btn" onClick={load} style={{ background: 'var(--primary)' }}>Refresh</button>
      </div>
      {orders.length === 0 ? (<p>No orders yet.</p>) : (
        <div style={{ display: 'grid', gap: 12 }}>
          {orders.map(o => (
            <div key={o._id} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>Order #{o._id.slice(-6)}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{
                    background: o.status==='delivered' ? '#16a34a' : o.status==='out_for_delivery' ? '#f59e0b' : o.status==='shipped' ? '#f97316' : o.status==='cancelled' ? '#ef4444' : '#6b7280',
                    color: '#fff', padding: '4px 8px', borderRadius: 999, fontSize: 12, textTransform: 'capitalize'
                  }}>{o.status.replaceAll('_',' ')}</span>
                  <strong>Total: ₹{(o.amount || o.totalAmount)?.toFixed?.(2)}</strong>
                  {o.orderType === 'wholesale' && <span style={{ background: '#f59e0b', color: '#fff', padding: '2px 6px', borderRadius: 4, fontSize: 10 }}>Wholesale</span>}
                </div>
              </div>
              <div style={{ marginTop: 8, display: 'grid', gap: 8 }}>
                {o.items.map((it, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    {it.imageUrl && <img src={absoluteUrl(it.imageUrl)} alt={it.name} style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 6 }} />}
                    <div style={{ flex: 1, textAlign: 'left' }}>{it.name}</div>
                    <div>
                      {o.orderType === 'wholesale' ? (
                        <>
                          ₹{it.unitPrice?.toFixed?.(2) || it.basePrice?.toFixed?.(2) || '0.00'} × {it.qty}
                          {it.basePrice && it.unitPrice && it.basePrice !== it.unitPrice && (
                            <span style={{ fontSize: 11, color: '#666', marginLeft: 4 }}>
                              (was ₹{it.basePrice.toFixed(2)})
                            </span>
                          )}
                        </>
                      ) : (
                        <>₹{it.price?.toFixed?.(2) || '0.00'} × {it.qty}</>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 6, fontSize: 12, color: '#666' }}>{new Date(o.createdAt).toLocaleString()}</div>
              {o.status !== 'cancelled' && o.status !== 'delivered' && (
                <div style={{ marginTop: 8 }}>
                  <button className="btn" style={{ background: '#e11' }} onClick={() => cancelOrder(o._id)}>Cancel Order</button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}


