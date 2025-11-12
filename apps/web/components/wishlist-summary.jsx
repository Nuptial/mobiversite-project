"use client";

import Link from "next/link";

import { money } from "@/lib/currency";
import { useWishlist } from "@/context/WishlistContext";

const WishlistSummary = () => {
  const { items, itemCount } = useWishlist();
  const hasItems = itemCount > 0;
  const previewItems = items.slice(0, 3);

  return (
    <section className="space-y-3 rounded-2xl bg-white p-6 shadow">
      <header className="space-y-1">
        <h2 className="text-lg font-semibold text-neutral-900">Wishlist</h2>
        <p className="text-sm text-neutral-600">
          {hasItems
            ? `You have ${itemCount} saved item${itemCount === 1 ? "" : "s"}`
            : "No items saved yet."}
        </p>
      </header>
      {hasItems ? (
        <ul className="space-y-2">
          {previewItems.map((item) => (
            <li
              key={item.id}
              className="flex items-center justify-between gap-2 rounded-xl bg-neutral-50 px-3 py-2"
            >
              <span className="text-sm font-medium text-neutral-800 line-clamp-1">
                {item.title}
              </span>
              <span className="text-sm text-neutral-600">
                {money(item.price)}
              </span>
            </li>
          ))}
        </ul>
      ) : null}
      <div className="pt-1">
        <Link
          href="/wishlist"
          className="text-sm font-semibold text-neutral-900 underline underline-offset-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2"
        >
          View wishlist
        </Link>
      </div>
    </section>
  );
};

export default WishlistSummary;
