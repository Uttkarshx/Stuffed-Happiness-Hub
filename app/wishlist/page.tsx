'use client';

import { useWishlist } from '@/hooks/useWishlist';
import { getProducts } from '@/lib/api';
import ProductCard from '@/components/product/ProductCard';
import { Button } from '@/components/ui/button';
import Loader from '@/components/shared/Loader';
import { Heart } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Product } from '@/lib/types';
import { toast } from 'sonner';

export default function WishlistPage() {
  const { items: wishlistIds } = useWishlist();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const allProducts = await getProducts();
        const wishlistProducts = allProducts.filter((p) => wishlistIds.includes(p.id));
        setProducts(wishlistProducts);
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Failed to load wishlist';
        toast.error(message);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [wishlistIds]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Loader label="Loading your wishlist..." className="py-24" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-foreground mb-12">My Wishlist</h1>

        {products.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card-soft py-20 text-center"
          >
            <Heart size={64} className="mx-auto mb-6 text-primary/70" />
            <h2 className="text-2xl font-bold text-foreground mb-4">Your wishlist is empty</h2>
            <p className="text-muted-foreground mb-8">Start adding your favorite stuffed toys to your wishlist.</p>
            <Link href="/shop">
              <Button className="bg-linear-to-r from-primary to-accent">
                Explore Products
              </Button>
            </Link>
          </motion.div>
        ) : (
          <div>
            <p className="text-muted-foreground mb-8">
              You have {products.length} item{products.length !== 1 ? 's' : ''} in your wishlist
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
