import { Suspense } from "react";

import CartContent from "./CartContent";

const CartSkeleton = () => (
  <section className="space-y-6" role="status" aria-live="polite">
    <header className="space-y-2">
      <div className="h-8 w-40 animate-pulse rounded-full bg-neutral-200" />
      <div className="h-4 w-72 animate-pulse rounded-full bg-neutral-200" />
    </header>

    <div className="space-y-4">
      <div className="h-20 animate-pulse rounded-2xl bg-neutral-100" />
      <div className="h-20 animate-pulse rounded-2xl bg-neutral-100" />
      <div className="h-24 animate-pulse rounded-2xl bg-neutral-100" />
    </div>
  </section>
);

const CartPage = () => (
  <Suspense fallback={<CartSkeleton />}>
    <CartContent />
  </Suspense>
);

export default CartPage;
