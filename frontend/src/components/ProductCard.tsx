import { Link } from 'react-router-dom';
import type { Product } from '../types';

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
        <p className="mt-auto pt-3 text-lg font-bold text-indigo-300">
          ${parseFloat(product.price).toFixed(2)}
        </p>
      </div>
    </Link>
  );
}
