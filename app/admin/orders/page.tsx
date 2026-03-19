'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { getOrders, updateOrderStatus } from '@/lib/api';
import { formatPrice } from '@/lib/utils';
import { Order } from '@/lib/types';
import Loader from '@/components/shared/Loader';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { Package, TrendingUp, CheckCircle, Clock } from 'lucide-react';

export default function AdminOrdersPage() {
  const router = useRouter();
  const { user, isAuthenticated, isAdmin } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }

    if (!isAdmin()) {
      router.push('/');
      return;
    }

    const loadOrders = async () => {
      setLoading(true);
      try {
        const data = await getOrders();
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
  }, [isAuthenticated, isAdmin, router]);

  const totalOrders = orders.length;
  const totalRevenue = useMemo(() => orders.reduce((sum, order) => sum + order.total, 0), [orders]);
  const deliveredOrders = useMemo(() => orders.filter((o) => o.status === 'delivered').length, [orders]);
  const pendingOrders = useMemo(() => orders.filter((o) => o.status === 'pending').length, [orders]);

  if (!isAuthenticated || !isAdmin()) {
    return null;
  }

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    setUpdatingId(orderId);
    try {
      const updated = await updateOrderStatus(orderId, newStatus);
      setOrders((prev) => prev.map((o) => (o.id === orderId ? updated : o)));
      toast.success(`Order updated to ${newStatus}`);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to update order';
      toast.error(message);
    } finally {
      setUpdatingId(null);
    }
  };

  const statusOptions = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      delivered: 'bg-green-100 text-green-700',
      shipped: 'bg-blue-100 text-blue-700',
      confirmed: 'bg-yellow-100 text-yellow-700',
      pending: 'bg-gray-100 text-gray-700',
      cancelled: 'bg-red-100 text-red-700',
    };
    return styles[status] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="min-h-screen bg-background">
      <main>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-2">Admin Orders</h1>
            <p className="text-muted-foreground">
              Welcome back{user ? `, ${user.name}` : ''}! Manage your orders here.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-linear-to-br from-primary/10 to-primary/5 rounded-2xl p-6 card-soft">
              <Package className="mb-3 text-primary" size={28} />
              <p className="text-muted-foreground text-sm mb-1">Total Orders</p>
              <p className="text-3xl font-bold text-primary">{totalOrders}</p>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-linear-to-br from-green-50 to-green-100/50 rounded-2xl p-6 card-soft">
              <CheckCircle className="mb-3 text-green-600" size={28} />
              <p className="text-muted-foreground text-sm mb-1">Delivered</p>
              <p className="text-3xl font-bold text-green-600">{deliveredOrders}</p>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-linear-to-br from-yellow-50 to-yellow-100/50 rounded-2xl p-6 card-soft">
              <Clock className="mb-3 text-yellow-600" size={28} />
              <p className="text-muted-foreground text-sm mb-1">Pending</p>
              <p className="text-3xl font-bold text-yellow-600">{pendingOrders}</p>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-linear-to-br from-blue-50 to-blue-100/50 rounded-2xl p-6 card-soft">
              <TrendingUp className="mb-3 text-blue-600" size={28} />
              <p className="text-muted-foreground text-sm mb-1">Total Revenue</p>
              <p className="text-3xl font-bold text-blue-600">{formatPrice(totalRevenue)}</p>
            </motion.div>
          </div>

          <div className="bg-white rounded-2xl card-soft overflow-hidden">
            <div className="p-6 border-b border-border flex items-center justify-between">
              <h2 className="text-2xl font-bold text-foreground">All Orders</h2>
              <span className="text-sm text-muted-foreground">{totalOrders} total</span>
            </div>

            <div className="overflow-x-auto">
              {loading ? (
                <Loader label="Loading orders..." className="py-12" />
              ) : orders.length === 0 ? (
                <div className="py-16 text-center">
                  <Package size={48} className="mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">No orders received yet.</p>
                </div>
              ) : (
                <table className="w-full">
                  <thead className="bg-secondary border-b border-border">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Order ID</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Customer</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Phone</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Amount</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Status</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Date</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {orders.map((order) => (
                      <tr key={order.id} className="hover:bg-secondary/50 transition-colors">
                        <td className="px-6 py-4 text-sm font-semibold text-primary">{order.id.slice(0, 12)}</td>
                        <td className="px-6 py-4">
                          <p className="text-sm font-medium text-foreground">{order.customerName}</p>
                          <p className="text-xs text-muted-foreground">{order.customerEmail || 'N/A'}</p>
                        </td>
                        <td className="px-6 py-4 text-sm text-muted-foreground">{order.customerPhone}</td>
                        <td className="px-6 py-4 text-sm font-semibold text-foreground">{formatPrice(order.total)}</td>
                        <td className="px-6 py-4 text-sm">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${getStatusBadge(order.status)}`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-muted-foreground">
                          {new Date(order.createdAt).toLocaleDateString('en-IN', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <select
                            value={order.status}
                            onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                            disabled={updatingId === order.id}
                            className="rounded-lg border border-border bg-white px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
                          >
                            {statusOptions.map((s) => (
                              <option key={s} value={s}>
                                {s.charAt(0).toUpperCase() + s.slice(1)}
                              </option>
                            ))}
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          <div className="mt-12 flex flex-col sm:flex-row gap-4">
            <Link href="/" className="px-6 py-3 rounded-lg border-2 border-primary text-primary font-semibold text-center hover:bg-secondary transition-colors">
              Back to Store
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
