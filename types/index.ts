export type Gender = "male" | "female" | "other";
export type ProductCategory = "women" | "men" | "new-arrivals";
export type SortOption = "featured" | "price-asc" | "price-desc" | "newest";

export interface ProductColor {
  name: string;
  hex: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  category: ProductCategory;
  images: string[];
  colors: ProductColor[];
  sizes: number[];
  description: string;
  material: string;
  isNew: boolean;
  isBestseller: boolean;
  rating: number;
  reviewCount: number;
  tags: string[];
}

export interface CartItem {
  productId: string;
  product: Product;
  size: number;
  quantity: number;
  selectedColor: ProductColor;
}

export interface User {
  id: string;
  email: string;
  name: string;
  gender: Gender;
  favoriteCategory?: ProductCategory;
  createdAt: string;
}

export interface NetmeraEvent {
  id: string;
  eventName: string;
  userId?: string;
  sessionId: string;
  data: Record<string, unknown>;
  timestamp: string;
}
