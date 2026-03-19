import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface WishlistStore {
  items: string[];
  addToWishlist: (productId: string) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],
      
      addToWishlist: (productId: string) => {
        set((state) => {
          if (state.items.includes(productId)) {
            return state;
          }
          return {
            items: [...state.items, productId],
          };
        });
      },
      
      removeFromWishlist: (productId: string) => {
        set((state) => ({
          items: state.items.filter((id) => id !== productId),
        }));
      },
      
      isInWishlist: (productId: string) => {
        return get().items.includes(productId);
      },
      
      clearWishlist: () => {
        set({ items: [] });
      },
    }),
    {
      name: 'wishlist-store',
      version: 1,
      storage: createJSONStorage(() => localStorage),
    }
  )
);
