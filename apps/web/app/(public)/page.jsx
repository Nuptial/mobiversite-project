import Link from "next/link"
import FeaturedProductsCarousel from "@/components/featured-products-carousel"
import { getCurrentUser } from "@/lib/auth"

const fetchFeaturedProducts = async () => {
  if (!process.env.NEXT_PUBLIC_API_URL) {
    return []
  }

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`, {
      next: { revalidate: 60 },
    })

    if (!response.ok) {
      return []
    }

    const data = await response.json()

    if (!Array.isArray(data)) {
      return []
    }

    return data.slice(0, 10)
  } catch (error) {
    console.error("Failed to load featured products", error)
    return []
  }
}

const benefits = [
  {
    title: "Fast shipping",
    description: "Delivered to your door in 2-3 days with real-time tracking.",
  },
  {
    title: "Curated catalog",
    description: "Only high-quality tech we would use ourselves makes the cut.",
  },
  {
    title: "24/7 support",
    description: "Experts on standby to help with sizing, setup, and returns.",
  },
]

const collections = [
  {
    title: "WFH essentials",
    description: "Build a productive desk setup with ergonomic gear.",
    href: "/products?collection=wfh",
  },
  {
    title: "Gifts under $100",
    description: "Thoughtful picks that don’t break the bank.",
    href: "/products?collection=gifts",
  },
  {
    title: "Outdoor tech",
    description: "Rugged devices ready for any adventure.",
    href: "/products?collection=outdoor",
  },
]

const testimonials = [
  {
    quote:
      "Mobiversite helped me set up a complete home office in a weekend. Everything shipped fast and support was top-notch.",
    name: "Jamie L.",
    role: "Product Designer",
  },
  {
    quote:
      "Great curation! I found brands I hadn’t heard of but now recommend to all my friends.",
    name: "Carlos M.",
    role: "Tech Blogger",
  },
]

const HomePage = async () => {
  const [featuredProducts, currentUser] = await Promise.all([
    fetchFeaturedProducts(),
    getCurrentUser(),
  ])

  return (
    <div className="space-y-16">
      <section className="rounded-3xl bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 text-white">
        <div className="mx-auto flex max-w-5xl flex-col gap-6 px-6 py-16 text-center md:px-10">
          <div className="space-y-4">
            <span className="inline-flex items-center justify-center rounded-full bg-white/10 px-4 py-1 text-xs uppercase tracking-[0.2em] text-white/80">
              New arrivals drop weekly
            </span>
            <h1 className="text-3xl font-semibold leading-tight md:text-4xl">
              Discover curated tech gear built to elevate every moment
            </h1>
            <p className="text-base text-white/80 md:text-lg">
              From home office must-haves to outdoor essentials, find products vetted by experts and loved by our community.
            </p>
          </div>
          <div className="flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/products"
              className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-neutral-900 transition hover:bg-neutral-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-900"
            >
              Shop products
            </Link>
            <Link
              href="/products?collection=new"
              className="inline-flex items-center justify-center rounded-full border border-white/40 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-900"
            >
              Browse new arrivals
            </Link>
          </div>
        </div>
      </section>

      <section className="grid gap-4 rounded-3xl bg-white p-6 shadow-sm md:grid-cols-3 md:p-10">
        {benefits.map((benefit) => (
          <div key={benefit.title} className="space-y-2">
            <h2 className="text-lg font-semibold text-neutral-900">{benefit.title}</h2>
            <p className="text-sm text-neutral-600">{benefit.description}</p>
          </div>
        ))}
      </section>

      <section className="space-y-6">
        <header className="space-y-2">
          <h2 className="text-2xl font-bold text-neutral-900">Featured collections</h2>
          <p className="text-sm text-neutral-600">
            Start with handpicked themes to quickly find the right gear for any moment.
          </p>
        </header>
        <div className="grid gap-4 md:grid-cols-3">
          {collections.map((collection) => (
            <Link
              key={collection.title}
              href={collection.href}
              className="group rounded-2xl bg-white p-6 shadow transition hover:-translate-y-1 hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2"
            >
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-neutral-900">{collection.title}</h3>
                <p className="text-sm text-neutral-600">{collection.description}</p>
                <span className="text-sm font-semibold text-neutral-900 underline-offset-4 group-hover:underline">
                  Explore collection
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="space-y-10">
        <header className="space-y-2">
          <h2 className="text-2xl font-semibold text-neutral-900">Featured products</h2>
          <p className="text-sm text-neutral-600">Explore a curated selection picked just for you.</p>
        </header>
        <FeaturedProductsCarousel
          products={featuredProducts}
          isAuthenticated={Boolean(currentUser)}
        />
      </section>

      <section className="rounded-3xl bg-white p-8 shadow-sm md:p-12">
        <header className="space-y-2 text-center">
          <h2 className="text-2xl font-bold text-neutral-900">Loved by thousands of creators</h2>
          <p className="text-sm text-neutral-600">
            See how Mobiversite empowers teams and solo makers across the globe.
          </p>
        </header>
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {testimonials.map((testimonial) => (
            <div key={testimonial.name} className="rounded-2xl border border-neutral-100 bg-neutral-50 p-6 shadow-sm">
              <p className="text-sm text-neutral-700">“{testimonial.quote}”</p>
              <div className="mt-4 text-sm font-semibold text-neutral-900">{testimonial.name}</div>
              <div className="text-sm text-neutral-500">{testimonial.role}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-3xl bg-neutral-900 p-8 text-white md:p-12">
        <div className="mx-auto flex max-w-3xl flex-col gap-6 text-center">
          <header className="space-y-2">
            <h2 className="text-2xl font-semibold md:text-3xl">Stay in the loop</h2>
            <p className="text-sm text-white/80">
              Get our latest drops, guides, and exclusive offers. No spam—just helpful insights once a week.
            </p>
          </header>
          <form className="flex flex-col gap-3 sm:flex-row">
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full rounded-full border border-white/30 bg-white/10 px-4 py-3 text-sm text-white placeholder:text-white/60 focus:border-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
              aria-label="Email address"
              required
            />
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-neutral-900 transition hover:bg-neutral-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-900"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </div>
  )
}

export default HomePage
