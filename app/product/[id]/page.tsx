'use client';

import { useEffect, useState, use } from 'react';
import { addProductReview, getProductById, getProducts } from '@/lib/api';
import { Product } from '@/lib/types';
import { formatPrice } from '@/lib/utils';
import { useCart } from '@/hooks/useCart';
import { useWishlist } from '@/hooks/useWishlist';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import Loader from '@/components/shared/Loader';
import { Heart, ShoppingCart, Star, Check, Truck, RotateCw } from 'lucide-react';
import { toast } from 'sonner';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import ProductCard from '@/components/product/ProductCard';

interface ProductDetailProps {
  params: Promise<{ id: string }>;
}

export default function ProductDetailPage({ params }: ProductDetailProps) {
  const { id } = use(params);
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [selectedTab, setSelectedTab] = useState<'description' | 'details' | 'reviews'>('description');
  const [selectedImage, setSelectedImage] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [loading, setLoading] = useState(true);

  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const isWishlisted = product ? isInWishlist(product.id) : false;

  const productReviews = product?.reviewsData ?? [];

  useEffect(() => {
    let isActive = true;

    const loadProduct = async () => {
      setLoading(true);
      try {
        const [productData, allProducts] = await Promise.all([getProductById(id), getProducts()]);

        if (!isActive) {
          return;
        }

        if (productData) {
          setProduct(productData);
          setSelectedImage(productData.images?.[0] || productData.image);

          const related = allProducts
            .filter((p) => p.category === productData.category && p.id !== id)
            .slice(0, 4);
          setRelatedProducts(related);
        } else {
          setProduct(null);
          setRelatedProducts([]);
        }
      } catch (error: unknown) {
        if (isActive) {
          const message = error instanceof Error ? error.message : 'Failed to load product';
          toast.error(message);
          setProduct(null);
          setRelatedProducts([]);
        }
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    };

    loadProduct();

    return () => {
      isActive = false;
    };
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
      toast.success(`Added ${quantity} to cart!`);
      setQuantity(1);
    }
  };

  const handleBuyNow = (selectedProduct: Product) => {
    if (!selectedProduct) {
      toast.error('Product not found');
      return;
    }

    const item = {
      productId: selectedProduct._id || selectedProduct.id,
      quantity: 1,
    };

    localStorage.setItem('buyNowItem', JSON.stringify(item));
    router.push('/checkout?mode=buy-now');
  };

  const handleWishlist = () => {
    if (!product) return;
    if (isWishlisted) {
      removeFromWishlist(product.id);
      toast.success('Removed from wishlist');
    } else {
      addToWishlist(product.id);
      toast.success('Added to wishlist!');
    }
  };

  const handleSubmitReview = async () => {
    if (!product) return;

    if (!isAuthenticated) {
      toast.error('Please login to submit a review');
      router.push('/auth/login');
      return;
    }

    if (!reviewComment.trim()) {
      toast.error('Please write a review comment');
      return;
    }

    setSubmittingReview(true);
    try {
      const updated = await addProductReview(product.id, {
        rating: reviewRating,
        comment: reviewComment.trim(),
      });
      setProduct(updated);
      setReviewComment('');
      setReviewRating(5);
      toast.success('Review submitted successfully');
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to submit review';
      toast.error(message);
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Loader label="Loading product details..." className="py-20" />
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Product not found</h1>
          <Link href="/shop">
            <Button>Back to Shop</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="flex gap-2 mb-8 text-sm text-muted-foreground">
          <Link href="/shop" className="hover:text-primary">Shop</Link>
          <span>/</span>
          <span className="text-foreground">{product.name}</span>
        </div>

        {/* Main Product Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <div className="card-soft group relative flex aspect-square items-center justify-center overflow-hidden">
              <Image
                src={selectedImage || product.images?.[0] || product.image}
                alt={product.name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
            </div>

            <div className="grid grid-cols-4 gap-3">
              {[product.images?.[0] || product.image, ...(product.images ?? [])].slice(0, 4).map((image, index) => (
                <button
                  key={`${image}-${index}`}
                  onClick={() => setSelectedImage(image)}
                  className={`relative h-20 overflow-hidden rounded-xl border-2 transition ${
                    selectedImage === image ? 'border-primary' : 'border-border hover:border-primary/40'
                  }`}
                >
                  <Image src={image} alt={`${product.name}-${index + 1}`} fill className="object-cover" />
                </button>
              ))}
            </div>
          </motion.div>

          {/* Details */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col justify-between"
          >
            {/* Category Badge */}
            <div className="inline-flex w-fit px-3 py-1 rounded-full bg-muted text-muted-foreground text-sm mb-4">
              {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
            </div>

            {/* Title */}
            <h1 className="text-4xl font-bold text-foreground mb-4">{product.name}</h1>

            {/* Rating */}
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center gap-1">
                {Array(5)
                  .fill(null)
                  .map((_, i) => (
                    <Star
                      key={i}
                      size={20}
                      className={`${
                        i < Math.round(product.rating)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-muted-foreground'
                      }`}
                    />
                  ))}
              </div>
              <span className="text-sm text-muted-foreground">
                {product.rating} ({product.reviews} reviews)
              </span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-4xl font-bold text-foreground">{formatPrice(product.price)}</span>
              {product.originalPrice && (
                <>
                  <span className="text-xl text-muted-foreground line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                  {product.discount && (
                    <span className="text-sm font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full">
                      Save {product.discount}%
                    </span>
                  )}
                </>
              )}
            </div>

            {/* Description */}
            <p className="text-muted-foreground mb-8 leading-relaxed">{product.description}</p>

            <div className="mb-8 rounded-2xl border border-border bg-white/70 p-4">
              <h3 className="mb-3 text-lg font-semibold text-foreground">Why you'll love this 💖</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2"><Check size={16} className="text-primary" />Ultra-soft plush fabric with premium finish</li>
                <li className="flex items-center gap-2"><Check size={16} className="text-primary" />Perfectly giftable for birthdays and surprises</li>
                <li className="flex items-center gap-2"><Check size={16} className="text-primary" />Designed to deliver emotional, memorable moments</li>
              </ul>
            </div>

            {/* Best For */}
            <div className="mb-8">
              <p className="text-sm font-semibold text-foreground mb-3">Perfect For:</p>
              <div className="flex flex-wrap gap-2">
                {product.bestFor.map((item) => (
                  <span key={item} className="px-4 py-2 rounded-full bg-muted text-foreground text-sm capitalize">
                    {item}
                  </span>
                ))}
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center gap-4 mb-8">
              <span className="text-sm font-semibold text-foreground">Quantity:</span>
              <div className="flex items-center border border-border rounded-lg">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-2 hover:bg-muted transition-colors"
                >
                  −
                </button>
                <span className="px-6 py-2 font-semibold">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-4 py-2 hover:bg-muted transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="mb-8 hidden sm:block">
              <div className="flex gap-4">
                <Button
                  size="lg"
                  onClick={handleAddToCart}
                  className="flex-1 rounded-full bg-linear-to-r from-primary to-accent hover:shadow-lg"
                >
                  <ShoppingCart size={20} className="mr-2" />
                  Add to Cart
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={handleWishlist}
                  className={isWishlisted ? 'border-primary text-primary rounded-full' : 'rounded-full'}
                >
                  <Heart
                    size={20}
                    className={isWishlisted ? 'fill-primary' : ''}
                  />
                </Button>
              </div>
              <Button
                onClick={() => handleBuyNow(product)}
                className="mt-3 w-full rounded-xl bg-linear-to-r from-pink-500 to-rose-500 py-3 text-lg font-semibold text-white transition-all duration-300 hover:scale-105 hover:shadow-lg"
              >
                Buy Now
              </Button>
            </div>

            {/* Stock Status */}
            <div className="space-y-3 p-4 rounded-lg bg-muted/50 border border-border">
              <div className="flex items-center gap-2 text-sm">
                <Check size={18} className="text-primary" />
                <span>In Stock - Order Soon</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Truck size={18} className="text-primary" />
                <span>Free shipping on orders above ₹999</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <RotateCw size={18} className="text-primary" />
                <span>30-day returns available</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Tabs Section */}
        <div className="border-b border-border mb-12">
          <div className="flex gap-8 mb-0">
            {(['description', 'details', 'reviews'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setSelectedTab(tab)}
                className={`py-4 font-semibold capitalize transition-colors ${
                  selectedTab === tab
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="mb-20 rounded-2xl border border-border bg-white/70 p-6 sm:p-8">
          {selectedTab === 'description' && (
            <div className="max-w-none space-y-4">
              <p className="text-muted-foreground leading-relaxed mb-4">
                {product.description}
              </p>
              <p className="text-muted-foreground leading-relaxed">
                This premium stuffed toy is crafted with care and attention to detail, making it the perfect emotional gift for your loved ones. Whether you&apos;re expressing love, celebrating a milestone, or just brightening someone&apos;s day, this gift is sure to create lasting memories.
              </p>
            </div>
          )}

          {selectedTab === 'details' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-semibold text-muted-foreground mb-1">Material</p>
                  <p className="text-foreground">100% Premium Polyester</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-muted-foreground mb-1">Care</p>
                  <p className="text-foreground">Machine Washable</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-muted-foreground mb-1">Safety</p>
                  <p className="text-foreground">Hypoallergenic & Safe</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-muted-foreground mb-1">Age</p>
                  <p className="text-foreground">All Ages</p>
                </div>
              </div>
            </div>
          )}

          {selectedTab === 'reviews' && (
            <div className="space-y-6">
              <div className="rounded-xl border border-border bg-background/60 p-4 sm:p-5">
                <h3 className="text-lg font-semibold text-foreground mb-4">Write a Review</h3>

                <div className="mb-4">
                  <p className="mb-2 text-sm font-medium text-foreground">Your Rating</p>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, index) => {
                      const starValue = index + 1;
                      return (
                        <button
                          key={starValue}
                          type="button"
                          onClick={() => setReviewRating(starValue)}
                          className="p-1"
                          aria-label={`Rate ${starValue} star${starValue > 1 ? 's' : ''}`}
                        >
                          <Star
                            size={20}
                            className={
                              starValue <= reviewRating
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-muted-foreground'
                            }
                          />
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="mb-4">
                  <label htmlFor="review-comment" className="mb-2 block text-sm font-medium text-foreground">
                    Your Comment
                  </label>
                  <textarea
                    id="review-comment"
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    rows={4}
                    maxLength={500}
                    placeholder="Share your experience with this product"
                    className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <p className="mt-1 text-xs text-muted-foreground">{reviewComment.length}/500</p>
                </div>

                <Button onClick={handleSubmitReview} disabled={submittingReview}>
                  {submittingReview ? 'Submitting...' : 'Submit Review'}
                </Button>
              </div>

              {productReviews.length === 0 ? (
                <p className="text-sm text-muted-foreground">No reviews yet. Be the first to review this product.</p>
              ) : (
                productReviews.map((review, index) => (
                  <div key={`${review.user?._id ?? review.user?.name ?? 'review'}-${index}`} className="pb-6 border-b border-border last:border-b-0">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="font-semibold text-foreground">{review.user?.name || 'Verified Customer'}</p>
                        <p className="text-xs text-muted-foreground">Verified Review</p>
                      </div>
                      <div className="flex gap-1">
                        {Array.from({ length: 5 }).map((_, starIndex) => (
                          <Star
                            key={starIndex}
                            size={16}
                            className={
                              starIndex < Math.round(review.rating)
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-muted-foreground'
                            }
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-muted-foreground">{review.comment}</p>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="text-3xl font-bold mb-8 text-foreground">Related Products</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}

        <div className="fixed bottom-16 left-0 right-0 z-40 border-t border-border bg-white/95 p-3 backdrop-blur sm:hidden">
          <div className="mx-auto max-w-7xl px-2">
            <div className="flex gap-3">
              <Button onClick={handleWishlist} variant="outline" className={isWishlisted ? 'border-primary text-primary' : ''}>
                <Heart className={isWishlisted ? 'fill-primary' : ''} />
              </Button>
              <Button onClick={handleAddToCart} className="flex-1 rounded-full bg-linear-to-r from-primary to-accent">
                <ShoppingCart size={18} className="mr-2" />
                Add to Cart
              </Button>
            </div>
            <Button
              onClick={() => handleBuyNow(product)}
              className="mt-3 w-full rounded-xl bg-linear-to-r from-pink-500 to-rose-500 py-3 text-base font-semibold text-white transition-all duration-300 hover:scale-105 hover:shadow-lg"
            >
              Buy Now
            </Button>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-white/95 p-3 backdrop-blur sm:hidden">
        <div className="mx-auto flex max-w-7xl gap-2">
          <Button onClick={handleAddToCart} variant="outline" className="flex-1 rounded-full">
            Add to Cart
          </Button>
          <Button onClick={() => handleBuyNow(product)} className="flex-1 rounded-full bg-linear-to-r from-primary to-accent text-white">
            Buy Now
          </Button>
        </div>
      </div>
    </div>
  );
}
