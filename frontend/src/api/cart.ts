import client from './client';
import type { Cart } from '../types';

export async function fetchCart(): Promise<Cart> {
  const { data } = await client.get<Cart>('/cart');
  return data;
}

export async function addCartItem(productId: number, quantity = 1): Promise<Cart> {
  const { data } = await client.post<Cart>('/cart/items', { productId, quantity });
  return data;
}

export async function updateCartItem(itemId: number, quantity: number): Promise<Cart> {
  const { data } = await client.patch<Cart>(`/cart/items/${itemId}`, { quantity });
  return data;
}

export async function removeCartItem(itemId: number): Promise<Cart> {
  const { data } = await client.delete<Cart>(`/cart/items/${itemId}`);
  return data;
}
