'use client'

import { useMemo, useState } from 'react'
import { toast } from 'react-hot-toast'

import { useCart } from '@/context/CartContext'

const AddToCartButton = ({ product }) => {
  const { addItem } = useCart()

  const [isAdding, setIsAdding] = useState(false)

  const normalizedProduct = useMemo(() => {
    if (!product) {
      return undefined
    }

    return {
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.image,
    }
  }, [product])

  const handleAddToCart = () => {
    if (isAdding) {
      return
    }

    if (!normalizedProduct?.id) {
      return
    }

    setIsAdding(true)
    addItem(normalizedProduct)
    toast.success(`${normalizedProduct.title ?? 'Item'} added to cart`)
    setIsAdding(false)
  }

  const handleKeyDown = (event) => {
    if (event.key !== 'Enter' && event.key !== ' ') {
      return
    }

    event.preventDefault()
    handleAddToCart()
  }

  return (
    <button
      type="button"
      className="inline-flex w-full items-center justify-center rounded-full bg-neutral-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-neutral-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70"
      onClick={handleAddToCart}
      onKeyDown={handleKeyDown}
      aria-label="Add this product to cart"
      disabled={isAdding}
    >
      {isAdding ? 'Adding...' : 'Add to cart'}
    </button>
  )
}

export default AddToCartButton

