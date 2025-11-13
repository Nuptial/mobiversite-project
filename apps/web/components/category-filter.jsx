"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

const CategoryFilterContent = ({ categories = [] }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get("category") || "";

  const handleCategoryChange = useCallback(
    (event) => {
      const selectedCategory = event.target.value;
      const params = new URLSearchParams(searchParams.toString());
      
      // Remove page param when category changes (reset to page 1)
      params.delete("page");
      
      if (selectedCategory) {
        params.set("category", selectedCategory);
      } else {
        params.delete("category");
      }
      
      const queryString = params.toString();
      router.push(`/products${queryString ? `?${queryString}` : ""}`);
    },
    [router, searchParams]
  );

  if (categories.length === 0) {
    return null;
  }

  return (
    <div className="flex items-center gap-2">
      <label htmlFor="category-filter" className="text-sm font-medium text-neutral-700">
        Category:
      </label>
      <select
        id="category-filter"
        value={currentCategory}
        onChange={handleCategoryChange}
        className="rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm font-medium text-neutral-900 transition hover:bg-neutral-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2"
        aria-label="Filter products by category"
      >
        <option value="">All Categories</option>
        {categories.map((category) => (
          <option key={category} value={category}>
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </option>
        ))}
      </select>
    </div>
  );
};

const CategoryFilter = ({ categories = [] }) => {
  return (
    <Suspense
      fallback={
        <div className="flex items-center gap-2">
          <div className="h-9 w-32 animate-pulse rounded-lg bg-neutral-200" />
        </div>
      }
    >
      <CategoryFilterContent categories={categories} />
    </Suspense>
  );
};

export default CategoryFilter;

