'use client'

import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react'

const CART_STORAGE_KEY = 'cart'

const CartContext = createContext(undefined)

const readStoredCartItems = () => {
  if (typeof window === 'undefined') {
    return []
  }

  const storedValue = window.localStorage.getItem(CART_STORAGE_KEY)
  if (!storedValue) {
    return []
  }

  try {
    const parsedValue = JSON.parse(storedValue)
    return Array.isArray(parsedValue) ? parsedValue : []
  } catch {
    return []
  }
}

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState([])
  const hasHydratedRef = useRef(false)

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    const storedItems = readStoredCartItems()
    if (!storedItems.length) {
      hasHydratedRef.current = true
      return
    }

    setItems(storedItems)
    hasHydratedRef.current = true
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    if (!hasHydratedRef.current) {
      return
    }

    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items))
  }, [items])

  const addItem = (product) => {
    if (!product?.id) {
      return
    }

    setItems((previousItems) => {
      const existingItem = previousItems.find((item) => item.id === product.id)

      if (!existingItem) {
        const nextItem = {
          id: product.id,
          title: product.title,
          price: Number(product.price) || 0,
          quantity: 1,
          image: product.image ?? '',
        }

        return [...previousItems, nextItem]
      }

      return previousItems.map((item) => {
        if (item.id !== product.id) {
          return item
        }

        return {
          ...item,
          quantity: item.quantity + 1,
        }
      })
    })
  }

  const updateQuantity = (productId, quantity) => {
    const resolvedQuantity = Number.parseInt(String(quantity), 10)
    const nextQuantity = Number.isFinite(resolvedQuantity) ? Math.max(1, resolvedQuantity) : 1

    setItems((previousItems) =>
      previousItems.map((item) => {
        if (item.id !== productId) {
          return item
        }

        if (item.quantity === nextQuantity) {
          return item
        }

        return {
          ...item,
          quantity: nextQuantity,
        }
      }),
    )
  }

  const removeItem = (productId) => {
    setItems((previousItems) => previousItems.filter((item) => item.id !== productId))
  }

  const clearCart = () => {
    setItems([])
  }

  const total = useMemo(
    () => items.reduce((runningTotal, item) => runningTotal + item.price * item.quantity, 0),
    [items],
  )

  const itemCount = useMemo(() => items.reduce((runningTotal, item) => runningTotal + item.quantity, 0), [items])

  const value = {
    items,
    total,
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
    itemCount,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export const useCart = () => {
  const context = useContext(CartContext)

  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }

  return context
}
