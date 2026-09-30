'use client';

import React, { useState, useEffect } from 'react';
import {
  DollarSign,
  Package,
  Users,
  CheckCircle,
  Plus,
  Edit2,
  Trash2,
  Power,
  RotateCcw,
  Clock,
  Eye,
  ArrowUpRight
} from 'lucide-react';
import { api } from '../services/api';
import { useToast } from '../context/ToastContext';

export default function AdminPortal({ onBackToStore, onProductUpdated }) {
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'products' | 'orders'
  const [analytics, setAnalytics] = useState(null);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Product modal state
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    title: '',
    description: '',
    price: '',
    category: 'Electronics',
    image: '',
    stock: 10,
    isActive: true,
  });

  const { addToast } = useToast();

  useEffect(() => {
    loadAllAdminData();
  }, []);

  const loadAllAdminData = async () => {
    setLoading(true);
    try {
      const [analyticsRes, productsRes, ordersRes] = await Promise.all([
        api.getAdminAnalytics().catch(() => ({ analytics: null })),
        api.getProducts({ limit: 100, includeInactive: true }).catch(() => ({ products: [] })),
        api.getAdminOrders().catch(() => ({ orders: [] }))
      ]);

      if (analyticsRes.analytics) setAnalytics(analyticsRes.analytics);
      if (productsRes.products) setProducts(productsRes.products);
      if (ordersRes.orders) setOrders(ordersRes.orders);
    } catch (err) {
      addToast('Error loading admin records', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAddProduct = () => {
    setEditingProduct(null);
    setProductForm({
      title: '',
      description: '',
      price: '',
      category: 'Electronics',
      image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800',
      stock: 15,
      isActive: true,
    });
    setProductModalOpen(true);
  };

  const handleOpenEditProduct = (prod) => {
    setEditingProduct(prod);
    setProductForm({
      title: prod.title,
      description: prod.description,
      price: prod.price,
      category: prod.category,
      image: prod.image,
      stock: prod.stock,
      isActive: prod.isActive !== false,
    });
    setProductModalOpen(true);
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        // Edit existing
        const pId = editingProduct._id || editingProduct.id;
        await api.updateProduct(pId, productForm);
        addToast(`Product "${productForm.title}" updated`, 'success');
      } else {
        // Create new (TC-04)
        await api.createProduct(productForm);
        addToast(`Product "${productForm.title}" created successfully!`, 'success');
      }
      setProductModalOpen(false);
      loadAllAdminData();
      if (onProductUpdated) onProductUpdated();
    } catch (err) {
      addToast(err.message || 'Error saving product', 'error');
    }
  };

  const handleDeleteProduct = async (id, title) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;
    try {
      await api.deleteProduct(id);
      addToast(`Product "${title}" deleted`, 'success');
      loadAllAdminData();
      if (onProductUpdated) onProductUpdated();
    } catch (err) {
      addToast(err.message || 'Failed to delete product', 'error');
    }
  };

  const handleToggleProductStatus = async (prod) => {
    const pId = prod._id || prod.id;
    const newStatus = !prod.isActive;
    try {
      await api.updateProduct(pId, { isActive: newStatus });
      addToast(`Product ${newStatus ? 'activated' : 'deactivated'}`, 'info');
      loadAllAdminData();
      if (onProductUpdated) onProductUpdated();
    } catch (err) {
      addToast(err.message || 'Failed to toggle status', 'error');
    }
  };

  const handleUpdateOrderStatus = async (orderId, status) => {
    try {
      await api.updateAdminOrderStatus(orderId, status);
      addToast(`Order ${orderId} status set to ${status}`, 'success');
      loadAllAdminData();
    } catch (err) {
      addToast(err.message || 'Failed to update order status', 'error');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-200">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
            TechBazer Admin Control Center
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-white">
            System Management Portal
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            Manage inventory listings, track customer orders, and inspect system telemetry.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadAllAdminData}
            className="p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-300 transition cursor-pointer"
            title="Refresh records"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            onClick={onBackToStore}
            className="px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200 font-semibold text-xs shadow-xs transition cursor-pointer flex items-center gap-1.5"
          >
            <Eye className="w-4 h-4" />
            <span>Return to Storefront</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-zinc-200 dark:border-zinc-800">
        {[
          { id: 'overview', label: 'Analytics & Overview' },
          { id: 'products', label: `Products (${products.length})` },
          { id: 'orders', label: `Orders (${orders.length})` }
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`pb-3 px-3 text-sm font-bold border-b-2 transition cursor-pointer ${
              activeTab === t.id
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-zinc-500 hover:text-zinc-900 dark:hover:text-white'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* OVERVIEW TAB */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Key Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-xs">
              <div className="flex items-center justify-between text-zinc-400 mb-2">
                <span className="text-xs font-semibold">Total Revenue</span>
                <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <DollarSign className="w-4 h-4" />
                </div>
              </div>
              <p className="text-2xl font-black text-zinc-900 dark:text-white">
                ${analytics ? Number(analytics.totalRevenue).toFixed(2) : '0.00'}
              </p>
              <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                Live transactional volume
              </span>
            </div>

            <div className="p-5 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-xs">
              <div className="flex items-center justify-between text-zinc-400 mb-2">
                <span className="text-xs font-semibold">Customer Orders</span>
                <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                  <Package className="w-4 h-4" />
                </div>
              </div>
              <p className="text-2xl font-black text-zinc-900 dark:text-white">
                {analytics?.totalOrders || orders.length || 0}
              </p>
              <span className="text-[11px] text-indigo-500 font-medium">
                {analytics?.statusCounts?.Pending || 0} pending fulfillment
              </span>
            </div>

            <div className="p-5 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-xs">
              <div className="flex items-center justify-between text-zinc-400 mb-2">
                <span className="text-xs font-semibold">Catalog Items</span>
                <div className="w-8 h-8 rounded-xl bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                  <CheckCircle className="w-4 h-4" />
                </div>
              </div>
              <p className="text-2xl font-black text-zinc-900 dark:text-white">
                {products.length}
              </p>
              <span className="text-[11px] text-purple-500 font-medium">
                {products.filter(p => p.isActive !== false).length} active products
              </span>
            </div>

            <div className="p-5 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-xs">
              <div className="flex items-center justify-between text-zinc-400 mb-2">
                <span className="text-xs font-semibold">Registered Users</span>
                <div className="w-8 h-8 rounded-xl bg-sky-50 dark:bg-sky-950 text-sky-600 dark:text-sky-400 flex items-center justify-center">
                  <Users className="w-4 h-4" />
                </div>
              </div>
              <p className="text-2xl font-black text-zinc-900 dark:text-white">
                {analytics?.totalUsers || 2}
              </p>
              <span className="text-[11px] text-sky-500 font-medium">
                Customers & Admins in DB
              </span>
            </div>
          </div>

          {/* Quick Order Status Distribution */}
          <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800">
            <h3 className="text-sm font-bold text-zinc-900 dark:text-white mb-4">
              Order Fulfillment Lifecycle Status
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center">
              {[
                { status: 'Pending', count: analytics?.statusCounts?.Pending || 0, color: 'text-amber-500' },
                { status: 'Processing', count: analytics?.statusCounts?.Processing || 0, color: 'text-blue-500' },
                { status: 'Shipped', count: analytics?.statusCounts?.Shipped || 0, color: 'text-purple-500' },
                { status: 'Delivered', count: analytics?.statusCounts?.Delivered || 0, color: 'text-emerald-500' },
                { status: 'Cancelled', count: analytics?.statusCounts?.Cancelled || 0, color: 'text-rose-500' }
              ].map(st => (
                <div key={st.status} className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200/50 dark:border-zinc-800">
                  <span className="text-xs font-semibold text-zinc-400 block">{st.status}</span>
                  <span className={`text-xl font-black ${st.color}`}>{st.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* PRODUCTS TAB (TC-04 Admin Control) */}
      {activeTab === 'products' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-zinc-900 dark:text-white">Product Inventory Catalog</h2>
            <button
              id="admin-add-product-btn"
              onClick={handleOpenAddProduct}
              className="px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-600/20 flex items-center gap-1.5 cursor-pointer transition"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Product</span>
            </button>
          </div>

          <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200/80 dark:border-zinc-800 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-zinc-50 dark:bg-zinc-800/50 border-b border-zinc-200 dark:border-zinc-800 text-zinc-500 font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3.5 px-4">Item</th>
                    <th className="py-3.5 px-4">Category</th>
                    <th className="py-3.5 px-4">Price</th>
                    <th className="py-3.5 px-4">Stock</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800 text-zinc-800 dark:text-zinc-200">
                  {products.map(prod => (
                    <tr key={prod._id || prod.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30 transition">
                      <td className="py-3 px-4 flex items-center gap-3">
                        <img
                          src={prod.image}
                          alt={prod.title}
                          className="w-10 h-10 rounded-xl object-cover bg-zinc-100 shrink-0"
                        />
                        <div className="max-w-xs">
                          <p className="font-bold truncate text-zinc-900 dark:text-white">{prod.title}</p>
                          <p className="text-[11px] text-zinc-400 truncate">{prod.description}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-semibold text-zinc-500">
                        {prod.category}
                      </td>
                      <td className="py-3 px-4 font-black text-zinc-900 dark:text-white">
                        ${Number(prod.price).toFixed(2)}
                      </td>
                      <td className="py-3 px-4 font-semibold">
                        {prod.stock} units
                      </td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => handleToggleProductStatus(prod)}
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider cursor-pointer transition ${
                            prod.isActive !== false
                              ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300'
                              : 'bg-zinc-200 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400'
                          }`}
                        >
                          {prod.isActive !== false ? 'Active' : 'Inactive'}
                        </button>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenEditProduct(prod)}
                            className="p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 hover:text-indigo-600 transition cursor-pointer"
                            title="Edit Product"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(prod._id || prod.id, prod.title)}
                            className="p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 hover:text-rose-600 transition cursor-pointer"
                            title="Delete Product"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ORDERS TAB (FR-ADM-02 Order Tracking) */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-zinc-900 dark:text-white">All Customer Orders & Status Updates</h2>
          <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200/80 dark:border-zinc-800 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-zinc-50 dark:bg-zinc-800/50 border-b border-zinc-200 dark:border-zinc-800 text-zinc-500 font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3.5 px-4">Order ID & Date</th>
                    <th className="py-3.5 px-4">Customer</th>
                    <th className="py-3.5 px-4">Items</th>
                    <th className="py-3.5 px-4">Total</th>
                    <th className="py-3.5 px-4">Current Status</th>
                    <th className="py-3.5 px-4 text-right">Change Status (FR-ADM-02)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800 text-zinc-800 dark:text-zinc-200">
                  {orders.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="py-8 text-center text-zinc-400">
                        No orders have been submitted yet.
                      </td>
                    </tr>
                  ) : (
                    orders.map(order => (
                      <tr key={order._id || order.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30 transition">
                        <td className="py-3 px-4">
                          <p className="font-mono font-bold text-zinc-900 dark:text-white truncate">
                            {order._id || order.id}
                          </p>
                          <span className="text-[11px] text-zinc-400">
                            {new Date(order.createdAt).toLocaleString()}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <p className="font-bold text-zinc-900 dark:text-white">
                            {order.shippingAddress?.fullName || (order.user?.name || 'Customer')}
                          </p>
                          <span className="text-[11px] text-zinc-400">
                            {order.shippingAddress?.city}, {order.shippingAddress?.country}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-medium text-zinc-700 dark:text-zinc-300">
                            {order.items?.length || 0} items
                          </span>
                        </td>
                        <td className="py-3 px-4 font-black text-indigo-600 dark:text-indigo-400">
                          ${Number(order.totalAmount).toFixed(2)}
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            order.status === 'Pending' ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300' :
                            order.status === 'Processing' ? 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300' :
                            order.status === 'Shipped' ? 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300' :
                            order.status === 'Delivered' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' :
                            'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                          }`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <select
                            value={order.status}
                            onChange={(e) => handleUpdateOrderStatus(order._id || order.id, e.target.value)}
                            className="text-xs bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-2.5 py-1.5 text-zinc-900 dark:text-white focus:ring-2 focus:ring-indigo-500 font-semibold cursor-pointer"
                          >
                            <option value="Pending">Pending</option>
                            <option value="Processing">Processing</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* CREATE / EDIT PRODUCT MODAL (FR-ADM-01 & TC-04) */}
      {productModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl border border-zinc-200 dark:border-zinc-800 p-6 sm:p-8 overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-100 dark:border-zinc-800 mb-4">
              <h3 className="text-xl font-black text-zinc-900 dark:text-white">
                {editingProduct ? 'Edit Product Listing' : 'Create New Product Record (TC-04)'}
              </h3>
              <button
                onClick={() => setProductModalOpen(false)}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                  Product Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Aura Pro Earbuds"
                  value={productForm.title}
                  onChange={(e) => setProductForm({ ...productForm, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white text-sm"
                />
              </div>

              <div>
                <label className="block font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                  Description *
                </label>
                <textarea
                  required
                  rows="3"
                  placeholder="Detailed description of features and specs..."
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white text-sm"
                ></textarea>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                    Price ($ USD) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    placeholder="79.99"
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white text-sm"
                  />
                </div>

                <div>
                  <label className="block font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                    Category *
                  </label>
                  <select
                    value={productForm.category}
                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white text-sm"
                  >
                    <option value="Electronics">Electronics</option>
                    <option value="Accessories">Accessories</option>
                    <option value="Clothing">Clothing</option>
                    <option value="Footwear">Footwear</option>
                    <option value="Home & Living">Home & Living</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                    Stock Quantity *
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={productForm.stock}
                    onChange={(e) => setProductForm({ ...productForm, stock: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white text-sm"
                  />
                </div>

                <div className="flex items-center pt-5">
                  <label className="flex items-center gap-2 cursor-pointer font-bold text-zinc-700 dark:text-zinc-300">
                    <input
                      type="checkbox"
                      checked={productForm.isActive}
                      onChange={(e) => setProductForm({ ...productForm, isActive: e.target.checked })}
                      className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
                    />
                    <span>Active in Public Catalog</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                  Product Image URL *
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://images.unsplash.com/..."
                  value={productForm.image}
                  onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white text-sm"
                />
              </div>

              {productForm.image && (
                <div className="p-2 border border-zinc-200 dark:border-zinc-700 rounded-xl bg-zinc-50 dark:bg-zinc-800 flex items-center gap-3">
                  <img
                    src={productForm.image}
                    alt="Preview"
                    className="w-12 h-12 rounded-lg object-cover"
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                  <span className="text-zinc-400 text-[11px]">Image preview ready</span>
                </div>
              )}

              <button
                type="submit"
                id="admin-save-product-submit"
                className="w-full mt-4 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-xl shadow-indigo-600/25 flex items-center justify-center gap-2 cursor-pointer transition"
              >
                <span>{editingProduct ? 'Save Product Changes' : 'Create Product Record'}</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
