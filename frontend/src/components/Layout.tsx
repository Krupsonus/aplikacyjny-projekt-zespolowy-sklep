import { Link } from 'react-router-dom';
import SearchBar from './SearchBar';
import { useAuth } from '../context/AuthContext';

interface Props {
  children: React.ReactNode;
}

export default function Layout({ children }: Props) {
  const { user, isLoading, logout } = useAuth();

  return (
    <div className="min-h-screen bg-zinc-900 text-zinc-100">
      <header className="sticky top-0 z-10 border-b border-zinc-800 bg-zinc-900/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3">
          <Link to="/" className="flex shrink-0 items-center gap-2 text-xl font-bold tracking-tight">
            <span className="text-indigo-400">⚡</span>
            <span>TechShop</span>
          </Link>

          <div className="flex-1">
            <SearchBar />
          </div>

          <nav className="flex shrink-0 items-center gap-3 text-sm">
            {!isLoading && (
              user ? (
                <>
                  <span className="hidden text-zinc-400 sm:block">
                    {user.firstName}
                  </span>
                  <button
                    onClick={() => void logout()}
                    className="rounded-lg border border-zinc-700 px-3 py-1.5 text-zinc-300 transition hover:border-zinc-500 hover:text-white"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="text-zinc-300 transition hover:text-white"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="rounded-lg bg-indigo-600 px-3 py-1.5 font-medium text-white transition hover:bg-indigo-500"
                  >
                    Register
                  </Link>
                </>
              )
            )}
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-8">{children}</main>
    </div>
  );
}
