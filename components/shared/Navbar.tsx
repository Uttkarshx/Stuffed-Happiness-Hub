'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X, Search, Heart, ShoppingCart, User, Sparkles } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/hooks/useAuth';
import { useWishlist } from '@/hooks/useWishlist';
import { getProducts } from '@/lib/api';
import { Product } from '@/lib/types';
import { cn } from '@/lib/utils';

export default function Navbar() {
  const { getTotalItems } = useCart();
  const { user, isAuthenticated, logout } = useAuth();
  const { items: wishlistItems } = useWishlist();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const profileRef = useRef<HTMLDivElement | null>(null);
  const searchRef = useRef<HTMLDivElement | null>(null);

  const cartCount = hasMounted ? getTotalItems() : 0;
  const wishlistCount = hasMounted ? wishlistItems.length : 0;
  const normalizedQuery = useMemo(() => searchQuery.trim().toLowerCase(), [searchQuery]);

  const categories = [
    { name: 'Girlfriend', href: '/shop?category=girlfriend' },
    { name: 'Kids', href: '/shop?category=kids' },
    { name: 'Friends', href: '/shop?category=friends' },
    { name: 'Family', href: '/shop?category=family' },
  ];

  const handleLogout = () => {
    logout();
    setProfileDropdownOpen(false);
    setMobileMenuOpen(false);
  };

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const onClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (profileRef.current && !profileRef.current.contains(target)) {
        setProfileDropdownOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(target)) {
        setSearchQuery('');
      }
    };

    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  useEffect(() => {
    if (!normalizedQuery) {
      setSearchResults([]);
      setSearchLoading(false);
      return;
    }

    let isCancelled = false;
    const timer = setTimeout(async () => {
      try {
        setSearchLoading(true);
        const products = await getProducts({ searchQuery: normalizedQuery });
        if (!isCancelled) {
          setSearchResults(products.slice(0, 6));
        }
      } catch {
        if (!isCancelled) {
          setSearchResults([]);
        }
      } finally {
        if (!isCancelled) {
          setSearchLoading(false);
        }
      }
    }, 220);

    return () => {
      isCancelled = true;
      clearTimeout(timer);
    };
  }, [normalizedQuery]);

  return (
    <nav
      className={cn(
        'sticky top-0 z-50 border-b border-border/70 backdrop-blur-xl transition-all duration-300',
        isScrolled ? 'bg-white/88 shadow-[0_10px_30px_rgba(255,111,145,0.12)]' : 'bg-white/70'
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="flex items-center justify-between gap-2 py-2 sm:gap-3 sm:py-3"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
        >
          {/* Logo */}
          <Link href="/" className="flex shrink-0 items-center gap-2">
            <div className="hero-glow relative h-10 w-10 overflow-hidden rounded-2xl border border-primary/20 bg-white shadow-md">
              <Image src="/favicon.png" alt="Stuffed Happiness Hub logo" fill className="object-cover" priority />
            </div>
            <span className="text-[15px] font-semibold text-foreground sm:hidden">
              Stuffed Happiness Hub
            </span>
            <span className="hidden text-lg font-bold text-foreground sm:inline">
              Stuffed Happiness Hub
            </span>
          </Link>

          {/* Desktop Navigation - Center */}
          <div className="hidden lg:flex items-center gap-8">
            <Link
              href="/"
              className="text-foreground hover:text-primary transition-colors font-medium text-sm"
            >
              Home
            </Link>
            <Link
              href="/shop"
              className="text-foreground hover:text-primary transition-colors font-medium text-sm"
            >
              Shop
            </Link>

            <div className="relative group">
              <button className="flex items-center gap-1 text-foreground hover:text-primary transition-colors font-medium text-sm">
                Categories
                <span className="text-xs">▼</span>
              </button>
              <div className="invisible absolute left-0 mt-0 w-44 rounded-2xl border border-border bg-white/95 py-2 shadow-lg opacity-0 transition-all duration-200 group-hover:visible group-hover:opacity-100">
                {categories.map((cat) => (
                  <Link
                    key={cat.name}
                    href={cat.href}
                    className="block px-4 py-2 text-sm text-foreground transition-colors hover:bg-muted hover:text-primary"
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            </div>

            <Link
              href="/wishlist"
              className="flex items-center gap-1 text-foreground hover:text-primary transition-colors font-medium text-sm"
            >
              <Sparkles size={15} />
              Gift Picks
            </Link>
          </div>

          {/* Search Bar - Desktop */}
          <div ref={searchRef} className="relative hidden max-w-sm flex-1 lg:flex">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search teddy, bunny, unicorn..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-11 w-full rounded-full border border-border/90 bg-white/80 px-4 pr-10 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <Search size={16} className="absolute right-3 top-3 text-muted-foreground" />
            </div>

            <AnimatePresence>
              {normalizedQuery.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  className="absolute left-0 right-0 top-14 overflow-hidden rounded-2xl border border-border bg-white shadow-xl"
                >
                  {searchLoading ? (
                    <p className="px-4 py-3 text-sm text-muted-foreground">Searching gifts...</p>
                  ) : searchResults.length === 0 ? (
                    <p className="px-4 py-3 text-sm text-muted-foreground">No products found.</p>
                  ) : (
                    <div className="max-h-80 overflow-y-auto">
                      {searchResults.map((result) => (
                        <Link
                          key={result.id}
                          href={`/product/${result.id}`}
                          onClick={() => setSearchQuery('')}
                          className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-muted/70"
                        >
                          <div className="relative h-11 w-11 overflow-hidden rounded-xl bg-muted">
                            <Image src={result.image} alt={result.name} fill className="object-cover" />
                          </div>
                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium text-foreground">{result.name}</p>
                            <p className="text-xs text-muted-foreground">Best for {result.bestFor[0]}</p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right Side - Icons & Auth */}
          <div className="flex items-center gap-1.5 sm:gap-3">
            {/* Wishlist */}
            <Link
              href="/wishlist"
              className="relative hidden h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-muted sm:flex"
              title="Wishlist"
            >
              <Heart size={20} className="text-foreground" />
              {wishlistCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link
              href="/cart"
              className="relative hidden h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-muted sm:flex"
              title="Cart"
            >
              <ShoppingCart size={20} className="text-foreground" />
              {cartCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Profile Dropdown */}
            <div ref={profileRef} className="relative hidden sm:block">
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-muted"
                title="Profile"
              >
                <User size={20} className="text-foreground" />
              </button>
              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-52 rounded-2xl border border-border bg-white py-2 shadow-lg">
                  {isAuthenticated && user ? (
                    <>
                      <div className="px-4 py-2 border-b border-border">
                        <p className="text-sm font-medium text-foreground">{user.name}</p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                      </div>
                      <Link
                        href="/profile"
                        className="block px-4 py-2 text-sm text-foreground transition-colors hover:bg-muted hover:text-primary"
                        onClick={() => setProfileDropdownOpen(false)}
                      >
                        My Account
                      </Link>
                      {user.role === 'admin' && (
                        <Link
                          href="/admin/orders"
                          className="block px-4 py-2 text-sm text-foreground transition-colors hover:bg-muted hover:text-primary"
                          onClick={() => setProfileDropdownOpen(false)}
                        >
                          Admin Dashboard
                        </Link>
                      )}
                      <Link
                        href="/orders"
                        className="block px-4 py-2 text-sm text-foreground transition-colors hover:bg-muted hover:text-primary"
                        onClick={() => setProfileDropdownOpen(false)}
                      >
                        Orders
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full border-t border-border px-4 py-2 text-left text-sm text-foreground transition-colors hover:bg-muted hover:text-primary"
                      >
                        Logout
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        href="/auth/login"
                        className="block px-4 py-2 text-sm text-foreground transition-colors hover:bg-muted hover:text-primary"
                        onClick={() => setProfileDropdownOpen(false)}
                      >
                        Login
                      </Link>
                      <Link
                        href="/auth/signup"
                        className="block px-4 py-2 text-sm text-foreground transition-colors hover:bg-muted hover:text-primary"
                        onClick={() => setProfileDropdownOpen(false)}
                      >
                        Sign Up
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="flex items-center gap-1 sm:hidden">
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
                <Link
                  href="/cart"
                  className="relative flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-muted"
                  aria-label="Open cart"
                >
                  <ShoppingCart size={20} className="text-foreground" />
                  {cartCount > 0 && (
                    <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold text-white">
                      {cartCount}
                    </span>
                  )}
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
                <Link
                  href={isAuthenticated ? '/profile' : '/auth/login'}
                  className="flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-muted"
                  aria-label="Open profile"
                >
                  <User size={20} className="text-foreground" />
                </Link>
              </motion.div>
            </div>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="rounded-full p-2 transition-colors hover:bg-muted lg:hidden"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </motion.div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="space-y-2 border-t border-border pb-4 lg:hidden">
            <div className="px-4 py-2">
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-3 py-2 rounded-full border border-border bg-muted/50 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm"
              />
            </div>
            <Link
              href="/"
              className="block px-4 py-2 text-foreground hover:bg-muted rounded-lg transition-colors text-sm"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/shop"
              className="block px-4 py-2 text-foreground hover:bg-muted rounded-lg transition-colors text-sm"
              onClick={() => setMobileMenuOpen(false)}
            >
              Shop
            </Link>
            <div className="border-t border-border pt-2">
              <p className="px-4 py-1 text-xs font-semibold text-muted-foreground">CATEGORIES</p>
              {categories.map((cat) => (
                <Link
                  key={cat.name}
                  href={cat.href}
                  className="block px-4 py-2 pl-8 text-foreground hover:bg-muted rounded-lg transition-colors text-sm"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {cat.name}
                </Link>
              ))}
            </div>
            {isAuthenticated && user ? (
              <>
                <div className="border-t border-border pt-2">
                  <Link
                    href="/profile"
                    className="block px-4 py-2 text-foreground hover:bg-muted rounded-lg transition-colors text-sm"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    My Account
                  </Link>
                  {user.role === 'admin' && (
                    <Link
                      href="/admin/orders"
                      className="block px-4 py-2 text-foreground hover:bg-muted rounded-lg transition-colors text-sm"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Admin Dashboard
                    </Link>
                  )}
                  <Link
                    href="/orders"
                    className="block px-4 py-2 text-foreground hover:bg-muted rounded-lg transition-colors text-sm"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Orders
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-foreground hover:bg-muted rounded-lg transition-colors text-sm"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="border-t border-border pt-2">
                  <Link
                    href="/auth/login"
                    className="block px-4 py-2 text-foreground hover:bg-muted rounded-lg transition-colors text-sm"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    href="/auth/signup"
                    className="block px-4 py-2 text-foreground hover:bg-muted rounded-lg transition-colors text-sm"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </div>
              </>
            )}
          </div>
        )}
      </div>

    </nav>
  );
}
