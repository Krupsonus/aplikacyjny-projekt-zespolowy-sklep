import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center py-32 text-center">
      <p className="text-7xl font-bold text-zinc-700">404</p>
      <p className="mt-4 text-xl font-semibold text-zinc-300">Page not found</p>
      <Link to="/" className="mt-6 text-indigo-400 hover:underline">
        ← Back to products
      </Link>
    </div>
  );
}
