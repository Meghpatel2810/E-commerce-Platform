import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const WishlistContext = createContext(null)

export function WishlistProvider({ children }) {
  const [items, setItems] = useState(() => {
    try { return JSON.parse(localStorage.getItem('wishlist:v1') || '[]') } catch { return [] }
  })

  useEffect(() => {
    localStorage.setItem('wishlist:v1', JSON.stringify(items))
  }, [items])

  const add = (product) => {
    setItems(prev => prev.some(p => p._id === product._id) ? prev : [...prev, product])
  }
  const remove = (id) => setItems(prev => prev.filter(p => p._id !== id))
  const toggle = (product) => setItems(prev => prev.some(p => p._id === product._id) ? prev.filter(p => p._id !== product._id) : [...prev, product])
  const has = (id) => items.some(p => p._id === id)
  const count = useMemo(() => items.length, [items])

  return (
    <WishlistContext.Provider value={{ items, add, remove, toggle, has, count }}>
      {children}
    </WishlistContext.Provider>
  )
}

export const useWishlist = () => useContext(WishlistContext)


