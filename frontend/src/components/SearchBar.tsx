import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = query.trim();
    if (trimmed) {
      navigate(`/?search=${encodeURIComponent(trimmed)}&page=1`);
    } else {
      navigate('/');
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-sm items-center">
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search products…"
        className="w-full rounded-l-lg border border-zinc-700 bg-zinc-800 px-3 py-1.5 text-sm text-zinc-100 placeholder-zinc-500 outline-none focus:border-indigo-500"
      />
      <button
        type="submit"
        className="rounded-r-lg border border-l-0 border-zinc-700 bg-zinc-700 px-3 py-1.5 text-sm text-zinc-300 transition hover:bg-indigo-600 hover:text-white"
      >
        ⌕
      </button>
    </form>
  );
}
