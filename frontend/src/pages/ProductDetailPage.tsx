import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchProduct } from '../api/products';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const CATEGORY_EMOJI: Record<string, string> = {
  laptops: '💻',
  smartphones: '📱',
  audio: '🎧',
  accessories: '⌨️',
  gaming: '🎮',
};

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const productId = parseInt(id ?? '');
  const { user } = useAuth();
  const { addItem } = useCart();
  const navigate = useNavigate();
  const [adding, setAdding] = useState(false);

  const { data: product, isLoading, isError } = useQuery({
    queryKey: ['product', productId],
    queryFn: () => fetchProduct(productId),
    enabled: !isNaN(productId),
  });

  if (isNaN(productId)) {
    return (
      <div className="py-20 text-center">
        <p className="text-red-400">Invalid product ID.</p>
        <Link to="/" className="mt-4 inline-block text-indigo-400 hover:underline">
          ← Back to products
        </Link>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="mx-auto max-w-3xl animate-pulse">
        <div className="mb-6 h-5 w-24 rounded bg-zinc-800" />
        <div className="flex flex-col gap-6 md:flex-row">
          <div className="h-72 w-full rounded-xl bg-zinc-800 md:w-72" />
          <div className="flex-1 space-y-3">
            <div className="h-6 w-3/4 rounded bg-zinc-800" />
            <div className="h-4 w-1/2 rounded bg-zinc-800" />
            <div className="h-10 w-32 rounded bg-zinc-800" />
            <div className="h-4 w-full rounded bg-zinc-800" />
            <div className="h-4 w-5/6 rounded bg-zinc-800" />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="py-20 text-center">
        <p className="text-red-400">Product not found.</p>
        <Link to="/" className="mt-4 inline-block text-indigo-400 hover:underline">
          ← Back to products
        </Link>
      </div>
    );
  }

  const emoji = product.category
    ? (CATEGORY_EMOJI[product.category.slug] ?? '📦')
    : '📦';

  return (
    <div className="mx-auto max-w-3xl">
      <Link
        to={product.category ? `/?category=${product.category.slug}` : '/'}
        className="mb-6 inline-flex items-center gap-1 text-sm text-zinc-400 hover:text-zinc-200"
      >
        ← {product.category ? product.category.name : 'All products'}
      </Link>

      <div className="flex flex-col gap-8 md:flex-row">
        <div className="flex h-72 w-full shrink-0 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-800/50 text-8xl md:w-72">
          {emoji}
        </div>

        <div className="flex flex-1 flex-col gap-4">
          {product.category && (
            <span className="text-xs font-semibold uppercase tracking-widest text-indigo-400">
              {product.category.name}
            </span>
          )}
          <h1 className="text-2xl font-bold leading-snug">{product.name}</h1>
          <p className="text-3xl font-bold text-indigo-300">
            ${parseFloat(product.price).toFixed(2)}
          </p>

          <div className="flex items-center gap-2">
            <span
              className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                product.stock > 0
                  ? 'bg-emerald-900/60 text-emerald-400'
                  : 'bg-red-900/60 text-red-400'
              }`}
            >
              {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
            </span>
          </div>

          {product.description && (
            <p className="leading-relaxed text-zinc-400">{product.description}</p>
          )}

          <button
            disabled={product.stock === 0 || adding}
            onClick={async () => {
              if (!user) { navigate('/login', { state: { from: `/products/${product.id}` } }); return; }
              setAdding(true);
              try { await addItem(product.id); } finally { setAdding(false); }
            }}
            className="mt-2 w-full rounded-lg bg-indigo-600 py-3 font-semibold text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {product.stock === 0 ? 'Out of Stock' : adding ? 'Adding…' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  );
}
