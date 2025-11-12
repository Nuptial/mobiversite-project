'use client'

import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react'

const WISHLIST_STORAGE_KEY = 'wishlist'

const WishlistContext = createContext(undefined)

const readStoredWishlist = () => {
  if (typeof window === 'undefined') return []

  const storedValue = window.localStorage.getItem(WISHLIST_STORAGE_KEY)
  if (!storedValue) return []

  try {
    const parsedValue = JSON.parse(storedValue)
    return Array.isArray(parsedValue) ? parsedValue : []
  } catch {
    return []
  }
}

const WishlistProvider = ({ children }) => {
  const [items, setItems] = useState([])
  const hasHydratedRef = useRef(false)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const storedItems = readStoredWishlist()
    if (!storedItems.length) {
      hasHydratedRef.current = true
      return
    }

    setItems(storedItems)
    hasHydratedRef.current = true
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (!hasHydratedRef.current) return

    window.localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(items))
  }, [items])

  const addItem = (product) => {
    if (!product?.id) return

    setItems((previousItems) => {
      const exists = previousItems.some((item) => item.id === product.id)
      if (exists) return previousItems

      const nextItem = {
        id: product.id,
        title: product.title,
        price: Number(product.price) || 0,
        image: product.image ?? '',
      }

      return [...previousItems, nextItem]
    })
  }

  const removeItem = (productId) => {
    setItems((previousItems) => previousItems.filter((item) => item.id !== productId))
  }

  const toggleItem = (product) => {
    if (!product?.id) return

    setItems((previousItems) => {
      const exists = previousItems.some((item) => item.id === product.id)
      if (exists) {
        return previousItems.filter((item) => item.id !== product.id)
      }

      const nextItem = {
        id: product.id,
        title: product.title,
        price: Number(product.price) || 0,
        image: product.image ?? '',
      }

      return [...previousItems, nextItem]
    })
  }

  const wishlistIds = useMemo(() => new Set(items.map((item) => item.id)), [items])

  const isInWishlist = (productId) => wishlistIds.has(productId)

  const clearWishlist = () => {
    setItems([])
  }

  const itemCount = items.length

  const value = {
    items,
    itemCount,
    addItem,
    removeItem,
    toggleItem,
    isInWishlist,
    clearWishlist,
  }

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>
}

const useWishlist = () => {
  const context = useContext(WishlistContext)
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider')
  }

  return context
}

export { WishlistProvider, useWishlist }
