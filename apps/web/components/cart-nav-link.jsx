"use client";

import Link from "next/link";

import { useCart } from "@/context/CartContext";

const CartNavLink = () => {
  const { itemCount } = useCart();

  return (
    <Link
      href="/cart"
      className="relative inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium text-neutral-900 transition hover:bg-neutral-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2 sm:px-3 sm:text-sm"
      aria-label={`View cart with ${itemCount} item${
        itemCount === 1 ? "" : "s"
      }`}
    >
      <span className="leading-none">Cart</span>
      <span
        className="grid min-h-[1.25rem] min-w-[1.25rem] place-items-center rounded-full bg-neutral-900 px-1.5 text-[0.625rem] font-semibold text-white sm:min-h-[1.5rem] sm:min-w-[1.5rem] sm:px-2 sm:text-xs"
        aria-hidden="true"
      >
        {itemCount}
      </span>
    </Link>
  );
};

export default CartNavLink;
