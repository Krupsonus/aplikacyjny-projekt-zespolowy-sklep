import client from './client';
import type { Product, ProductsPage } from '../types';

export async function fetchProducts(params: {
  page?: number;
  limit?: number;
  category?: string;
}): Promise<ProductsPage> {
  const { data } = await client.get<ProductsPage>('/products', { params });
  return data;
}

export async function fetchProduct(id: number): Promise<Product> {
  const { data } = await client.get<Product>(`/products/${id}`);
  return data;
}
