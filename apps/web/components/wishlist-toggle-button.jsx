"use client";

import { useMemo } from "react";
import clsx from "clsx";
import Link from "next/link";
import { Star } from "lucide-react";
import { toast } from "react-hot-toast";

import { useWishlist } from "@/context/WishlistContext";

const WishlistToggleButton = ({
  product,
  size = "md",
  isAuthenticated = true,
}) => {
  const { toggleItem, isInWishlist } = useWishlist();

  const normalizedProduct = useMemo(() => {
    if (!product) return undefined;

    return {
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.image,
    };
  }, [product]);

  if (!isAuthenticated) {
    return (
      <Link
        href="/login"
        className={clsx(
          "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full border border-neutral-200 px-4 py-2 text-xs font-semibold text-neutral-600 transition hover:bg-neutral-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2",
          size === "sm" && "px-3 py-1.5"
        )}
      >
        <Star
          className="h-4 w-4 text-neutral-300"
          strokeWidth={1.8}
          aria-hidden="true"
        />
        <span>Login to save</span>
      </Link>
    );
  }

  const productId = normalizedProduct?.id;
  const wishlisted = productId ? isInWishlist(productId) : false;

  const notify = (nextWishlisted) => {
    const title = normalizedProduct?.title ?? "Item";
    if (nextWishlisted) {
      toast.success(`${title} added to your wishlist`);
      return;
    }

    toast(`${title} removed from wishlist`, {
      icon: "🗑️",
      className: "rounded-2xl bg-neutral-900 text-white text-sm font-medium",
    });
  };

  const handleToggleClick = () => {
    if (!normalizedProduct?.id) return;

    toggleItem(normalizedProduct);
    notify(!wishlisted);
  };

  const handleToggleKeyDown = (event) => {
    if (event.key !== "Enter" && event.key !== " ") return;

    event.preventDefault();
    handleToggleClick();
  };

  const buttonClasses = clsx(
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full border text-xs font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2",
    wishlisted
      ? "border-amber-300 bg-amber-100/60 text-neutral-900 hover:bg-amber-100"
      : "border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-100",
    size === "sm" ? "px-3 py-1.5" : "px-4 py-2.5"
  );

  const iconClasses = wishlisted ? "text-amber-500" : "text-neutral-400";

  return (
    <button
      type="button"
      onClick={handleToggleClick}
      onKeyDown={handleToggleKeyDown}
      className={buttonClasses}
      aria-pressed={wishlisted}
      aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
    >
      <Star
        className={clsx("h-4 w-4 transition-colors duration-150", iconClasses)}
        strokeWidth={1.8}
        fill={wishlisted ? "currentColor" : "none"}
        aria-hidden="true"
      />
      <span>{wishlisted ? "Wishlisted" : "Add to wishlist"}</span>
    </button>
  );
};

export default WishlistToggleButton;
