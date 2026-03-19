'use client';

import { useCart } from '@/hooks/useCart';
import { formatPrice, calculateTax, calculateShipping } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import CartItem from '@/components/cart/CartItem';
import { ShoppingBag } from 'lucide-react';
import NextLink from 'next/link';
import { motion } from 'framer-motion';

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, getTotalPrice, clearCart } = useCart();

  const subtotal = getTotalPrice();
  const shipping = calculateShipping(subtotal);
  const tax = calculateTax(subtotal);
  const total = subtotal + shipping + tax;

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="card-soft py-20 text-center">
            <ShoppingBag size={64} className="mx-auto mb-6 text-primary/70" />
            <h1 className="text-3xl font-bold text-foreground mb-4">Your cart is empty</h1>
            <p className="mx-auto mb-8 max-w-md text-muted-foreground">
              Start adding your favorite stuffed gifts to continue to checkout.
            </p>
            <NextLink href="/shop">
              <Button size="lg" className="rounded-full bg-linear-to-r from-primary to-accent px-8">
                Continue Shopping
              </Button>
            </NextLink>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-foreground mb-12">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item, index) => (
              <motion.div
                key={item.productId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <CartItem
                  item={item}
                  onIncrease={() => updateQuantity(item.productId, item.quantity + 1)}
                  onDecrease={() => updateQuantity(item.productId, item.quantity - 1)}
                  onRemove={() => removeFromCart(item.productId)}
                />
              </motion.div>
            ))}

            {/* Clear Cart Button */}
            <div className="flex justify-end">
              <button
                onClick={clearCart}
                className="rounded-full border border-border px-4 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                Clear Cart
              </button>
            </div>
          </div>

          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <div className="card-soft sticky top-24 p-6">
              <h2 className="font-bold text-lg text-foreground mb-6">Order Summary</h2>

              <div className="space-y-4 mb-6 pb-6 border-b border-border">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Shipping</span>
                  <span>
                    {shipping === 0 ? (
                      <span className="text-primary font-semibold">Free</span>
                    ) : (
                      formatPrice(shipping)
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Tax (12%)</span>
                  <span>{formatPrice(tax)}</span>
                </div>
              </div>

              <div className="flex justify-between items-center mb-6">
                <span className="font-semibold text-foreground">Total</span>
                <span className="text-2xl font-bold text-primary">{formatPrice(total)}</span>
              </div>

              <NextLink href="/checkout" className="w-full block">
                <Button
                  size="lg"
                  className="w-full bg-linear-to-r from-primary to-accent hover:shadow-lg"
                >
                  Proceed to Checkout
                </Button>
              </NextLink>

              <NextLink href="/shop" className="w-full block mt-3">
                <Button size="lg" variant="outline" className="w-full">
                  Continue Shopping
                </Button>
              </NextLink>

              {/* Free Shipping Info */}
              {shipping > 0 && (
                <p className="text-sm text-muted-foreground mt-4 text-center">
                  Free shipping on orders above ₹999
                </p>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
