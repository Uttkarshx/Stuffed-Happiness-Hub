import { useWishlistStore } from '@/lib/store/wishlistStore';

export function useWishlist() {
  return useWishlistStore();
}
