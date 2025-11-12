import ProductCard from '@/components/product-card'
import { getCurrentUser } from '@/lib/auth'

export const revalidate = 60

const ProductsPage = async () => {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000'
  const response = await fetch(`${baseUrl}/products`, { cache: 'no-store' })
  if (!response.ok) {
    return <div className="py-10 text-neutral-600">Products are unavailable right now. Please try again later.</div>
  }

  const products = await response.json()
  const currentUser = await getCurrentUser()

  if (!Array.isArray(products) || products.length === 0) {
    return <div className="py-10 text-neutral-600">No products found.</div>
  }

  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-bold text-neutral-900">Products</h1>
        <p className="text-sm text-neutral-600">Explore our latest catalog and save items to your wishlist.</p>
      </header>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} isAuthenticated={Boolean(currentUser)} />
        ))}
      </div>
    </section>
  )
}

export default ProductsPage
