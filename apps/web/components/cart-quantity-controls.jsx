"use client";

import { useCallback } from "react";
import { toast } from "react-hot-toast";

import { useCart } from "@/context/CartContext";

const CartQuantityControls = ({ product, size = "md" }) => {
  const { items, updateQuantity, removeItem } = useCart();

  const cartItem = items.find((item) => item.id === product?.id);
  const currentQuantity = cartItem?.quantity ?? 0;

  // If item is not in cart, don't render (shouldn't happen, but safety check)
  if (!cartItem || currentQuantity === 0) {
    return null;
  }

  const handleIncreaseQuantity = useCallback(() => {
    if (!product?.id) {
      return;
    }

    const itemTitle = product.title ?? "Item";
    const newQuantity = currentQuantity + 1;

    updateQuantity(product.id, newQuantity);
    toast.success(`${itemTitle} quantity updated to ${newQuantity}`);
  }, [product, currentQuantity, updateQuantity]);

  const handleDecreaseQuantity = useCallback(() => {
    if (!product?.id) {
      return;
    }

    const itemTitle = product.title ?? "Item";

    if (currentQuantity <= 1) {
      // Remove from cart when quantity would be 0
      removeItem(product.id);
      toast.success(`${itemTitle} removed from cart`);
      return;
    }

    const newQuantity = currentQuantity - 1;
    updateQuantity(product.id, newQuantity);
    toast.success(`${itemTitle} quantity updated to ${newQuantity}`);
  }, [product, currentQuantity, updateQuantity, removeItem]);

  const handleDecreaseKeyDown = useCallback(
    (event) => {
      if (event.key !== "Enter" && event.key !== " ") {
        return;
      }

      event.preventDefault();
      handleDecreaseQuantity();
    },
    [handleDecreaseQuantity]
  );

  const handleIncreaseKeyDown = useCallback(
    (event) => {
      if (event.key !== "Enter" && event.key !== " ") {
        return;
      }

      event.preventDefault();
      handleIncreaseQuantity();
    },
    [handleIncreaseQuantity]
  );

  const containerClasses =
    size === "sm"
      ? "flex w-full items-center justify-center gap-2 rounded-full border border-neutral-200 px-2 py-1"
      : "flex w-full items-center justify-center gap-2 rounded-full border border-neutral-200 px-3 py-1.5";

  const buttonClasses =
    size === "sm"
      ? "grid h-7 w-7 place-items-center rounded-full bg-neutral-100 text-sm font-medium text-neutral-900 transition hover:bg-neutral-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
      : "grid h-8 w-8 place-items-center rounded-full bg-neutral-100 text-sm font-medium text-neutral-900 transition hover:bg-neutral-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";

  const quantityClasses =
    size === "sm"
      ? "min-w-[2ch] text-center text-sm font-semibold text-neutral-900"
      : "min-w-[2ch] text-center text-base font-semibold text-neutral-900";

  return (
    <div className={containerClasses}>
      <button
        type="button"
        className={buttonClasses}
        onClick={handleDecreaseQuantity}
        onKeyDown={handleDecreaseKeyDown}
        aria-label={`Decrease quantity for ${product?.title ?? "item"}`}
      >
        -
      </button>

      <span className={quantityClasses}>{currentQuantity}</span>

      <button
        type="button"
        className={buttonClasses}
        onClick={handleIncreaseQuantity}
        onKeyDown={handleIncreaseKeyDown}
        aria-label={`Increase quantity for ${product?.title ?? "item"}`}
      >
        +
      </button>
    </div>
  );
};

export default CartQuantityControls;

