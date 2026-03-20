'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, ShoppingBag, Heart, ShoppingCart, User } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { useWishlist } from '@/hooks/useWishlist';
import { cn } from '@/lib/utils';

const items = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/shop', label: 'Shop', icon: ShoppingBag },
  { href: '/wishlist', label: 'Wishlist', icon: Heart },
  { href: '/cart', label: 'Cart', icon: ShoppingCart },
  { href: '/profile', label: 'Profile', icon: User },
];

export default function BottomNav() {
  const pathname = usePathname();
  const { getTotalItems } = useCart();
  const { items: wishlistItems } = useWishlist();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-border/80 bg-white/95 px-2 py-2 shadow-[0_-8px_24px_rgba(255,111,145,0.15)] backdrop-blur md:hidden">
      <div className="mx-auto grid max-w-xl grid-cols-5 gap-1 rounded-2xl bg-white p-1">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
          const count = item.href === '/cart' ? getTotalItems() : item.href === '/wishlist' ? wishlistItems.length : 0;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'relative flex flex-col items-center justify-center rounded-xl py-2 text-[11px] font-medium transition-all duration-300',
                isActive ? 'bg-primary/12 text-primary shadow-[0_6px_16px_rgba(255,111,145,0.22)]' : 'text-muted-foreground'
              )}
            >
              <Icon size={18} />
              <span className="mt-1">{item.label}</span>
              {count > 0 && (
                <span className="absolute right-2 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] text-white">
                  {count}
                </span>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
