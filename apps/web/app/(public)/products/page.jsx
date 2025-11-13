import ProductCard from "@/components/product-card";
import Pagination from "@/components/pagination";
import CategoryFilterSidebar from "@/components/category-filter-sidebar";
import { getCurrentUser } from "@/lib/auth";

const ITEMS_PER_PAGE = 12;

const ProductsPage = async ({ searchParams }) => {
  const resolvedSearchParams = await searchParams;
  const currentPage = Number(resolvedSearchParams?.page) || 1;
  const page = Math.max(1, currentPage);
  // Support multiple categories (comma-separated)
  const selectedCategoriesParam = resolvedSearchParams?.categories || "";
  const selectedCategories = selectedCategoriesParam
    ? selectedCategoriesParam.split(",").filter(Boolean)
    : [];

  const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

  // Try to fetch paginated products first
  let products = [];
  let totalProducts = 0;
  let totalPages = 1;
  let categories = [];

  try {
    // Fetch all products to get total count (since we don't know if API supports pagination)
    const allProductsResponse = await fetch(`${baseUrl}/products`, {
      next: { revalidate: 60 },
    });

    if (!allProductsResponse.ok) {
      return (
        <div className="py-10 text-neutral-600">
          Products are unavailable right now. Please try again later.
        </div>
      );
    }

    const allProducts = await allProductsResponse.json();

    if (!Array.isArray(allProducts)) {
      return <div className="py-10 text-neutral-600">No products found.</div>;
    }

    // Extract unique categories
    categories = [
      ...new Set(
        allProducts.map((product) => product.category).filter(Boolean)
      ),
    ].sort();

    // Filter by categories if selected
    let filteredProducts = allProducts;
    if (selectedCategories.length > 0) {
      filteredProducts = allProducts.filter((product) =>
        selectedCategories.includes(product.category)
      );
    }

    totalProducts = filteredProducts.length;
    totalPages = Math.ceil(totalProducts / ITEMS_PER_PAGE);

    // Calculate pagination
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    products = filteredProducts.slice(startIndex, endIndex);
  } catch (error) {
    console.error("Failed to load products", error);
    return (
      <div className="py-10 text-neutral-600">
        Products are unavailable right now. Please try again later.
      </div>
    );
  }

  const currentUser = await getCurrentUser();

  if (products.length === 0 && page === 1) {
    return (
      <section className="grid gap-6 md:grid-cols-[220px_1fr]">
        <CategoryFilterSidebar categories={categories} />
        <div className="space-y-6">
          <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-neutral-900">Products</h1>
              <p className="text-sm text-neutral-600">
                Explore our latest catalog and save items to your wishlist.
              </p>
            </div>
          </header>
          <div className="rounded-2xl bg-white px-6 py-10 text-center text-neutral-600 shadow">
            No products found.
          </div>
        </div>
      </section>
    );
  }

  if (products.length === 0 && page > 1) {
    return (
      <section className="grid gap-6 md:grid-cols-[220px_1fr]">
        <CategoryFilterSidebar categories={categories} />
        <div className="space-y-6">
          <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-neutral-900">Products</h1>
              <p className="text-sm text-neutral-600">
                Explore our latest catalog and save items to your wishlist.
              </p>
            </div>
          </header>
          <div className="rounded-2xl bg-white px-6 py-10 text-center text-neutral-600 shadow">
            This page does not exist.{" "}
            <a
              href="/products"
              className="text-neutral-900 underline hover:text-neutral-700"
            >
              Go to first page
            </a>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="grid gap-6 md:grid-cols-[220px_1fr]">
      <CategoryFilterSidebar categories={categories} />
      <div className="space-y-6">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-neutral-900">Products</h1>
            <p className="text-sm text-neutral-600">
              Explore our latest catalog and save items to your wishlist.
            </p>
          </div>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-4">
            {totalProducts > 0 && (
              <div className="shrink-0 text-right sm:text-left">
                <div className="text-xs font-medium text-neutral-500">
                  Showing{" "}
                  {Math.min((page - 1) * ITEMS_PER_PAGE + 1, totalProducts)} -{" "}
                  {Math.min(page * ITEMS_PER_PAGE, totalProducts)} of{" "}
                  {totalProducts}
                </div>
              </div>
            )}
          </div>
        </header>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              isAuthenticated={Boolean(currentUser)}
            />
          ))}
        </div>

        {totalPages > 1 && (
          <div className="flex justify-center pt-4">
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              basePath="/products"
            />
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductsPage;
