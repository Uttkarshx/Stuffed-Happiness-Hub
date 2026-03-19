import { useCartStore } from '@/lib/store/cartStore';

export function useCart() {
  return useCartStore();
}
