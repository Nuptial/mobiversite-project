"use client";

import Link from "next/link";

import { money } from "@/lib/currency";

import AddToCartButton from "./add-to-cart-button";
import WishlistToggleButton from "./wishlist-toggle-button";

const ProductCard = ({ product, isAuthenticated = true }) => {
  if (!product) return null;

  const { id, title, price, image } = product;

  return (
    <article className="flex h-full flex-col rounded-2xl bg-white p-4 shadow transition-transform duration-200 ease-out hover:-translate-y-1 hover:shadow-lg focus-within:-translate-y-1 focus-within:shadow-xl">
      <Link
        href={`/products/${id}`}
        className="flex flex-1 flex-col focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2"
        aria-label={`View details for ${title}`}
      >
        <div className="flex flex-1 items-center justify-center">
          <img src={image} alt={title} className="h-32 w-full object-contain" />
        </div>
        <div className="mt-3 space-y-1">
          <p className="text-sm font-medium text-neutral-900 line-clamp-2">
            {title}
          </p>
          <p className="text-sm font-semibold text-neutral-700">
            {money(price)}
          </p>
        </div>
      </Link>
      <div className="mt-4 flex flex-col gap-2">
        <AddToCartButton product={product} size="sm" />
        {isAuthenticated && (
          <WishlistToggleButton
            product={product}
            size="sm"
            isAuthenticated={isAuthenticated}
          />
        )}
      </div>
    </article>
  );
};

export default ProductCard;
