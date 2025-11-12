import AddToCartButton from '@/components/add-to-cart-button'
import WishlistToggleButton from '@/components/wishlist-toggle-button'
import { money } from '@/lib/currency'
import { getCurrentUser } from '@/lib/auth'

const ProductDetail = async ({ params }) => {
  const resolvedParams = await params
  if (!resolvedParams?.id) {
    return <div className="py-10">Product not found.</div>
  }

  const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000'
  const response = await fetch(`${baseUrl}/products/${resolvedParams.id}`, { cache: 'no-store' })
  if (!response.ok) {
    return <div className="py-10">Product not found.</div>
  }

  const product = await response.json()
  const currentUser = await getCurrentUser()
  const normalizedProduct = {
    id: product.id,
    title: product.title,
    price: product.price,
    image: product.image,
  }

  return (
    <section className="grid gap-8 rounded-2xl bg-white p-6 shadow md:grid-cols-2">
      <img src={product.image} alt={product.title} className="h-72 w-full object-contain" />
      <div className="space-y-5">
        <header className="space-y-3">
          <h1 className="text-2xl font-bold text-neutral-900">{product.title}</h1>
          <p className="text-sm text-neutral-600">{product.description}</p>
          <p className="text-2xl font-semibold text-neutral-900">{money(product.price)}</p>
        </header>
        <div className="flex flex-col gap-3 sm:flex-row">
          <AddToCartButton product={normalizedProduct} />
          <WishlistToggleButton product={normalizedProduct} isAuthenticated={Boolean(currentUser)} />
        </div>
      </div>
    </section>
  )
}

export default ProductDetail
