import { Product, Order, FilterOptions, AuthResponse, RazorpayOrder } from './types';
import apiClient from './apiClient';

type WrappedResponse<T> = {
  success?: boolean;
  data?: T;
  user?: T;
};

type MaybeWrapped<T> = T | WrappedResponse<T>;

function extractData<T>(payload: MaybeWrapped<T>): T {
  if (typeof payload === 'object' && payload !== null && 'data' in payload) {
    const wrapped = payload as WrappedResponse<T>;
    if (wrapped.data !== undefined) {
      return wrapped.data;
    }
  }
  return payload as T;
}

async function withApiError<T>(fn: () => Promise<T>, fallback: string): Promise<T> {
  try {
    return await fn();
  } catch (error: unknown) {
    if (error instanceof Error && error.message) {
      throw new Error(error.message);
    }
    throw new Error(fallback);
  }
}

// ============================================================
// AUTH API
// ============================================================

export async function loginUser(email: string, password: string): Promise<AuthResponse> {
  return withApiError(async () => {
    const response = await apiClient.post<AuthResponse>('/auth/login', { email, password });
    return response.data;
  }, 'Login failed. Please try again.');
}

export async function signupUser(name: string, email: string, phone: string, password: string): Promise<AuthResponse> {
  return withApiError(async () => {
    const payload = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      password,
    };

    const response = await apiClient.post<AuthResponse>('/auth/signup', payload);
    return response.data;
  }, 'Signup failed. Please try again.');
}

export async function getMe(): Promise<AuthResponse> {
  return withApiError(async () => {
    const response = await apiClient.get<{
      success: boolean;
      message?: string;
      user: AuthResponse['user'];
    }>('/auth/me');
    return {
      success: response.data.success,
      token: '',
      user: response.data.user,
    };
  }, 'Failed to fetch user profile.');
}

// ============================================================
// PRODUCTS API
// ============================================================

export async function getProducts(filters?: FilterOptions): Promise<Product[]> {
  return withApiError(async () => {
    const response = await apiClient.get<MaybeWrapped<Product[]>>('/products', { params: filters });
    if (process.env.NODE_ENV !== 'production') {
      console.log('GET /api/products response:', response.data);
    }
    let products = extractData(response.data).map(normalizeProduct);

    if (filters?.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      products = products.filter(
        (p) => p.name.toLowerCase().includes(query) || p.description.toLowerCase().includes(query)
      );
    }

    if (filters?.category && filters.category !== 'all') {
      products = products.filter((p) => p.category === filters.category);
    }

    if (filters?.priceRange) {
      const [min, max] = filters.priceRange;
      products = products.filter((p) => p.price >= min && p.price <= max);
    }

    if (filters?.sortBy === 'price-asc') {
      products.sort((a, b) => a.price - b.price);
    } else if (filters?.sortBy === 'price-desc') {
      products.sort((a, b) => b.price - a.price);
    } else if (filters?.sortBy === 'popularity') {
      products.sort((a, b) => b.reviews - a.reviews);
    } else if (filters?.sortBy === 'newest') {
      products = [...products].reverse();
    }

    return products;
  }, 'Failed to fetch products.');
}

export async function getProductById(id: string): Promise<Product | null> {
  return withApiError(async () => {
    try {
      const response = await apiClient.get<MaybeWrapped<Product>>(`/products/${id}`);
      return normalizeProduct(extractData(response.data));
    } catch (error: unknown) {
      if (error instanceof Error && /not found/i.test(error.message)) {
        return null;
      }
      throw error;
    }
  }, 'Failed to fetch product.');
}

export async function searchProducts(query: string): Promise<Product[]> {
  return getProducts({ searchQuery: query });
}

export async function getProductsByCategory(category: string): Promise<Product[]> {
  return getProducts({ category: category as FilterOptions['category'] });
}

// Admin product CRUD
export async function createProduct(product: Partial<Product>): Promise<Product> {
  return withApiError(async () => {
    const response = await apiClient.post<MaybeWrapped<Product>>('/admin/products', product);
    return normalizeProduct(extractData(response.data));
  }, 'Failed to create product.');
}

export async function updateProduct(id: string, product: Partial<Product>): Promise<Product> {
  return withApiError(async () => {
    const response = await apiClient.put<MaybeWrapped<Product>>(`/admin/products/${id}`, product);
    return normalizeProduct(extractData(response.data));
  }, 'Failed to update product.');
}

export async function deleteProduct(id: string): Promise<void> {
  return withApiError(async () => {
    await apiClient.delete(`/admin/products/${id}`);
  }, 'Failed to delete product.');
}

export async function getAdminProducts(): Promise<Product[]> {
  return withApiError(async () => {
    const response = await apiClient.get<MaybeWrapped<Product[]>>('/admin/products');
    return extractData(response.data).map(normalizeProduct);
  }, 'Failed to fetch admin products.');
}

// ============================================================
// ORDERS API
// ============================================================

export async function createOrder(orderData: Partial<Order>): Promise<Order> {
  return withApiError(async () => {
    const response = await apiClient.post<MaybeWrapped<Order>>('/orders', orderData);
    return normalizeOrder(extractData(response.data));
  }, 'Failed to create order.');
}

export async function getOrders(): Promise<Order[]> {
  return withApiError(async () => {
    const response = await apiClient.get<MaybeWrapped<Order[]>>('/admin/orders');
    return extractData(response.data).map(normalizeOrder);
  }, 'Failed to fetch orders.');
}

export async function getUserOrders(): Promise<Order[]> {
  return withApiError(async () => {
    const response = await apiClient.get<MaybeWrapped<Order[]>>('/orders/my-orders');
    return extractData(response.data).map(normalizeOrder);
  }, 'Failed to fetch user orders.');
}

export async function updateOrderStatus(orderId: string, status: string): Promise<Order> {
  return withApiError(async () => {
    const response = await apiClient.put<MaybeWrapped<Order>>(`/admin/orders/${orderId}/status`, { status });
    return normalizeOrder(extractData(response.data));
  }, 'Failed to update order status.');
}

export async function cancelOrder(orderId: string): Promise<Order> {
  return withApiError(async () => {
    const response = await apiClient.put<MaybeWrapped<Order>>(`/orders/${orderId}/cancel`);
    return normalizeOrder(extractData(response.data));
  }, 'Failed to cancel order.');
}

export async function addProductReview(
  productId: string,
  payload: { rating: number; comment: string }
): Promise<Product> {
  return withApiError(async () => {
    const response = await apiClient.post<MaybeWrapped<Product>>(`/products/${productId}/reviews`, payload);
    return normalizeProduct(extractData(response.data));
  }, 'Failed to submit review.');
}

// ============================================================
// PAYMENT API (Razorpay)
// ============================================================

export async function createRazorpayOrder(amount: number, orderId: string): Promise<RazorpayOrder> {
  return withApiError(async () => {
    const response = await apiClient.post<MaybeWrapped<RazorpayOrder>>('/payments/create-order', {
      amount,
      orderId,
    });
    return extractData(response.data);
  }, 'Failed to create payment order.');
}

export async function verifyPayment(data: {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
  orderId: string;
}): Promise<{ success: boolean; message: string }> {
  return withApiError(async () => {
    const response = await apiClient.post<{ success: boolean; message: string }>('/payments/verify', data);
    return response.data;
  }, 'Failed to verify payment.');
}

// ============================================================
// HELPERS
// ============================================================

function normalizeProduct(p: Partial<Product> & { _id?: string }): Product {
  const primaryImage = p.images?.[0] || p.image || '/images/products/teddy-pink.jpg';
  const reviewsData = Array.isArray(p.reviewsData) ? p.reviewsData : [];
  const reviews = p.reviews ?? reviewsData.length;

  return {
    ...(p as Product),
    id: p.id || p._id || '',
    image: primaryImage,
    rating: p.rating ?? 4.5,
    reviews,
    reviewsData,
    bestFor: p.bestFor ?? [],
    inStock: p.inStock ?? (typeof p.stock === 'number' ? p.stock > 0 : true),
  };
}

function normalizeOrder(o: Partial<Order> & { _id?: string }): Order {
  const items = (o.items || []).map((item) => {
    const productRef = item.productId as unknown;
    const isPopulatedProduct = typeof productRef === 'object' && productRef !== null;
    const populatedProduct = isPopulatedProduct
      ? (productRef as { _id?: string; name?: string; price?: number; images?: string[] })
      : null;

    return {
      ...item,
      productId:
        typeof item.productId === 'string'
          ? item.productId
          : populatedProduct?._id || '',
      name: item.name || populatedProduct?.name || 'Product',
      price: item.price ?? populatedProduct?.price ?? 0,
      image: item.image || populatedProduct?.images?.[0] || '/images/products/teddy-pink.jpg',
    };
  });

  return {
    ...(o as Order),
    id: o.id || o._id || '',
    items,
    subtotal: o.subtotal ?? o.total ?? 0,
    shipping: o.shipping ?? 0,
    tax: o.tax ?? 0,
    total: o.total ?? 0,
    customerPhone: o.customerPhone ?? '',
    customerEmail: o.customerEmail ?? '',
    city: o.city ?? '',
    paymentMethod: o.paymentMethod ?? 'cod',
    paymentStatus: o.paymentStatus ?? 'pending',
    status: o.status ?? 'pending',
    customerName: o.customerName ?? '',
    createdAt: o.createdAt ?? new Date().toISOString(),
  };
}
