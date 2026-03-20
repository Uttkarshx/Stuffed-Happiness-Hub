'use client';

import { Suspense, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/hooks/useAuth';
import { formatPrice, calculateTax, calculateShipping } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { createOrder, getProductById } from '@/lib/api';
import { CartItem } from '@/lib/types';
import { CreditCard, Banknote, MapPin, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { useSearchParams } from 'next/navigation';

function getErrorMessage(error: unknown, fallback: string) {
  if (typeof error === 'object' && error !== null) {
    const maybeError = error as { message?: string };
    if (maybeError.message) {
      return maybeError.message;
    }
  }
  return fallback;
}

function CheckoutContent() {
  const { items: cartItems, placeOrder } = useCart();
  const { user, isAuthenticated } = useAuth();
  const searchParams = useSearchParams();
  const mode = searchParams.get('mode');

  const [buyNowItem, setBuyNowItem] = useState<CartItem | null>(null);
  const [buyNowReady, setBuyNowReady] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; percent: number } | null>(null);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    email: user?.email || '',
    address: user?.address || '',
    city: user?.city || '',
    landmark: '',
    paymentMethod: 'cod' as 'cod' | 'razorpay',
  });

  useEffect(() => {
    let isActive = true;

    const loadBuyNowItem = async () => {
      if (mode !== 'buy-now') {
        if (isActive) {
          setBuyNowItem(null);
          setBuyNowReady(true);
        }
        return;
      }

      try {
        const raw = localStorage.getItem('buyNowItem');
        if (!raw) {
          if (isActive) {
            setBuyNowItem(null);
            setBuyNowReady(true);
          }
          return;
        }

        const parsed = JSON.parse(raw) as Partial<CartItem>;
        const safeQuantity = Number(parsed.quantity || 0);

        if (!parsed.productId || safeQuantity <= 0) {
          localStorage.removeItem('buyNowItem');
          if (isActive) {
            setBuyNowItem(null);
            setBuyNowReady(true);
          }
          return;
        }

        const product = await getProductById(String(parsed.productId));
        if (!product) {
          localStorage.removeItem('buyNowItem');
          if (isActive) {
            toast.error('Selected product is no longer available. Showing cart checkout instead.');
            setBuyNowItem(null);
            setBuyNowReady(true);
          }
          return;
        }

        if (isActive) {
          setBuyNowItem({
            productId: product.id,
            name: product.name,
            price: product.price,
            quantity: safeQuantity,
            image: product.images?.[0] || product.image,
          });
          setBuyNowReady(true);
        }
      } catch (error) {
        console.error('Failed to initialize buy-now item:', error);
        localStorage.removeItem('buyNowItem');
        if (isActive) {
          setBuyNowItem(null);
          setBuyNowReady(true);
        }
      }
    };

    setBuyNowReady(false);
    loadBuyNowItem();

    return () => {
      isActive = false;
    };
  }, [mode]);

  const items = useMemo(
    () => (mode === 'buy-now' && buyNowItem ? [buyNowItem] : cartItems),
    [mode, buyNowItem, cartItems]
  );

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items]
  );
  const shipping = calculateShipping(subtotal);
  const tax = calculateTax(subtotal);
  const discountAmount = appliedCoupon ? Math.round((subtotal * appliedCoupon.percent) / 100) : 0;
  const total = subtotal + shipping + tax - discountAmount;

  const handleApplyCoupon = () => {
    const normalized = couponCode.trim().toUpperCase();
    const coupons: Record<string, number> = {
      LOVE10: 10,
      TEDDY20: 20,
    };

    if (!normalized) {
      toast.error('Enter a coupon code first');
      return;
    }

    const percent = coupons[normalized];
    if (!percent) {
      setAppliedCoupon(null);
      toast.error('Invalid coupon code');
      return;
    }

    setAppliedCoupon({ code: normalized, percent });
    toast.success(`Coupon applied: ${normalized} (${percent}% off)`);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error('Please enter your name');
      return;
    }
    if (!formData.phone.trim()) {
      toast.error('Please enter your phone number');
      return;
    }
    if (!formData.email.trim()) {
      toast.error('Please enter your email');
      return;
    }
    if (!formData.address.trim()) {
      toast.error('Please enter your address');
      return;
    }
    if (!formData.city.trim()) {
      toast.error('Please select your city');
      return;
    }
    if (items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    setIsProcessing(true);

    try {
      const orderData = {
        userId: user?.id,
        items: items.map((item) => ({
          productId: item.productId,
          name: item.name,
          price: item.price,
          image: item.image,
          quantity: item.quantity,
        })),
        phone: formData.phone,
        subtotal,
        shipping,
        tax,
        total,
        totalAmount: total,
        customerName: formData.name,
        customerPhone: formData.phone,
        customerEmail: formData.email,
        address: formData.address,
        landmark: formData.landmark || undefined,
        city: formData.city,
        paymentMethod: formData.paymentMethod,
      };

      const order = mode === 'buy-now' ? await createOrder(orderData) : await placeOrder(orderData);

      if (formData.paymentMethod === 'razorpay') {
        // Razorpay flow will be connected when backend is ready
        toast.info('Online payment will be available once Razorpay is configured.');
        // For now, treat as COD
      }

      if (mode === 'buy-now') {
        localStorage.removeItem('buyNowItem');
      }

      setOrderId(order.id);
      setOrderSuccess(true);
      toast.success('Order placed successfully! 🎉');
    } catch (error: unknown) {
      toast.error(getErrorMessage(error, 'Failed to place order. Please try again.'));
    } finally {
      setIsProcessing(false);
    }
  };

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported in this browser');
      return;
    }

    setIsDetectingLocation(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=jsonv2`,
            {
              headers: {
                Accept: 'application/json',
              },
            }
          );

          if (!response.ok) {
            throw new Error('Unable to fetch location details');
          }

          const data = (await response.json()) as {
            display_name?: string;
            address?: {
              road?: string;
              suburb?: string;
              city?: string;
              town?: string;
              village?: string;
              state_district?: string;
            };
          };

          const city =
            data.address?.city ||
            data.address?.town ||
            data.address?.village ||
            data.address?.state_district ||
            '';

          const exactAddress =
            [data.address?.road, data.address?.suburb].filter(Boolean).join(', ') || data.display_name || '';

          setFormData((prev) => ({
            ...prev,
            address: exactAddress || prev.address,
            city: city || prev.city,
          }));

          toast.success('Current location detected');
        } catch (error) {
          console.error('Failed to resolve geolocation address:', error);
          toast.error('Unable to auto-detect address. Please enter manually.');
        } finally {
          setIsDetectingLocation(false);
        }
      },
      () => {
        setIsDetectingLocation(false);
        toast.error('Location access denied. Please allow location permission.');
      },
      {
        enableHighAccuracy: true,
        timeout: 12000,
        maximumAge: 0,
      }
    );
  };

  // Order success state
  if (orderSuccess) {
    return (
      <div className="min-h-screen bg-background py-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-lg mx-auto px-4 text-center"
        >
          <div className="card-soft p-10">
            <CheckCircle size={64} className="mx-auto mb-6 text-green-500" />
            <h1 className="text-3xl font-bold text-foreground mb-3">
              Order Confirmed! 🎉
            </h1>
            <p className="text-muted-foreground mb-2">
              Thank you for your order, {formData.name}!
            </p>
            <p className="text-sm text-muted-foreground mb-6">
              Order ID: <span className="font-semibold text-primary">{orderId}</span>
            </p>
            <p className="text-sm text-muted-foreground mb-8">
              We&apos;ll send you an update once your order is shipped.
            </p>

            <div className="flex flex-col gap-3">
              {isAuthenticated && (
                <Link href="/orders">
                  <Button variant="outline" className="w-full">
                    View My Orders
                  </Button>
                </Link>
              )}
              <Link href="/shop">
                <Button className="w-full bg-linear-to-r from-primary to-accent">
                  Continue Shopping
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  if (!buyNowReady) {
    return (
      <div className="min-h-screen bg-background py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl font-bold text-foreground mb-4">Loading checkout...</h1>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl font-bold text-foreground mb-4">Your cart is empty</h1>
          <p className="text-muted-foreground mb-8">Add items before checkout</p>
          <Link href="/shop">
            <Button size="lg" className="bg-linear-to-r from-primary to-accent">
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href={mode === 'buy-now' ? '/shop' : '/cart'} className="text-primary hover:text-primary/80 mb-8 inline-block">
          {mode === 'buy-now' ? '← Back to Shop' : '← Back to Cart'}
        </Link>

        <h1 className="text-4xl font-bold text-foreground mb-12">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2"
          >
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Delivery Information */}
              <div className="card-soft p-6">
                <h2 className="text-2xl font-bold text-foreground mb-6">Delivery Information</h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-foreground mb-2">Name *</label>
                      <Input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Your full name"
                        className="h-11 rounded-xl bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-foreground mb-2">Email *</label>
                      <Input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="you@example.com"
                        className="h-11 rounded-xl bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">Phone *</label>
                    <Input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+91-9876543210"
                      className="h-11 rounded-xl bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">Address *</label>
                    <Input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="Street, area, house number"
                      className="h-11 rounded-xl bg-white"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleUseCurrentLocation}
                      disabled={isDetectingLocation}
                      className="mt-3 w-full sm:w-auto"
                    >
                      <MapPin size={16} className="mr-2" />
                      {isDetectingLocation ? 'Detecting location...' : 'Use Current Location'}
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-foreground mb-2">City *</label>
                      <select
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        className="h-11 w-full rounded-xl border border-border bg-white px-4 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        <option value="">Select city</option>
                        <option>Delhi</option>
                        <option>Gurgaon</option>
                        <option>Bangalore</option>
                        <option>Mumbai</option>
                        <option>Hyderabad</option>
                        <option>Pune</option>
                        <option>Chennai</option>
                        <option>Kolkata</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-foreground mb-2">Landmark</label>
                      <Input
                        type="text"
                        name="landmark"
                        value={formData.landmark}
                        onChange={handleChange}
                        placeholder="Near park, mall, etc."
                        className="h-11 rounded-xl bg-white"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="card-soft p-6">
                <h2 className="text-2xl font-bold text-foreground mb-6">Payment Method</h2>
                <div className="space-y-3">
                  <label className={`flex items-center gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    formData.paymentMethod === 'cod'
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  }`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={formData.paymentMethod === 'cod'}
                      onChange={handleChange}
                      className="w-4 h-4 accent-primary"
                    />
                    <div>
                      <p className="font-semibold text-foreground flex items-center gap-2"><Banknote size={16} /> Cash on Delivery</p>
                      <p className="text-sm text-muted-foreground">Pay when you receive</p>
                    </div>
                  </label>

                  <label className="flex items-center gap-4 rounded-lg border-2 border-border bg-muted/40 p-4 opacity-70">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="razorpay"
                      checked={false}
                      onChange={handleChange}
                      disabled
                      className="h-4 w-4 accent-primary"
                    />
                    <div>
                      <p className="flex items-center gap-2 font-semibold text-foreground"><CreditCard size={16} /> Pay Online (Razorpay) <span className="rounded-full bg-yellow-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-yellow-700">Coming Soon 🚧</span></p>
                      <p className="text-sm text-muted-foreground">Online payments will be available soon</p>
                    </div>
                  </label>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isProcessing}
                size="lg"
                className="w-full rounded-full bg-linear-to-r from-primary to-accent hover:shadow-lg disabled:opacity-75"
              >
                {isProcessing ? 'Processing...' : `Place Order — ${formatPrice(total)}`}
              </Button>
            </form>
          </motion.div>

          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <div className="card-soft sticky top-24 p-6">
              <h2 className="font-bold text-lg text-foreground mb-6">Order Summary</h2>

              <div className="space-y-3 mb-6 pb-6 border-b border-border max-h-64 overflow-y-auto">
                {items.map((item) => (
                  <div key={item.productId} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{item.name} x {item.quantity}</span>
                    <span className="font-semibold text-foreground">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="space-y-3 mb-6 pb-6 border-b border-border">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-foreground">Apply Coupon</label>
                  <div className="flex gap-2">
                    <Input
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      placeholder="LOVE10 or TEDDY20"
                      className="h-10 rounded-xl bg-white"
                    />
                    <Button type="button" variant="outline" onClick={handleApplyCoupon} className="h-10 rounded-xl">
                      Apply
                    </Button>
                  </div>
                </div>

                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Coupon Discount</span>
                  <span>-{formatPrice(discountAmount)}</span>
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? 'Free' : formatPrice(shipping)}</span>
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Tax (12%)</span>
                  <span>{formatPrice(tax)}</span>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="font-semibold text-foreground">Total</span>
                <span className="text-2xl font-bold text-primary">{formatPrice(total)}</span>
              </div>

              <div className="mt-6 rounded-2xl bg-muted/50 p-4 text-center text-sm text-muted-foreground">
                <p className="inline-flex items-center gap-2"><MapPin size={14} /> Delivery within 2-3 days</p>
                <p className="mt-2">30-day returns available</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-3xl font-bold text-foreground mb-4">Loading checkout...</h1>
          </div>
        </div>
      }
    >
      <CheckoutContent />
    </Suspense>
  );
}
