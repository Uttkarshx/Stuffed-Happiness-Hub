'use client';

import { useEffect, useMemo, useState } from 'react';
import { getProducts } from '@/lib/api';
import { fallbackProducts } from '@/lib/fallbackProducts';
import ProductCard from '@/components/product/ProductCard';
import { Product } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { toast } from 'sonner';

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState<string>(() => {
    if (typeof window === 'undefined') return 'all';
    return new URLSearchParams(window.location.search).get('category') || 'all';
  });
  const [priceRange, setPriceRange] = useState<[number, number]>([300, 1000]);
  const [sortBy, setSortBy] = useState<string>('popularity');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      try {
        const data = await getProducts();
        if (!data.length) {
          console.warn('Products API returned empty payload. Using fallback stuffed toys.');
          setProducts(fallbackProducts);
          return;
        }
        if (process.env.NODE_ENV !== 'production') {
          console.log('Products:', data);
        }
        setProducts(data);
      } catch (error: unknown) {
        console.warn('Failed to fetch products:', error);
        toast.warning('Live product server is unreachable. Showing stuffed toy catalog.');
        setProducts(fallbackProducts);
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    if (category !== 'all') {
      filtered = filtered.filter((p) => p.category === category);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.trim().toLowerCase();
      filtered = filtered.filter((p) => p.name.toLowerCase().includes(query));
    }

    filtered = filtered.filter((p) => p.price >= priceRange[0] && p.price <= priceRange[1]);

    if (sortBy === 'price-asc') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      filtered.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'newest') {
      filtered.reverse();
    }

    return filtered;
  }, [products, category, priceRange, sortBy, searchQuery]);

  const suggestions = searchQuery.trim()
    ? products.filter((p) => p.name.toLowerCase().includes(searchQuery.trim().toLowerCase())).slice(0, 6)
    : [];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Shop Our Collection</h1>
          <p className="text-muted-foreground">
            Discover {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
          </p>

          <div className="relative mt-5 max-w-xl">
            <Search size={18} className="pointer-events-none absolute left-3 top-3 text-muted-foreground" />
            <input
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSuggestions(true);
              }}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
              onFocus={() => setShowSuggestions(true)}
              placeholder="Search gifts by name"
              className="h-11 w-full rounded-full border border-border bg-white/80 py-2 pl-10 pr-4 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />

            {showSuggestions && searchQuery.trim() && (
              <div className="absolute left-0 right-0 top-12 z-20 overflow-hidden rounded-2xl border border-border bg-white shadow-lg">
                {suggestions.length === 0 ? (
                  <p className="px-4 py-3 text-sm text-muted-foreground">No matching products</p>
                ) : (
                  suggestions.map((suggestion) => (
                    <button
                      key={suggestion.id}
                      className="block w-full border-b border-border/50 px-4 py-3 text-left text-sm text-foreground transition-colors last:border-none hover:bg-muted"
                      onClick={() => {
                        setSearchQuery(suggestion.name);
                        setShowSuggestions(false);
                      }}
                    >
                      {suggestion.name}
                    </button>
                  ))
                )}
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-8">
          {/* Sidebar Filters */}
          <div
            className={`${
              showFilters ? 'block' : 'hidden'
            } shrink-0 space-y-6 border-r border-border pb-8 pr-8 lg:block lg:w-64 lg:pb-0`}
          >
            {/* Category Filter */}
            <div>
              <h3 className="font-semibold text-foreground mb-4">Category</h3>
              <div className="space-y-2">
                {['All', 'Girlfriend', 'Kids', 'Friends', 'Family', 'General'].map((cat) => (
                  <label key={cat} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="category"
                      value={cat.toLowerCase()}
                      checked={category === (cat === 'All' ? 'all' : cat.toLowerCase())}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-4 h-4 accent-primary"
                    />
                    <span className="text-sm text-foreground">{cat}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price Filter */}
            <div>
              <h3 className="font-semibold text-foreground mb-4">Price Range</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-muted-foreground">
                    Min: ₹{priceRange[0]}
                  </label>
                  <input
                    type="range"
                    min="300"
                    max="1000"
                    value={priceRange[0]}
                    onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                    className="w-full accent-primary"
                  />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">
                    Max: ₹{priceRange[1]}
                  </label>
                  <input
                    type="range"
                    min="300"
                    max="1000"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                    className="w-full accent-primary"
                  />
                </div>
              </div>
            </div>

            {/* Sort */}
            <div>
              <h3 className="font-semibold text-foreground mb-4">Sort By</h3>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="popularity">Popularity</option>
                <option value="newest">Newest</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            {/* Mobile Filter Toggle */}
            <div className="lg:hidden mb-6">
              <Button
                onClick={() => setShowFilters(!showFilters)}
                variant="outline"
                className="w-full"
              >
                {showFilters ? 'Hide Filters' : 'Show Filters'}
              </Button>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array(6)
                  .fill(null)
                  .map((_, i) => (
                    <div
                      key={i}
                      className="h-96 rounded-2xl bg-muted animate-pulse"
                    />
                  ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">No products found. Try adjusting your filters.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
