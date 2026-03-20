'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { getUserOrders } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { formatPrice } from '@/lib/utils';
import Loader from '@/components/shared/Loader';
import { User, Package, Heart, Settings, LogOut, Edit2, Save, X } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import type { Order } from '@/lib/types';

export default function AccountPage() {
  const router = useRouter();
  const { user, logout, updateProfile } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'wishlist' | 'settings'>('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
  });

  useEffect(() => {
    if (!user) {
      router.push('/auth/login');
      return;
    }

    setFormData({
      name: user.name,
      email: user.email,
    });

    const loadOrders = async () => {
      setIsLoading(true);
      try {
        const data = await getUserOrders();
        setOrders(data);
      } catch {
        setOrders([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadOrders();
  }, [user, router]);

  const handleSaveProfile = () => {
    if (!formData.name.trim()) {
      toast.error('Name is required');
      return;
    }
    updateProfile(formData.name);
    toast.success('Profile updated successfully');
    setIsEditing(false);
  };

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    router.push('/');
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-4xl font-bold text-foreground mb-4">My Account</h1>
          <p className="text-muted-foreground">Manage your profile and orders</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <div className="sticky top-24 space-y-2 p-4 rounded-2xl border border-border bg-white">
              {[
                { id: 'profile', icon: User, label: 'Profile' },
                { id: 'orders', icon: Package, label: 'Orders' },
                { id: 'wishlist', icon: Heart, label: 'Wishlist' },
                { id: 'settings', icon: Settings, label: 'Settings' },
              ].map(({ id, icon: Icon, label }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id as typeof activeTab)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    activeTab === id
                      ? 'bg-primary text-white'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`}
                >
                  <Icon size={20} />
                  {label}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-3"
          >
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="p-8 rounded-2xl border border-border bg-white">
                <div className="flex items-start justify-between mb-8">
                  <div>
                    <h2 className="text-2xl font-bold text-foreground mb-2">Profile Information</h2>
                    <p className="text-muted-foreground">Manage your personal details</p>
                  </div>
                  {!isEditing && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsEditing(true)}
                      className="flex items-center gap-2"
                    >
                      <Edit2 size={16} />
                      Edit
                    </Button>
                  )}
                </div>

                {isEditing ? (
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-semibold text-foreground mb-2">Full Name</label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-foreground mb-2">Email Address</label>
                      <input
                        type="email"
                        value={formData.email}
                        disabled
                        className="w-full px-4 py-3 rounded-lg border border-border bg-muted text-muted-foreground cursor-not-allowed"
                      />
                      <p className="text-xs text-muted-foreground mt-2">Email cannot be changed</p>
                    </div>
                    <div className="flex gap-3">
                      <Button
                        onClick={handleSaveProfile}
                        className="bg-linear-to-r from-primary to-accent flex items-center gap-2"
                      >
                        <Save size={16} />
                        Save Changes
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setIsEditing(false)}
                        className="flex items-center gap-2"
                      >
                        <X size={16} />
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Full Name</p>
                      <p className="text-lg font-semibold text-foreground">{user.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Email Address</p>
                      <p className="text-lg font-semibold text-foreground">{user.email}</p>
                    </div>
                    {user.role && (
                      <div>
                        <p className="text-sm text-muted-foreground">Role</p>
                        <p className="text-lg font-semibold text-foreground capitalize">{user.role}</p>
                      </div>
                    )}
                    <div>
                      <p className="text-sm text-muted-foreground">Member Since</p>
                      <p className="text-lg font-semibold text-foreground">{new Date(user.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <div className="space-y-4">
                {isLoading ? (
                  <Loader label="Loading orders..." className="py-16" />
                ) : orders.length === 0 ? (
                  <div className="p-8 rounded-2xl border border-border bg-white text-center">
                    <Package size={48} className="mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">No orders yet</p>
                    <Button className="mt-4" onClick={() => router.push('/shop')}>
                      Start Shopping
                    </Button>
                  </div>
                ) : (
                  orders.map((order, index) => (
                    <motion.div
                      key={order.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-6 rounded-2xl border border-border bg-white"
                    >
                      {(() => {
                        const firstItem = order.items[0];

                        return (
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start gap-4">
                          <img
                            src={firstItem?.image || '/images/products/teddy-pink.jpg'}
                            alt={firstItem?.name || 'Ordered product'}
                            className="h-14 w-14 rounded-lg object-cover border border-border"
                          />
                          <div>
                          <h3 className="font-semibold text-foreground">
                            {firstItem?.name || 'Product'}
                            {order.items.length > 1 ? ` +${order.items.length - 1} more` : ''}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {new Date(order.createdAt).toLocaleDateString('en-IN', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            })}
                          </p>
                          </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold capitalize ${
                          order.status === 'delivered'
                            ? 'bg-green-100 text-green-700'
                            : order.status === 'shipped'
                            ? 'bg-blue-100 text-blue-700'
                            : order.status === 'confirmed'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}>
                          {order.status}
                        </span>
                      </div>
                        );
                      })()}
                      <div className="flex justify-between items-end">
                        <div className="text-sm text-muted-foreground">
                          {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">Total Amount</p>
                          <p className="text-xl font-bold text-primary">{formatPrice(order.total)}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            )}

            {/* Wishlist Tab */}
            {activeTab === 'wishlist' && (
              <div className="p-8 rounded-2xl border border-border bg-white text-center">
                <Heart size={48} className="mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground mb-4">View your wishlist items</p>
                <Button onClick={() => router.push('/wishlist')}>
                  Go to Wishlist
                </Button>
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <div className="space-y-6">
                <div className="p-6 rounded-2xl border border-border bg-white">
                  <h3 className="text-lg font-bold text-foreground mb-4">Account Settings</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                      <div>
                        <p className="font-semibold text-foreground">Email Notifications</p>
                        <p className="text-sm text-muted-foreground">Receive order updates</p>
                      </div>
                      <input type="checkbox" defaultChecked className="w-4 h-4 accent-primary" />
                    </div>
                    <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                      <div>
                        <p className="font-semibold text-foreground">Newsletter</p>
                        <p className="text-sm text-muted-foreground">Get special offers</p>
                      </div>
                      <input type="checkbox" className="w-4 h-4 accent-primary" />
                    </div>
                  </div>
                </div>

                <div className="p-6 rounded-2xl border border-border bg-white">
                  <h3 className="text-lg font-bold text-foreground mb-4">Danger Zone</h3>
                  <Button
                    variant="destructive"
                    onClick={handleLogout}
                    className="flex items-center gap-2"
                  >
                    <LogOut size={16} />
                    Log Out
                  </Button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
