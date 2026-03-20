'use client';

import { useMemo, useState } from 'react';
import { Product } from '@/lib/types';
import { formatPrice } from '@/lib/utils';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import Link from 'next/link';
import { useCart } from '@/hooks/useCart';
import { useWishlist } from '@/hooks/useWishlist';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { getDiscountBadge, getDynamicDiscountPercent, getDynamicOriginalPrice } from '@/lib/pricing';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const router = useRouter();
  const isWishlisted = isInWishlist(product.id);
  const primaryImage = useMemo(
    () => product.images?.[0] || product.image || '/images/products/teddy-pink.jpg',
    [product.images, product.image]
  );
  const [imageSrc, setImageSrc] = useState(primaryImage);
  const discountPercent = getDynamicDiscountPercent(product);
  const originalPrice = getDynamicOriginalPrice(product);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart(product, 1);
    toast.success(`${product.name} added to cart!`);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isWishlisted) {
      removeFromWishlist(product.id);
      toast.success('Removed from wishlist');
    } else {
      addToWishlist(product.id);
      toast.success('Added to wishlist!');
    }
  };

  const handleBuyNow = (e: React.MouseEvent, selectedProduct: Product) => {
    e.preventDefault();

    const item = {
      productId: selectedProduct._id || selectedProduct.id,
      quantity: 1,
    };

    localStorage.setItem('buyNowItem', JSON.stringify(item));
    router.push('/checkout?mode=buy-now');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      viewport={{ once: true }}
    >
      <Link href={`/product/${product._id || product.id}`}>
        <div className="group card-soft h-full flex flex-col overflow-hidden transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(255,111,145,0.22)]">
          {/* Image Container */}
          <div className="relative h-64 overflow-hidden bg-muted/50 sm:h-72">
            <Image
              src={imageSrc}
              alt={product.name}
              fill
              unoptimized
              onError={() => setImageSrc('/images/products/teddy-pink.jpg')}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />

            {/* Discount Badge */}
            <div className="absolute top-3 right-3 rounded-full bg-linear-to-r from-primary to-accent px-3 py-1 text-xs font-semibold text-white shadow-lg">
              {getDiscountBadge(product)}
            </div>

            {product.isTrending && (
              <div className="absolute right-3 top-14 rounded-full bg-white/90 px-3 py-1 text-[11px] font-semibold text-rose-600 shadow">
                🔥 Trending
              </div>
            )}

            {product.isBestSeller && (
              <div className="absolute left-3 top-14 rounded-full bg-white/90 px-3 py-1 text-[11px] font-semibold text-pink-600 shadow">
                💝 Best Seller
              </div>
            )}

            <div className="absolute bottom-3 left-3 rounded-full bg-white/90 px-3 py-1 text-[11px] font-semibold text-foreground shadow">
              Best for {product.bestFor[0]}
            </div>

            {/* Wishlist Button */}
            <button
              onClick={handleWishlist}
              className="absolute top-3 left-3 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-all duration-200 shadow-md"
            >
              <Heart
                size={20}
                className={`transition-colors duration-200 ${
                  isWishlisted
                    ? 'fill-primary text-primary'
                    : 'text-muted-foreground hover:text-primary'
                }`}
              />
            </button>

          </div>

          {/* Content */}
          <div className="flex-1 flex flex-col p-4 gap-3">
            {/* Category */}
            <div className="flex flex-wrap gap-2">
              {product.bestFor.slice(0, 2).map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-muted px-2 py-1 text-xs capitalize text-muted-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Name */}
            <h3 className="font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
              {product.name}
            </h3>

            {/* Rating */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                {Array(5)
                  .fill(null)
                  .map((_, i) => (
                    <Star
                      key={i}
                      size={14}
                      className={`${
                        i < Math.round(product.rating)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-muted-foreground'
                      }`}
                    />
                  ))}
              </div>
              <span className="text-xs text-muted-foreground">
                ({product.reviews})
              </span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-2 mt-auto">
              <span className="text-lg font-bold text-foreground">
                {formatPrice(product.price)}
              </span>
              <span className="text-sm text-muted-foreground line-through">
                {formatPrice(originalPrice)}
              </span>
              {product.originalPrice && (
                <span className="text-sm text-muted-foreground line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>

            <p className="text-xs font-medium text-primary/85">Only {Math.max(3, 18 - (discountPercent % 12))} left at this price</p>

            <div className="mt-2 grid grid-cols-1 gap-2 opacity-95 transition duration-300 group-hover:opacity-100 sm:grid-cols-2">
              <motion.button
                onClick={handleAddToCart}
                className="flex items-center justify-center gap-2 rounded-xl bg-primary py-2 text-sm font-semibold text-white transition-all duration-300 hover:scale-105 hover:shadow-lg hover:bg-primary/90"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <ShoppingCart size={16} />
                Add to Cart
              </motion.button>

              <motion.button
                onClick={(e) => handleBuyNow(e, product)}
                className="rounded-xl bg-linear-to-r from-pink-500 to-rose-500 py-2 text-sm font-semibold text-white transition-all duration-300 hover:scale-105 hover:shadow-lg"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                Buy Now
              </motion.button>
            </div>

            {/* Stock Status */}
            {!product.inStock && (
              <p className="text-xs text-red-600 font-semibold">Out of Stock</p>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
