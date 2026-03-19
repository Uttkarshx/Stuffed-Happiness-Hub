export type Product = {
  _id?: string;
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  images?: string[];
  rating: number;
  reviews: number;
  reviewsData?: Review[];
  description: string;
  details?: string;
  category: 'girlfriend' | 'kids' | 'friends' | 'family' | 'general';
  bestFor: string[];
  isTrending?: boolean;
  isBestSeller?: boolean;
  discount?: number;
  inStock: boolean;
  stock?: number;
};

export type Review = {
  user: {
    _id?: string;
    name?: string;
  };
  rating: number;
  comment: string;
};

export type CartItem = {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
};

export type Order = {
  _id?: string;
  id: string;
  userId?: string;
  items: CartItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  address: string;
  landmark?: string;
  city: string;
  paymentMethod: 'cod' | 'razorpay';
  paymentStatus: 'pending' | 'paid' | 'failed';
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
};

export type User = {
  _id?: string;
  id: string;
  email: string;
  name: string;
  phone: string;
  address?: string;
  city?: string;
  role?: 'user' | 'admin';
  createdAt: string;
};

export type AuthResponse = {
  success: boolean;
  token: string;
  user: User;
};

export type ApiResponse<T> = {
  success: boolean;
  data?: T;
  message?: string;
};

export type FilterOptions = {
  category?: 'girlfriend' | 'kids' | 'friends' | 'family' | 'general' | 'all';
  priceRange?: [number, number];
  bestFor?: string[];
  sortBy?: 'price-asc' | 'price-desc' | 'popularity' | 'newest';
  searchQuery?: string;
};

export type RazorpayOrder = {
  id: string;
  amount: number;
  currency: string;
};
