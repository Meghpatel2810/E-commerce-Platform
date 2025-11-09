import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try { return JSON.parse(localStorage.getItem('cart:v1') || '[]') } catch { return [] }
  })

  useEffect(() => {
    localStorage.setItem('cart:v1', JSON.stringify(items))
  }, [items])

  const add = (product, qty = 1) => {
    setItems(prev => {
      const idx = prev.findIndex(p => p._id === product._id)
      if (idx >= 0) {
        const next = [...prev]
        next[idx] = { ...next[idx], qty: next[idx].qty + qty }
        return next
      }
      return [...prev, { ...product, qty }]
    })
  }

  const remove = (id) => setItems(prev => prev.filter(p => p._id !== id))
  const setQty = (id, qty) => setItems(prev => prev.map(p => p._id === id ? { ...p, qty } : p))
  const clear = () => setItems([])

  const total = useMemo(() => items.reduce((s, p) => s + p.price * p.qty, 0), [items])
  const count = useMemo(() => items.reduce((s, p) => s + p.qty, 0), [items])

  return (
    <CartContext.Provider value={{ items, add, remove, setQty, clear, total, count }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)


