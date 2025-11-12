'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'

const FeaturedProductsCarouselClient = dynamic(
  () => import('./featured-products-carousel-client'),
  {
    ssr: false,
    loading: () => (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="h-64 animate-pulse rounded-2xl bg-neutral-200"
            aria-label="Loading product"
          />
        ))}
      </div>
    ),
  }
)

const FeaturedProductsCarousel = ({ products }) => {
  if (products.length === 0) {
    return (
      <div className="rounded-2xl bg-neutral-50 p-6 text-neutral-600">
        No featured products available right now. Please check back soon.
      </div>
    )
  }

  return <FeaturedProductsCarouselClient products={products} />
}

export default FeaturedProductsCarousel

