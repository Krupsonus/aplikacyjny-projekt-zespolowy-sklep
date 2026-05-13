import { useCart } from '../context/CartContext';

const CATEGORY_EMOJI: Record<string, string> = {
  laptops: '💻', smartphones: '📱', audio: '🎧', accessories: '⌨️', gaming: '🎮',
};

export default function CartDrawer() {
  const { cart, isCartOpen, closeCart, updateItem, removeItem } = useCart();

  const total = cart?.items.reduce(
    (sum, item) => sum + parseFloat(item.product.price) * item.quantity,
    0,
  ) ?? 0;

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-black/60 transition-opacity duration-300 ${
          isCartOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={closeCart}
      />

      {/* Drawer */}
      <aside
        className={`fixed right-0 top-0 z-50 flex h-full w-full max-w-sm flex-col border-l border-zinc-800 bg-zinc-900 shadow-2xl transition-transform duration-300 ${
          isCartOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-800 px-5 py-4">
          <h2 className="text-lg font-bold">Your Cart</h2>
          <button
            onClick={closeCart}
            className="rounded-lg p-1 text-zinc-400 transition hover:bg-zinc-800 hover:text-white"
            aria-label="Close cart"
          >
            ✕
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {!cart || cart.items.length === 0 ? (
            <p className="py-16 text-center text-zinc-500">Your cart is empty.</p>
          ) : (
            <ul className="flex flex-col gap-4">
              {cart.items.map((item) => {
                const emoji = item.product.category
                  ? (CATEGORY_EMOJI[item.product.category.slug] ?? '📦')
                  : '📦';
                return (
                  <li key={item.id} className="flex items-start gap-3">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-zinc-800 text-2xl">
                      {emoji}
                    </div>
                    <div className="flex flex-1 flex-col gap-1 min-w-0">
                      <p className="truncate text-sm font-medium">{item.product.name}</p>
                      <p className="text-sm font-bold text-indigo-300">
                        ${(parseFloat(item.product.price) * item.quantity).toFixed(2)}
                      </p>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            item.quantity > 1
                              ? updateItem(item.id, item.quantity - 1)
                              : removeItem(item.id)
                          }
                          className="flex h-6 w-6 items-center justify-center rounded border border-zinc-700 text-sm text-zinc-400 transition hover:border-zinc-500 hover:text-white"
                        >
                          −
                        </button>
                        <span className="w-5 text-center text-sm">{item.quantity}</span>
                        <button
                          onClick={() => updateItem(item.id, item.quantity + 1)}
                          className="flex h-6 w-6 items-center justify-center rounded border border-zinc-700 text-sm text-zinc-400 transition hover:border-zinc-500 hover:text-white"
                        >
                          +
                        </button>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="ml-auto text-xs text-zinc-500 transition hover:text-red-400"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Footer */}
        {cart && cart.items.length > 0 && (
          <div className="border-t border-zinc-800 px-5 py-4">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-sm text-zinc-400">Total</span>
              <span className="text-lg font-bold">${total.toFixed(2)}</span>
            </div>
            <button
              disabled
              className="w-full rounded-lg bg-indigo-600 py-2.5 font-medium text-white opacity-60 cursor-not-allowed"
              title="Available in Sprint 4"
            >
              Checkout →
            </button>
            <p className="mt-2 text-center text-xs text-zinc-500">Checkout coming soon</p>
          </div>
        )}
      </aside>
    </>
  );
}
