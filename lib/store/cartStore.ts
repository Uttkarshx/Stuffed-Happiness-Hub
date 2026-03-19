import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { CartItem, Order, Product } from '../types';
import { createOrder } from '../api';

interface CartStore {
  items: CartItem[];
  isPlacingOrder: boolean;
  addToCart: (product: Product, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  placeOrder: (payload: Partial<Order>) => Promise<Order>;
  clearCart: () => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isPlacingOrder: false,
      
      addToCart: (product: Product, quantity: number) => {
        set((state) => {
          const existingItem = state.items.find(
            (item) => item.productId === product.id
          );
          
          if (existingItem) {
            return {
              items: state.items.map((item) =>
                item.productId === product.id
                  ? { ...item, quantity: item.quantity + quantity }
                  : item
              ),
            };
          }
          
          return {
            items: [
              ...state.items,
              {
                productId: product.id,
                name: product.name,
                price: product.price,
                quantity,
                image: product.image,
              },
            ],
          };
        });
      },
      
      removeFromCart: (productId: string) => {
        set((state) => ({
          items: state.items.filter((item) => item.productId !== productId),
        }));
      },
      
      updateQuantity: (productId: string, quantity: number) => {
        if (quantity <= 0) {
          get().removeFromCart(productId);
          return;
        }
        
        set((state) => ({
          items: state.items.map((item) =>
            item.productId === productId ? { ...item, quantity } : item
          ),
        }));
      },

      placeOrder: async (payload: Partial<Order>) => {
        set({ isPlacingOrder: true });
        try {
          const order = await createOrder(payload);
          set({ items: [], isPlacingOrder: false });
          return order;
        } catch (error) {
          set({ isPlacingOrder: false });
          throw error;
        }
      },
      
      clearCart: () => {
        set({ items: [] });
      },
      
      getTotalPrice: () => {
        return get().items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        );
      },
      
      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },
    }),
    {
      name: 'cart-store',
      version: 1,
      storage: createJSONStorage(() => localStorage),
    }
  )
);
