import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { fetchCart, addCartItem, updateCartItem, removeCartItem } from '../api/cart';
import type { Cart } from '../types';

interface CartContextValue {
  cart: Cart | null;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addItem: (productId: number, quantity?: number) => Promise<void>;
  updateItem: (itemId: number, quantity: number) => Promise<void>;
  removeItem: (itemId: number) => Promise<void>;
  totalItems: number;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const { user, isLoading: authLoading } = useAuth();
  const [cart, setCart] = useState<Cart | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    if (!user) { setCart(null); return; }
    fetchCart().then(setCart).catch(() => setCart(null));
  }, [user, authLoading]);

  async function addItem(productId: number, quantity = 1) {
    const updated = await addCartItem(productId, quantity);
    setCart(updated);
    setIsCartOpen(true);
  }

  async function updateItem(itemId: number, quantity: number) {
    const updated = await updateCartItem(itemId, quantity);
    setCart(updated);
  }

  async function removeItem(itemId: number) {
    const updated = await removeCartItem(itemId);
    setCart(updated);
  }

  const totalItems = cart?.items.reduce((sum, item) => sum + item.quantity, 0) ?? 0;

  return (
    <CartContext.Provider value={{
      cart, isCartOpen,
      openCart: () => setIsCartOpen(true),
      closeCart: () => setIsCartOpen(false),
      addItem, updateItem, removeItem, totalItems,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
