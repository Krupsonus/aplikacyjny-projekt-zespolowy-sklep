import client from './client';
import type { Category } from '../types';

export async function fetchCategories(): Promise<Category[]> {
  const { data } = await client.get<Category[]>('/categories');
  return data;
}
