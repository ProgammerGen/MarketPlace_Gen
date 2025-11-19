export interface User {
  id: string;
  email: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  role: string;
  phone?: string;
  address?: string;
}

export interface Product {
  id: string;
  name: string;
  slug?: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  images: string[];
  image?: string;
  categoryId?: string;
  category?: string;
  sellerId?: string;
  stock: number;
  sku?: string;
  status?: string;
  featured?: boolean;
  rating: number;
  reviewCount: number;
  tags?: string[];
  specifications?: Record<string, any>;
  createdAt?: string;
  updatedAt?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface AuthResponse {
  success: boolean;
  data: {
    token: string;
    user: User;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface ProductsResponse {
  products: Product[];
}

export interface ProductResponse extends Product {
  reviews?: any[];
}

export interface Category {
  id: string;
  name: string;
  slug?: string;
  description?: string;
  parentId?: string;
}

export interface OrderItem {
  productId: string;
  quantity: number;
  price: number;
  name: string;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  status: string;
  shippingAddress?: any;
  paymentMethod?: string;
  paymentStatus?: string;
  createdAt: string;
  deliveredAt?: string;
  shippedAt?: string;
}

export interface ProductsQueryParams {
  category?: string;
  seller?: string;
  search?: string;
  featured?: boolean;
  minPrice?: number;
  maxPrice?: number;
  sort?: 'price_asc' | 'price_desc' | 'rating' | 'newest';
  page?: number;
  limit?: number;
}

