import WishlistSummary from '@/components/wishlist-summary'
import { headers } from 'next/headers'

import { money } from '@/lib/currency'

const formatOrderDate = (value) => {
  try {
    const formatter = new Intl.DateTimeFormat('en-US', {
      dateStyle: 'medium',
      timeStyle: 'short',
      timeZone: 'UTC',
    })

    return formatter.format(new Date(value))
  } catch {
    return 'Unknown date'
  }
}

const buildBaseUrl = async () => {
  if (process.env.NEXT_PUBLIC_BASE_URL) return process.env.NEXT_PUBLIC_BASE_URL

  const incomingHeaders = await headers()
  const protocol = incomingHeaders.get('x-forwarded-proto') ?? 'http'
  const host = incomingHeaders.get('x-forwarded-host') ?? incomingHeaders.get('host')

  if (!host) return 'http://localhost:3000'

  return `${protocol}://${host}`
}

const loadOrders = async () => {
  const incomingHeaders = await headers()
  const baseUrl = await buildBaseUrl()
  const response = await fetch(`${baseUrl}/api/orders`, {
    cache: 'no-store',
    headers: {
      cookie: incomingHeaders.get('cookie') ?? '',
    },
  })

  if (!response.ok) return null

  return response.json()
}

const ProfilePage = async ({ searchParams }) => {
  const resolvedSearchParams = await searchParams
  const orders = await loadOrders()
  if (!orders) {
    return <div className="py-10">Please login again.</div>
  }

  const showOrderSuccess = resolvedSearchParams?.showOrderSuccess === 'true'
  const hasOrders = Array.isArray(orders) && orders.length > 0

  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-bold text-neutral-900">My Orders</h1>
        <p className="text-sm text-neutral-600">Track your recent purchases and their status.</p>
      </header>

      {showOrderSuccess ? (
        <div
          className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700"
          role="status"
          aria-live="polite"
        >
          Your order has been placed successfully.
        </div>
      ) : null}

      {!hasOrders ? (
        <div className="rounded-2xl bg-white px-6 py-10 text-center text-neutral-600 shadow">
          You do not have any orders yet.
        </div>
      ) : (
        <ul className="space-y-3">
          {orders.map((order) => (
            <li key={order.id} className="rounded-2xl bg-white p-4 shadow">
              <div className="text-sm text-neutral-500">{formatOrderDate(order.date)}</div>
              <div className="text-lg font-semibold text-neutral-900">Total: {money(order.total)}</div>
              <div className="text-sm text-neutral-600">Items: {order.items?.length ?? 0}</div>
            </li>
          ))}
        </ul>
      )}

      <WishlistSummary />
    </section>
  )
}

export default ProfilePage
