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

  const sortedOrders = hasOrders
    ? [...orders].sort((a, b) => {
        const dateA = new Date(a.date).getTime()
        const dateB = new Date(b.date).getTime()
        return dateB - dateA
      })
    : []

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
        <ul className="space-y-4">
          {sortedOrders.map((order) => (
            <li key={order.id} className="rounded-2xl bg-white shadow">
              <div className="p-4 sm:p-6">
                <div className="mb-4 flex items-start justify-between gap-4 border-b border-neutral-200 pb-4">
                  <div className="flex-1 space-y-1">
                    <div className="text-xs font-medium uppercase tracking-wide text-neutral-500">
                      {formatOrderDate(order.date)}
                    </div>
                    {order.items && order.items.length > 0 && (
                      <div className="text-xs text-neutral-600">
                        {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                      </div>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-medium text-neutral-500">Total</div>
                    <div className="text-xl font-bold text-neutral-900">{money(order.total)}</div>
                  </div>
                </div>

                {order.items && order.items.length > 0 && (
                  <div>
                    <ul className="space-y-2">
                      {order.items.map((item, index) => (
                        <li
                          key={item.id ?? index}
                          className="flex items-center justify-between gap-4 rounded-lg border border-neutral-200 px-3 py-2.5"
                        >
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-neutral-900">{item.title ?? 'Unknown Item'}</p>
                            <div className="mt-0.5 flex items-center gap-2 text-xs text-neutral-500">
                              <span>Quantity: {item.quantity ?? 1}</span>
                              {item.price && <span>× {money(item.price)}</span>}
                            </div>
                          </div>
                          {item.price && item.quantity && (
                            <div className="shrink-0 text-right">
                              <div className="text-sm font-semibold text-neutral-900">
                                {money(item.price * item.quantity)}
                              </div>
                            </div>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}

      <WishlistSummary />
    </section>
  )
}

export default ProfilePage
