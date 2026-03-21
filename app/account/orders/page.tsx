'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { cancelOrder, getUserOrders } from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';
import type { Order } from '@/lib/types';
import { formatPrice } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import Loader from '@/components/shared/Loader';
import { Package } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

export default function AccountOrdersPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancellingOrderId, setCancellingOrderId] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }

    const loadOrders = async () => {
      setLoading(true);
      try {
        const data = await getUserOrders();
        setOrders(data);
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Failed to load orders';
        toast.error(message);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, [isAuthenticated, router]);

  const handleCancelOrder = async (orderId: string) => {
    setCancellingOrderId(orderId);
    try {
      const updated = await cancelOrder(orderId);
      setOrders((prev) => prev.map((order) => (order.id === orderId ? updated : order)));
      toast.success('Order cancelled successfully');
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to cancel order';
      toast.error(message);
    } finally {
      setCancellingOrderId(null);
    }
  };

  const getStatusBadgeClass = (status: string) => {
    if (status === 'pending') {
      return 'bg-yellow-100 text-yellow-700';
    }
    if (status === 'confirmed') {
      return 'bg-blue-100 text-blue-700';
    }
    if (status === 'shipped') {
      return 'bg-purple-100 text-purple-700';
    }
    if (status === 'delivered') {
      return 'bg-green-100 text-green-700';
    }
    if (status === 'cancelled') {
      return 'bg-red-100 text-red-700';
    }
    return 'bg-gray-100 text-gray-700';
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-4xl font-bold text-foreground">Order History</h1>
          <Link href="/account" className="text-primary hover:text-primary/80 font-medium">
            Back to Account
          </Link>
        </div>

        {loading ? (
          <Loader label="Loading your orders..." className="py-24" />
        ) : orders.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <Package size={64} className="mx-auto mb-6 text-muted-foreground" />
            <h2 className="text-2xl font-bold text-foreground mb-4">No orders yet</h2>
            <p className="text-muted-foreground mb-8">Start shopping and place your first order today.</p>
            <Link href="/shop">
              <Button className="bg-linear-to-r from-primary to-accent">Continue Shopping</Button>
            </Link>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {orders.map((order, index) => {
              const firstItem = order.items[0];
              return (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.06 }}
                  className="p-6 sm:p-7 rounded-2xl border border-border bg-white hover:shadow-lg transition-shadow"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <img
                        src={firstItem?.image || '/images/products/teddy-pink.jpg'}
                        alt={firstItem?.name || 'Ordered product'}
                        className="h-16 w-16 rounded-xl object-cover border border-border"
                      />
                      <div>
                        <h3 className="text-lg font-semibold text-foreground leading-tight">
                          {firstItem?.name || 'Product'}
                          {order.items.length > 1 ? ` +${order.items.length - 1} more` : ''}
                        </h3>
                        <p className="mt-1 text-sm text-muted-foreground">
                          Order placed on:{' '}
                          {new Date(order.createdAt).toLocaleDateString('en-IN', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </p>
                        <p className="mt-1 text-sm text-muted-foreground">
                          Qty: <span className="font-medium text-foreground">{firstItem?.quantity ?? 1}</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">Price</p>
                        <p className="text-xl font-bold text-foreground">{formatPrice(order.total)}</p>
                      </div>
                      <span className={`px-4 py-2 rounded-full text-sm font-semibold capitalize ${getStatusBadgeClass(order.status)}`}>
                        {order.status}
                      </span>
                    </div>
                  </div>

                  {order.status === 'pending' && (
                    <div className="mt-4 pt-4 border-t border-border">
                      <Button
                        variant="outline"
                        className="border-red-300 text-red-600 hover:bg-red-50"
                        disabled={cancellingOrderId === order.id}
                        onClick={() => handleCancelOrder(order.id)}
                      >
                        {cancellingOrderId === order.id ? 'Cancelling...' : 'Cancel Order'}
                      </Button>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
