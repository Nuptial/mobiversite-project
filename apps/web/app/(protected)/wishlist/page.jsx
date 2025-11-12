'use client'

import Link from 'next/link'

import AddToCartButton from '@/components/add-to-cart-button'
import { money } from '@/lib/currency'
import { useWishlist } from '@/context/WishlistContext'

const WishlistPage = () => {
  const { items, removeItem, isHydrated } = useWishlist()
  const hasItems = items.length > 0

  const handleRemove = (productId) => {
    removeItem(productId)
  }

  if (!isHydrated) {
    return (
      <section className="rounded-2xl bg-white p-8 shadow">
        <div className="flex h-64 items-center justify-center">
          <div className="flex flex-col items-center gap-3" role="status" aria-live="polite">
            <span className="inline-block h-10 w-10 animate-spin rounded-full border-4 border-neutral-300 border-t-neutral-900" />
            <span className="text-sm font-medium text-neutral-600">Loading wishlist...</span>
          </div>
        </div>
      </section>
    )
  }

  if (!hasItems) {
    return (
      <section className="rounded-2xl bg-white p-8 text-center shadow">
        <h1 className="text-2xl font-bold text-neutral-900">Wishlist</h1>
        <p className="mt-3 text-sm text-neutral-600">Save products you love and revisit them anytime.</p>
        <div className="mt-6">
          <Link
            href="/products"
            className="inline-flex items-center rounded-full bg-neutral-900 px-5 py-2 text-sm font-semibold text-white transition hover:bg-neutral-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2"
          >
            Browse products
          </Link>
        </div>
      </section>
    )
  }

  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-bold text-neutral-900">Wishlist</h1>
        <p className="text-sm text-neutral-600">Manage your saved items and move them to your cart when you are ready.</p>
      </header>
      <ul className="grid gap-4 sm:grid-cols-2">
        {items.map((item) => (
          <li key={item.id} className="flex flex-col justify-between rounded-2xl bg-white p-5 shadow">
            <div className="flex items-center gap-4">
              <img src={item.image} alt={item.title} className="h-20 w-20 rounded-xl bg-neutral-100 object-contain" />
              <div className="space-y-1">
                <Link
                  href={`/products/${item.id}`}
                  className="text-sm font-semibold text-neutral-900 underline-offset-4 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2"
                >
                  {item.title}
                </Link>
                <p className="text-sm text-neutral-600">{money(item.price)}</p>
              </div>
            </div>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <AddToCartButton product={item} />
              <button
                type="button"
                onClick={() => handleRemove(item.id)}
                className="inline-flex items-center justify-center rounded-full border border-neutral-200 px-4 py-2 text-sm font-semibold text-neutral-700 transition hover:bg-neutral-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2"
                aria-label={`Remove ${item.title} from wishlist`}
              >
                Remove
              </button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}

export default WishlistPage
