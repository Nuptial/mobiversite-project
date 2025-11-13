"use client";

import { Suspense, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import clsx from "clsx";

const CategoryFilterSidebarContent = ({ categories = [] }) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get selected categories from URL (comma-separated)
  const selectedCategoriesParam = searchParams.get("categories") || "";
  const selectedCategories = selectedCategoriesParam
    ? selectedCategoriesParam.split(",").filter(Boolean)
    : [];

  const handleCategoryToggle = useCallback(
    (category) => {
      const params = new URLSearchParams(searchParams.toString());

      // Remove page param when category changes (reset to page 1)
      params.delete("page");

      // Toggle category in selection
      const isSelected = selectedCategories.includes(category);
      let newSelectedCategories;

      if (isSelected) {
        newSelectedCategories = selectedCategories.filter(
          (c) => c !== category
        );
      } else {
        newSelectedCategories = [...selectedCategories, category];
      }

      // Update or remove categories param
      if (newSelectedCategories.length > 0) {
        params.set("categories", newSelectedCategories.join(","));
      } else {
        params.delete("categories");
      }

      const queryString = params.toString();
      router.push(`/products${queryString ? `?${queryString}` : ""}`);
    },
    [router, searchParams, selectedCategories]
  );

  const handleClearAll = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("categories");
    params.delete("page");

    const queryString = params.toString();
    router.push(`/products${queryString ? `?${queryString}` : ""}`);
  }, [router, searchParams]);

  if (categories.length === 0) {
    return null;
  }

  return (
    <aside className="h-fit space-y-4 rounded-2xl bg-white p-4 shadow">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-neutral-900">Categories</h2>
        {selectedCategories.length > 0 && (
          <button
            type="button"
            onClick={handleClearAll}
            className="text-xs font-medium text-neutral-600 underline hover:text-neutral-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2"
            aria-label="Clear all category filters"
          >
            Clear all
          </button>
        )}
      </div>

      <div className="space-y-2">
        {categories.map((category) => {
          const isSelected = selectedCategories.includes(category);
          const displayName =
            category.charAt(0).toUpperCase() + category.slice(1);

          return (
            <label
              key={category}
              className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition focus-within:outline-none text-neutral-700 hover:bg-neutral-100"
            >
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => handleCategoryToggle(category)}
                className="h-4 w-4 cursor-pointer rounded text-neutral-900 focus:outline-none accent-neutral-900"
                style={{
                  accentColor: "#171717",
                }}
                aria-label={`Filter by ${displayName}`}
              />
              <span>{displayName}</span>
            </label>
          );
        })}
      </div>
    </aside>
  );
};

const CategoryFilterSidebar = ({ categories = [] }) => {
  return (
    <Suspense
      fallback={
        <aside className="h-fit space-y-4 rounded-2xl bg-white p-4 shadow">
          <div className="h-6 w-24 animate-pulse rounded bg-neutral-200" />
          <div className="space-y-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="h-10 w-full animate-pulse rounded-lg bg-neutral-200"
              />
            ))}
          </div>
        </aside>
      }
    >
      <CategoryFilterSidebarContent categories={categories} />
    </Suspense>
  );
};

export default CategoryFilterSidebar;
