import { useEffect, useState } from 'react'
import { api, absoluteUrl } from '../api'

export default function AdminOrders() {
  const [orders, setOrders] = useState([])
  const [status, setStatus] = useState('')
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [min, setMin] = useState('')
  const [max, setMax] = useState('')

  const load = async () => {
    const params = {}
    if (status) params.status = status
    if (from) params.from = from
    if (to) params.to = to
    // Send min/max even if empty string to allow clearing filters
    if (min !== '') params.min = min
    if (max !== '') params.max = max
    const { data } = await api.get('/orders', { params })
    setOrders(data)
  }
  useEffect(() => { load() }, [])
  useEffect(() => { load() }, [status])

  const updateStatus = async (id, status) => {
    try {
      const { data } = await api.put(`/orders/${id}/status`, { status })
      if (status === 'cancelled') {
        alert('Order cancelled. Stock has been restored. The amount will be refunded to the customer\'s bank account within 5-7 business days.')
      }
      // Force refresh after a small delay to ensure database is updated
      setTimeout(() => {
        load()
      }, 300)
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to update status'
      alert(errorMsg)
      // If error is about cancelled order, refresh to show updated UI
      if (errorMsg.includes('cancelled')) {
        setTimeout(() => {
          load()
        }, 300)
      }
    }
  }

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <h2 style={{ color: 'var(--primary)', margin: 0 }}>Admin: Orders</h2>
        <button className="btn" onClick={load} style={{ background: 'var(--primary)' }}>Refresh</button>
      </div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
        <select className="input" value={status} onChange={e => setStatus(e.target.value)}>
          <option value="">All</option>
          <option value="pending">Pending</option>
          <option value="shipped">Shipped</option>
          <option value="out_for_delivery">Out for delivery</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
        <input className="input" type="date" value={from} onChange={e => setFrom(e.target.value)} />
        <input className="input" type="date" value={to} onChange={e => setTo(e.target.value)} />
        <input className="input" type="number" placeholder="Min ₹" value={min} onChange={e => setMin(e.target.value)} min="0" step="0.01" />
        <input className="input" type="number" placeholder="Max ₹" value={max} onChange={e => setMax(e.target.value)} min="0" step="0.01" />
        <button className="btn" onClick={load}>Apply</button>
        <button className="btn" onClick={() => { setStatus(''); setFrom(''); setTo(''); setMin(''); setMax(''); setTimeout(() => load(), 100); }} style={{ background: '#6b7280' }}>Clear</button>
      </div>
      <div style={{ display: 'grid', gap: 12 }}>
        {orders.map(o => (
          <div key={o._id} className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div>#{o._id.slice(-6)} • {o.customerEmail || o.buyerEmail || 'guest'}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div><strong>Status:</strong> {o.status} • <strong>Total:</strong> ₹{(o.amount || o.totalAmount)?.toFixed?.(2)}</div>
                {o.orderType === 'wholesale' && <span style={{ background: '#f59e0b', color: '#fff', padding: '2px 6px', borderRadius: 4, fontSize: 10 }}>Wholesale</span>}
              </div>
            </div>
            <div style={{ marginTop: 8, display: 'grid', gap: 8 }}>
              {o.items.map((it, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  {it.imageUrl && <img src={absoluteUrl(it.imageUrl)} alt={it.name} style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 6 }} />}
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
            <div style={{ marginTop: 8, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {o.status === 'cancelled' ? (
                <div style={{ padding: '8px 12px', background: '#fee2e2', color: '#991b1b', borderRadius: 6, fontSize: 14 }}>
                  Order is cancelled and cannot be changed
                </div>
              ) : (
                <>
                  <button className="btn" onClick={() => updateStatus(o._id, 'pending')}>Pending</button>
                  <button className="btn" onClick={() => updateStatus(o._id, 'shipped')}>Shipped</button>
                  <button className="btn" onClick={() => updateStatus(o._id, 'out_for_delivery')}>Out for delivery</button>
                  <button className="btn" onClick={() => updateStatus(o._id, 'delivered')}>Delivered</button>
                  <button className="btn" style={{ background: '#e11' }} onClick={() => updateStatus(o._id, 'cancelled')}>Cancel</button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}


