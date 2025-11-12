'use client'

import Link from 'next/link'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import { money } from '@/lib/currency'

const FeaturedProductsCarouselClient = ({ products }) => {
  return (
    <Carousel className="w-full">
      <CarouselContent className="md:-ml-3 lg:-ml-4">
        {products.map((product) => (
          <CarouselItem
            key={product.id}
            className="md:basis-1/2 md:pl-3 lg:basis-1/3 xl:basis-1/4 2xl:basis-1/5"
            aria-label={`Featured product ${product.title}`}
          >
            <Link
              href={`/products/${product.id}`}
              aria-label={`View details for ${product.title}`}
              className="flex h-full flex-col justify-between gap-4 rounded-2xl bg-white p-4 shadow-sm transition-transform duration-200 ease-out hover:-translate-y-1 hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2"
            >
              <div className="flex justify-center">
                <img
                  src={product.image}
                  alt={product.title}
                  className="h-40 w-full max-w-[200px] object-contain"
                />
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-neutral-900 line-clamp-2">{product.title}</p>
                <p className="text-lg font-semibold text-neutral-900">{money(product.price)}</p>
              </div>
            </Link>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  )
}

export default FeaturedProductsCarouselClient

