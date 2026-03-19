'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import {
  createProduct,
  deleteProduct,
  getAdminProducts,
  getOrders,
  updateOrderStatus,
  updateProduct,
} from '@/lib/api';
import type { Order, Product } from '@/lib/types';
import { formatPrice } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import Loader from '@/components/shared/Loader';
import { toast } from 'sonner';

const initialProductForm = {
  name: '',
  price: '',
  description: '',
  category: 'general',
  image: '',
};

export default function AdminPage() {
  const router = useRouter();
  const { isAuthenticated, isAdmin } = useAuth();

  const [loading, setLoading] = useState(true);
  const [savingProduct, setSavingProduct] = useState(false);
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);
  const [deletingProductId, setDeletingProductId] = useState<string | null>(null);

  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);

  const [productForm, setProductForm] = useState(initialProductForm);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }

    if (!isAdmin()) {
      router.push('/');
      return;
    }

    const loadAdminData = async () => {
      setLoading(true);
      try {
        const [allProducts, allOrders] = await Promise.all([getAdminProducts(), getOrders()]);
        setProducts(allProducts);
        setOrders(allOrders);
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Failed to load admin data';
        toast.error(message);
      } finally {
        setLoading(false);
      }
    };

    loadAdminData();
  }, [isAuthenticated, isAdmin, router]);

  const totalOrders = orders.length;
  const totalRevenue = useMemo(() => orders.reduce((sum, order) => sum + order.total, 0), [orders]);

  const resetProductForm = () => {
    setProductForm(initialProductForm);
    setEditingProductId(null);
  };

  const handleSubmitProduct = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!productForm.name.trim() || !productForm.price || !productForm.description.trim()) {
      toast.error('Please fill name, price, and description');
      return;
    }

    const parsedPrice = Number(productForm.price);
    if (Number.isNaN(parsedPrice) || parsedPrice <= 0) {
      toast.error('Please enter a valid price');
      return;
    }

    setSavingProduct(true);
    try {
      const payload: Partial<Product> = {
        name: productForm.name.trim(),
        price: parsedPrice,
        description: productForm.description.trim(),
        category: productForm.category as Product['category'],
        images: productForm.image.trim() ? [productForm.image.trim()] : [],
        stock: 100,
      };

      if (editingProductId) {
        const updated = await updateProduct(editingProductId, payload);
        setProducts((prev) => prev.map((product) => (product.id === editingProductId ? updated : product)));
        toast.success('Product updated');
      } else {
        const created = await createProduct(payload);
        setProducts((prev) => [created, ...prev]);
        toast.success('Product created');
      }

      resetProductForm();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to save product';
      toast.error(message);
    } finally {
      setSavingProduct(false);
    }
  };

  const handleEditProduct = (product: Product) => {
    setEditingProductId(product.id);
    setProductForm({
      name: product.name,
      price: String(product.price),
      description: product.description,
      category: product.category,
      image: product.images?.[0] || product.image || '',
    });
  };

  const handleDeleteProduct = async (productId: string) => {
    setDeletingProductId(productId);
    try {
      await deleteProduct(productId);
      setProducts((prev) => prev.filter((product) => product.id !== productId));
      toast.success('Product deleted');
      if (editingProductId === productId) {
        resetProductForm();
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to delete product';
      toast.error(message);
    } finally {
      setDeletingProductId(null);
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, status: string) => {
    setUpdatingOrderId(orderId);
    try {
      const updated = await updateOrderStatus(orderId, status);
      setOrders((prev) => prev.map((order) => (order.id === orderId ? updated : order)));
      toast.success(`Order updated to ${status}`);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to update order status';
      toast.error(message);
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const statusOptions = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];

  if (!isAuthenticated || !isAdmin()) {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Loader label="Loading admin panel..." className="py-24" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div>
          <h1 className="text-4xl font-bold text-foreground">Admin Panel</h1>
          <p className="mt-2 text-muted-foreground">Manage products, orders, and operations.</p>
        </div>

        <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="rounded-2xl border border-border bg-white p-6">
            <p className="text-sm text-muted-foreground">Total Orders</p>
            <p className="text-3xl font-bold text-foreground mt-2">{totalOrders}</p>
          </div>
          <div className="rounded-2xl border border-border bg-white p-6">
            <p className="text-sm text-muted-foreground">Total Revenue</p>
            <p className="text-3xl font-bold text-foreground mt-2">{formatPrice(totalRevenue)}</p>
          </div>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="rounded-2xl border border-border bg-white p-6">
            <h2 className="text-2xl font-bold text-foreground mb-5">
              {editingProductId ? 'Edit Product' : 'Add Product'}
            </h2>

            <form onSubmit={handleSubmitProduct} className="space-y-4">
              <input
                value={productForm.name}
                onChange={(e) => setProductForm((prev) => ({ ...prev, name: e.target.value }))}
                className="w-full rounded-lg border border-border px-3 py-2"
                placeholder="Product name"
              />
              <input
                value={productForm.price}
                onChange={(e) => setProductForm((prev) => ({ ...prev, price: e.target.value }))}
                className="w-full rounded-lg border border-border px-3 py-2"
                placeholder="Price"
                type="number"
                min="1"
              />
              <textarea
                value={productForm.description}
                onChange={(e) => setProductForm((prev) => ({ ...prev, description: e.target.value }))}
                className="w-full rounded-lg border border-border px-3 py-2"
                placeholder="Description"
                rows={4}
              />
              <select
                value={productForm.category}
                onChange={(e) => setProductForm((prev) => ({ ...prev, category: e.target.value }))}
                className="w-full rounded-lg border border-border px-3 py-2"
              >
                <option value="general">General</option>
                <option value="girlfriend">Girlfriend</option>
                <option value="kids">Kids</option>
                <option value="friends">Friends</option>
                <option value="family">Family</option>
              </select>
              <input
                value={productForm.image}
                onChange={(e) => setProductForm((prev) => ({ ...prev, image: e.target.value }))}
                className="w-full rounded-lg border border-border px-3 py-2"
                placeholder="Image URL"
              />

              <div className="flex gap-3">
                <Button type="submit" disabled={savingProduct} className="flex-1">
                  {savingProduct ? 'Saving...' : editingProductId ? 'Update Product' : 'Add Product'}
                </Button>
                {editingProductId && (
                  <Button type="button" variant="outline" onClick={resetProductForm}>
                    Cancel Edit
                  </Button>
                )}
              </div>
            </form>
          </div>

          <div className="rounded-2xl border border-border bg-white p-6">
            <h2 className="text-2xl font-bold text-foreground mb-5">Product List</h2>
            <div className="max-h-115 space-y-3 overflow-y-auto pr-1">
              {products.length === 0 ? (
                <p className="text-sm text-muted-foreground">No products found.</p>
              ) : (
                products.map((product) => (
                  <div key={product.id} className="rounded-lg border border-border p-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold text-foreground">{product.name}</p>
                        <p className="text-sm text-muted-foreground">{formatPrice(product.price)}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button type="button" size="sm" variant="outline" onClick={() => handleEditProduct(product)}>
                          Edit
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDeleteProduct(product.id)}
                          disabled={deletingProductId === product.id}
                        >
                          {deletingProductId === product.id ? 'Deleting...' : 'Delete'}
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-white p-6">
          <h2 className="text-2xl font-bold text-foreground mb-5">Orders Management</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="py-3 text-left font-semibold">Order</th>
                  <th className="py-3 text-left font-semibold">Customer</th>
                  <th className="py-3 text-left font-semibold">Amount</th>
                  <th className="py-3 text-left font-semibold">Status</th>
                  <th className="py-3 text-left font-semibold">Update</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="border-b border-border/70">
                    <td className="py-3 pr-3">#{order.id.slice(0, 10)}</td>
                    <td className="py-3 pr-3">{order.customerName}</td>
                    <td className="py-3 pr-3">{formatPrice(order.total)}</td>
                    <td className="py-3 pr-3 capitalize">{order.status}</td>
                    <td className="py-3 pr-3">
                      <select
                        value={order.status}
                        onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                        disabled={updatingOrderId === order.id}
                        className="rounded-lg border border-border px-2 py-1.5"
                      >
                        {statusOptions.map((status) => (
                          <option key={status} value={status}>
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}
