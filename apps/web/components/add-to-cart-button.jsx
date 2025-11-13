"use client";

import { useMemo, useState } from "react";
import { toast } from "react-hot-toast";

import { useCart } from "@/context/CartContext";
import CartQuantityControls from "./cart-quantity-controls";

const AddToCartButton = ({ product, size = "md" }) => {
  const { addItem, items } = useCart();

  const [isAdding, setIsAdding] = useState(false);

  const normalizedProduct = useMemo(() => {
    if (!product) {
      return undefined;
    }

    return {
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.image,
    };
  }, [product]);

  const isInCart = useMemo(() => {
    if (!normalizedProduct?.id) {
      return false;
    }
    return items.some((item) => item.id === normalizedProduct.id);
  }, [items, normalizedProduct]);

  const handleAddToCart = () => {
    if (isAdding) {
      return;
    }

    if (!normalizedProduct?.id) {
      return;
    }

    setIsAdding(true);
    addItem(normalizedProduct);
    toast.success(`${normalizedProduct.title ?? "Item"} added to cart`);
    setIsAdding(false);
  };

  const handleKeyDown = (event) => {
    if (event.key !== "Enter" && event.key !== " ") {
      return;
    }

    event.preventDefault();
    handleAddToCart();
  };

  // Show quantity controls if item is already in cart
  if (isInCart) {
    return (
      <div className="w-full">
        <CartQuantityControls product={normalizedProduct} size={size} />
      </div>
    );
  }

  const buttonClasses =
    size === "sm"
      ? "inline-flex w-full items-center justify-center rounded-full bg-neutral-900 px-4 py-2 text-xs font-semibold text-white transition hover:bg-neutral-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70"
      : "inline-flex w-full items-center justify-center rounded-full bg-neutral-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-neutral-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70";

  return (
    <button
      type="button"
      className={buttonClasses}
      onClick={handleAddToCart}
      onKeyDown={handleKeyDown}
      aria-label="Add this product to cart"
      disabled={isAdding}
    >
      {isAdding ? "Adding..." : "Add to cart"}
    </button>
  );
};

export default AddToCartButton;
