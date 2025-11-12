'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { toast } from 'react-hot-toast'

import { useCart } from '@/context/CartContext'
import { money } from '@/lib/currency'

const CartPage = () => {
  const router = useRouter()
  const searchParams = useSearchParams()

  const { items, total, updateQuantity, removeItem, clearCart } = useCart()

  const [isProcessingCheckout, setIsProcessingCheckout] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const hasAttemptedAutoCheckoutRef = useRef(false)
  const checkoutQuery = searchParams.get('checkout')

  const hasItemsInCart = useMemo(() => items.length > 0, [items])

  const checkoutPayload = useMemo(
    () =>
      items.map(({ id, title, price, quantity }) => ({
        id,
        title,
        price,
        quantity,
      })),
    [items],
  )

  const handleIncreaseQuantity = useCallback(
    (productId, currentQuantity) => {
      const item = items.find((item) => item.id === productId)
      const itemTitle = item?.title ?? 'Item'
      const newQuantity = currentQuantity + 1

      updateQuantity(productId, newQuantity)
      toast.success(`${itemTitle} quantity updated to ${newQuantity}`)
    },
    [updateQuantity, items],
  )

  const handleDecreaseQuantity = useCallback(
    (productId, currentQuantity) => {
      if (currentQuantity <= 1) {
        return
      }

      const item = items.find((item) => item.id === productId)
      const itemTitle = item?.title ?? 'Item'
      const newQuantity = currentQuantity - 1

      updateQuantity(productId, newQuantity)
      toast.success(`${itemTitle} quantity updated to ${newQuantity}`)
    },
    [updateQuantity, items],
  )

  const handleRemoveItem = useCallback(
    (product) => {
      if (!product?.id) {
        return
      }

      removeItem(product.id)
      toast.success(`${product.title ?? 'Item'} removed from cart`)
    },
    [removeItem],
  )

  const handleCheckout = useCallback(async () => {
    if (isProcessingCheckout) {
      return
    }

    if (!hasItemsInCart) {
      setErrorMessage('Your cart is empty.')
      return
    }

    setErrorMessage('')
    setIsProcessingCheckout(true)

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: checkoutPayload, total }),
      })

      if (response.status === 401) {
        setIsProcessingCheckout(false)
        router.push(`/login?redirect=${encodeURIComponent('/cart?checkout=true')}`)
        return
      }

      if (!response.ok) {
        setErrorMessage('We could not process your order. Please try again.')
        setIsProcessingCheckout(false)
        return
      }

      clearCart()
      setIsProcessingCheckout(false)
      router.push('/profile?showOrderSuccess=true')
    } catch {
      setErrorMessage('We could not process your order. Please check your connection and try again.')
      setIsProcessingCheckout(false)
    }
  }, [checkoutPayload, clearCart, hasItemsInCart, isProcessingCheckout, router, total])

  useEffect(() => {
    const shouldResumeCheckout = checkoutQuery === 'true'

    if (!shouldResumeCheckout) {
      return
    }

    if (hasAttemptedAutoCheckoutRef.current) {
      return
    }

    hasAttemptedAutoCheckoutRef.current = true
    handleCheckout()
  }, [checkoutQuery, handleCheckout])

  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-bold text-neutral-900">Your Cart</h1>
        <p className="text-sm text-neutral-600">
          Review your items, adjust quantities, and proceed to checkout when you are ready.
        </p>
      </header>

      {errorMessage ? (
        <div
          className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          role="alert"
          aria-live="polite"
        >
          {errorMessage}
        </div>
      ) : null}

      {!hasItemsInCart ? (
        <div className="rounded-2xl bg-white px-6 py-10 text-center text-neutral-600 shadow">
          Your cart is empty. Add products to continue shopping.
        </div>
      ) : (
        <div className="space-y-4">
          <ul className="space-y-3">
            {items.map((item) => (
              <li
                key={item.id}
                className="flex items-center gap-4 rounded-2xl bg-white p-4 shadow"
                aria-label={`Cart item ${item.title}`}
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="h-16 w-16 rounded-lg border border-neutral-200 object-contain"
                />

                <div className="flex-1 overflow-hidden">
                  <p className="truncate text-sm font-medium text-neutral-900">{item.title}</p>
                  <p className="text-sm text-neutral-600">{money(item.price)}</p>
                </div>

                <div className="flex items-center gap-2 rounded-full border border-neutral-200 px-2 py-1">
                  <button
                    type="button"
                    className="grid h-7 w-7 place-items-center rounded-full bg-neutral-100 text-sm font-medium text-neutral-900 transition hover:bg-neutral-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2"
                    onClick={() => handleDecreaseQuantity(item.id, item.quantity)}
                    aria-label={`Decrease quantity for ${item.title}`}
                    disabled={item.quantity <= 1}
                  >
                    -
                  </button>

                  <span className="min-w-[2ch] text-center text-sm font-semibold text-neutral-900">{item.quantity}</span>

                  <button
                    type="button"
                    className="grid h-7 w-7 place-items-center rounded-full bg-neutral-100 text-sm font-medium text-neutral-900 transition hover:bg-neutral-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2"
                    onClick={() => handleIncreaseQuantity(item.id, item.quantity)}
                    aria-label={`Increase quantity for ${item.title}`}
                  >
                    +
                  </button>
                </div>

                <button
                  type="button"
                  className="rounded-full px-3 py-1 text-sm font-medium text-red-600 transition hover:bg-red-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-2"
                  onClick={() => handleRemoveItem(item)}
                  aria-label={`Remove ${item.title} from cart`}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>

          <div className="flex flex-col gap-4 rounded-2xl bg-white p-5 shadow md:flex-row md:items-center md:justify-between">
            <div className="text-lg font-semibold text-neutral-900">
              Total:&nbsp;
              <span className="text-xl">{money(total)}</span>
            </div>

            <button
              type="button"
              onClick={handleCheckout}
              className="inline-flex items-center justify-center rounded-full bg-neutral-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-neutral-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70"
              disabled={isProcessingCheckout || !hasItemsInCart}
              aria-label="Complete checkout"
            >
              {isProcessingCheckout ? 'Processing...' : 'Checkout'}
            </button>
          </div>
        </div>
      )}
    </section>
  )
}

export default CartPage
