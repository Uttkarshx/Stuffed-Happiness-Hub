'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { cancelOrder, getUserOrders } from '@/lib/api';
import { formatPrice } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import Loader from '@/components/shared/Loader';
import { Package } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import type { Order } from '@/lib/types';
import { toast } from 'sonner';

export default function OrdersPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
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

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Redirecting...</p>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'text-green-600 bg-green-50';
      case 'shipped':
        return 'text-blue-600 bg-blue-50';
      case 'confirmed':
        return 'text-yellow-600 bg-yellow-50';
      case 'cancelled':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

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

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-foreground mb-12">My Orders</h1>

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
              <Button className="bg-linear-to-r from-primary to-accent">
                Continue Shopping
              </Button>
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
                transition={{ delay: index * 0.1 }}
                className="p-6 sm:p-7 rounded-2xl border border-border bg-white hover:shadow-lg transition-shadow"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <img
                      src={firstItem?.image || '/images/products/teddy-pink.jpg'}
                      alt={firstItem?.name || 'Ordered product'}
                      className="h-16 w-16 rounded-xl object-cover border border-border"
                    />
                    <div>
                      <h3 className="font-semibold text-foreground text-lg leading-tight">
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
                      <p className="mt-1 text-sm text-muted-foreground">
                        Price: <span className="font-semibold text-foreground">{formatPrice(order.total)}</span>
                      </p>
                      {order.status === 'pending' && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="mt-4 border-red-300 text-red-600 hover:bg-red-50"
                          disabled={cancellingOrderId === order.id}
                          onClick={() => handleCancelOrder(order.id)}
                        >
                          {cancellingOrderId === order.id ? 'Cancelling...' : 'Cancel Order'}
                        </Button>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <span className={`px-4 py-2 rounded-full text-sm font-semibold capitalize ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      order.paymentStatus === 'paid'
                        ? 'bg-green-50 text-green-700'
                        : order.paymentStatus === 'failed'
                        ? 'bg-red-50 text-red-700'
                        : 'bg-yellow-50 text-yellow-700'
                    }`}>
                      {order.paymentMethod === 'cod'
                        ? order.paymentStatus === 'failed'
                          ? 'COD Cancelled'
                          : 'COD'
                        : order.paymentStatus === 'paid'
                        ? 'Paid'
                        : order.paymentStatus === 'failed'
                        ? 'Payment Failed'
                        : 'Payment Pending'}
                    </span>
                  </div>
                </div>
              </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
