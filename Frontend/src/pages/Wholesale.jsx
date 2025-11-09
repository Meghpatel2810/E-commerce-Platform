import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../api'

export default function Wholesale() {
  const navigate = useNavigate()
  const [products, setProducts] = useState([])
  const [rows, setRows] = useState([]) // { productId, name, qty, price, discountPercent, unitPrice, lineTotal }
  const [quote, setQuote] = useState(null)
  const [email] = useState(() => { try { return localStorage.getItem('user:email') || '' } catch { return '' } })

  useEffect(() => { api.get('/products').then(({ data }) => setProducts(data.filter(p => (p.stock ?? 0) >= 10))) }, [])

  const addRow = () => setRows(r => [...r, { productId: '', name: '', qty: 10 }])
  const removeRow = (i) => setRows(r => r.filter((_, idx) => idx !== i))
  const change = (i, key, value) => setRows(r => r.map((row, idx) => {
    if (idx !== i) return row
    if (key === 'productId') {
      const p = products.find(pp => pp._id === value)
      return {
        ...row,
        productId: value,
        name: p ? p.name : '',
        price: p ? p.price : undefined,
        availableStock: p && typeof p.stock === 'number' ? p.stock : undefined,
        discountPercent: undefined,
        unitPrice: undefined,
        lineTotal: undefined,
        insufficient: undefined
      }
    }
    return { ...row, [key]: value }
  }))

  const requestQuote = async () => {
    const items = rows.filter(r => r.productId && r.qty > 0).map(r => ({ productId: r.productId, qty: Number(r.qty) }))
    if (items.length === 0) return alert('Add at least one item')
    try {
      const { data } = await api.post('/wholesale/quote', { items })
      setQuote(data)
      // merge quote into rows for display
      setRows(rows.map((r, i) => {
        const q = data.items.find(it => it.productId === r.productId)
        return q ? { ...r, name: q.name, price: q.basePrice, discountPercent: q.discountPercent, unitPrice: q.unitPrice, lineTotal: q.lineTotal, availableStock: q.availableStock, insufficient: q.insufficient } : r
      }))
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to get quote')
    }
  }

  const proceedToCheckout = () => {
    if (!email) {
      const proceed = confirm('Please login to proceed to checkout. Would you like to go to login page?')
      if (proceed) {
        navigate('/auth')
      }
      return
    }
    if (!quote) return alert('Get a quote first')
    if (quote.hasInsufficient) return alert('One or more items exceed available stock. Adjust quantities.')
    const items = rows.filter(r => r.productId && r.qty > 0).map(r => ({ productId: r.productId, qty: Number(r.qty) }))
    // Store wholesale order data in localStorage
    try {
      localStorage.setItem('wholesale:order', JSON.stringify({ items, quote, rows }))
      navigate('/checkout?type=wholesale')
    } catch (err) {
      alert('Failed to proceed to checkout')
    }
  }

  return (
    <div className="container">
      <h2 style={{ color: 'var(--primary)' }}>Wholesale Bulk Order</h2>
      <div className="card">
        <button className="btn" onClick={addRow}>Add Item</button>
        <div style={{ display: 'grid', gap: 8, marginTop: 12 }}>
          {rows.map((row, idx) => (
            <div key={idx} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr 1fr 1fr auto', gap: 8, alignItems: 'center' }}>
              <select className="input" value={row.productId} onChange={e => change(idx, 'productId', e.target.value)}>
                <option value="">Select product</option>
                {products.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
              </select>
              <input className="input" type="number" min="10" value={row.qty} onChange={e => change(idx, 'qty', e.target.value)} />
              <div>{row.price ? `₹${row.price}` : '-'}</div>
              <div>{row.discountPercent != null ? `${row.discountPercent}%` : '-'}</div>
              <div>{row.unitPrice ? `₹${row.unitPrice}` : '-'}</div>
              <div>{row.lineTotal ? `₹${row.lineTotal}` : '-'}</div>
              <div style={{ fontSize: 12, color: (row.insufficient || (row.availableStock!=null && Number(row.qty)>Number(row.availableStock))) ? '#b00' : '#666' }}>{row.availableStock != null ? `Stock: ${row.availableStock}` : '-'}</div>
              <button className="btn" style={{ background: '#e11' }} onClick={() => removeRow(idx)}>Remove</button>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
          <button className="btn" onClick={requestQuote}>Get Quote</button>
          <button className="btn" onClick={proceedToCheckout} disabled={!quote}>Proceed to Checkout</button>
        </div>
        {quote && (
          <div style={{ marginTop: 12 }}>
            <strong>Total: ₹{quote.totalAmount.toFixed(2)}</strong>
          </div>
        )}
      </div>
    </div>
  )
}


