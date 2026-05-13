import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import type { Product } from '../types';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const CATEGORY_EMOJI: Record<string, string> = {
  laptops: '💻',
  smartphones: '📱',
  audio: '🎧',
  accessories: '⌨️',
  gaming: '🎮',
};

interface Props {
  product: Product;
}

export default function ProductCard({ product }: Props) {
  const emoji = product.category
    ? (CATEGORY_EMOJI[product.category.slug] ?? '📦')
    : '📦';

  const { user } = useAuth();
  const { addItem } = useCart();
  const navigate = useNavigate();
  const [adding, setAdding] = useState(false);

  async function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault();
    if (!user) { navigate('/login'); return; }
    setAdding(true);
    try { await addItem(product.id); } finally { setAdding(false); }
  }

  return (
    <Link
      to={`/products/${product.id}`}
      className="group flex flex-col rounded-xl border border-zinc-800 bg-zinc-800/50 p-4 transition hover:border-indigo-500/60 hover:bg-zinc-800"
    >
      <div className="mb-4 flex h-40 items-center justify-center rounded-lg bg-zinc-700/50 text-6xl">
        {emoji}
      </div>

      <div className="flex flex-1 flex-col gap-1">
        {product.category && (
          <span className="text-xs font-medium uppercase tracking-wider text-indigo-400">
            {product.category.name}
          </span>
        )}
        <h3 className="line-clamp-2 font-semibold leading-snug text-zinc-100 group-hover:text-white">
          {product.name}
        </h3>
        <div className="mt-auto flex items-center justify-between pt-3">
          <p className="text-lg font-bold text-indigo-300">
            ${parseFloat(product.price).toFixed(2)}
          </p>
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0 || adding}
            className="rounded-lg border border-zinc-700 px-2 py-1 text-xs text-zinc-300 transition hover:border-indigo-500 hover:bg-indigo-600 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
          >
            {adding ? '…' : product.stock === 0 ? '✗' : '+ Cart'}
          </button>
        </div>
      </div>
    </Link>
  );
}
