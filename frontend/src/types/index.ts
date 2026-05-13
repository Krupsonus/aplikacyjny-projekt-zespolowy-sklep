export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  createdAt: string;
}

export interface Product {
  id: number;
  name: string;
  description: string | null;
  price: string;
  stock: number;
  imageUrl: string | null;
  categoryId: number | null;
  category: Category | null;
  createdAt: string;
  updatedAt: string;
}

export interface ProductsPage {
  data: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
