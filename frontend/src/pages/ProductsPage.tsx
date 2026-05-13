import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchProducts } from '../api/products';
import { fetchCategories } from '../api/categories';
import ProductCard from '../components/ProductCard';

const LIMIT = 12;

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const categorySlug = searchParams.get('category') ?? undefined;
  const search       = searchParams.get('search') ?? undefined;
  const page = parseInt(searchParams.get('page') ?? '1');

  const productsQuery = useQuery({
    queryKey: ['products', { page, category: categorySlug, search }],
    queryFn: () => fetchProducts({ page, limit: LIMIT, category: categorySlug, search }),
  });

  const categoriesQuery = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
    staleTime: Infinity,
  });

  function handleCategoryClick(slug: string | undefined) {
    const next = new URLSearchParams();
    if (slug) next.set('category', slug);
    next.set('page', '1');
    setSearchParams(next);
  }

  function handlePageChange(newPage: number) {
    const next = new URLSearchParams(searchParams);
    next.set('page', String(newPage));
    setSearchParams(next);
  }

  return (
    <div className="flex gap-8">
      {/* Sidebar */}
      <aside className="hidden w-52 shrink-0 lg:block">
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-zinc-400">
          Categories
        </h2>
        <nav className="flex flex-col gap-1">
          <button
            onClick={() => handleCategoryClick(undefined)}
            className={`rounded-lg px-3 py-2 text-left text-sm transition ${
              !categorySlug
                ? 'bg-indigo-600 text-white'
                : 'text-zinc-300 hover:bg-zinc-800 hover:text-white'
            }`}
          >
            All products
          </button>
          {categoriesQuery.data?.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategoryClick(cat.slug)}
              className={`rounded-lg px-3 py-2 text-left text-sm transition ${
                categorySlug === cat.slug
                  ? 'bg-indigo-600 text-white'
                  : 'text-zinc-300 hover:bg-zinc-800 hover:text-white'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main */}
      <div className="flex-1">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold">
            {search
              ? `Results for "${search}"`
              : categorySlug
              ? categoriesQuery.data?.find((c) => c.slug === categorySlug)?.name ?? 'Products'
              : 'All Products'}
          </h1>
          {productsQuery.data && (
            <span className="text-sm text-zinc-400">
              {productsQuery.data.total} item{productsQuery.data.total !== 1 ? 's' : ''}
            </span>
          )}
        </div>

        {/* Mobile category pills */}
        <div className="mb-6 flex gap-2 overflow-x-auto pb-1 lg:hidden">
          <button
            onClick={() => handleCategoryClick(undefined)}
            className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium transition ${
              !categorySlug ? 'bg-indigo-600 text-white' : 'bg-zinc-800 text-zinc-300'
            }`}
          >
            All
          </button>
          {categoriesQuery.data?.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategoryClick(cat.slug)}
              className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium transition ${
                categorySlug === cat.slug ? 'bg-indigo-600 text-white' : 'bg-zinc-800 text-zinc-300'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {productsQuery.isLoading && (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: LIMIT }).map((_, i) => (
              <div key={i} className="h-60 animate-pulse rounded-xl bg-zinc-800" />
            ))}
          </div>
        )}

        {productsQuery.isError && (
          <div className="rounded-xl border border-red-800 bg-red-950/40 p-6 text-center text-red-400">
            Failed to load products. Please try again.
          </div>
        )}

        {productsQuery.data && productsQuery.data.data.length === 0 && (
          <div className="py-20 text-center text-zinc-500">No products found.</div>
        )}

        {productsQuery.data && productsQuery.data.data.length > 0 && (
          <>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
              {productsQuery.data.data.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {productsQuery.data.totalPages > 1 && (
              <div className="mt-8 flex items-center justify-center gap-2">
                <button
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 1}
                  className="rounded-lg border border-zinc-700 px-3 py-1.5 text-sm text-zinc-300 transition hover:border-indigo-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                >
                  ← Prev
                </button>
                <span className="text-sm text-zinc-400">
                  {page} / {productsQuery.data.totalPages}
                </span>
                <button
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page === productsQuery.data.totalPages}
                  className="rounded-lg border border-zinc-700 px-3 py-1.5 text-sm text-zinc-300 transition hover:border-indigo-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next →
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
