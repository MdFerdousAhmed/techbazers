'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Navbar from '../components/Navbar';
import HeroBanner from '../components/HeroBanner';
import ValueProps from '../components/ValueProps';
import StatsCounter from '../components/StatsCounter';
import FlashDeals from '../components/FlashDeals';
import CategoryShowcase from '../components/CategoryShowcase';
import Testimonials from '../components/Testimonials';
import NewsletterCTA from '../components/NewsletterCTA';
import ProductCard from '../components/ProductCard';
import ProductDetailModal from '../components/ProductDetailModal';
import CartDrawer from '../components/CartDrawer';
import AuthModal from '../components/AuthModal';
import CheckoutModal from '../components/CheckoutModal';
import MyOrdersModal from '../components/MyOrdersModal';
import AdminPortal from '../components/AdminPortal';
import { api } from '../services/api';
import { Search, SlidersHorizontal, ArrowUpDown, ChevronLeft, ChevronRight, Sparkles, Filter, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const getPaginationItems = (current, total) => {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }
  if (current <= 4) {
    return [1, 2, 3, 4, 5, '...', total];
  }
  if (current >= total - 3) {
    return [1, '...', total - 4, total - 3, total - 2, total - 1, total];
  }
  return [1, '...', current - 1, current, current + 1, '...', total];
};

export default function Home() {
  const { isAuthenticated, isAdmin } = useAuth();
  const { addToast } = useToast();

  // Navigation views: 'store' | 'admin'
  const [activeView, setActiveView] = useState('store');

  // Modals state
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [ordersModalOpen, setOrdersModalOpen] = useState(false);
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Catalog query states
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [sortOption, setSortOption] = useState('newest');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // Debounce search query
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1);
    }, 250);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Fetch categories on mount
  useEffect(() => {
    api.getCategories().then(res => {
      if (res.categories) {
        setCategories(['All', ...res.categories]);
      }
    }).catch(() => {
      setCategories(['All', 'Electronics', 'Accessories', 'Clothing', 'Footwear', 'Home & Living']);
    });
  }, []);

  // Fetch catalog products
  const fetchCatalog = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.getProducts({
        category: selectedCategory,
        search: debouncedSearch,
        minPrice,
        maxPrice,
        sort: sortOption,
        page: currentPage,
        limit: 12
      });

      if (res.products) {
        setProducts(res.products);
        setTotalPages(res.pages || 1);
        setTotalCount(res.total || res.products.length);
      }
    } catch (err) {
      console.error('Failed to load products', err);
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, debouncedSearch, minPrice, maxPrice, sortOption, currentPage]);

  useEffect(() => {
    fetchCatalog();
  }, [fetchCatalog]);

  const handleSelectCategory = (cat) => {
    setSelectedCategory(cat);
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setSelectedCategory('All');
    setSearchQuery('');
    setMinPrice('');
    setMaxPrice('');
    setSortOption('newest');
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 flex flex-col font-sans">
      {/* Top Navigation */}
      <Navbar
        onOpenAuth={() => setAuthModalOpen(true)}
        onOpenOrders={() => setOrdersModalOpen(true)}
        onOpenAdmin={() => setActiveView('admin')}
        activeView={activeView}
        setActiveView={setActiveView}
      />

      {/* Main Content Area */}
      {activeView === 'admin' ? (
        <AdminPortal
          onBackToStore={() => setActiveView('store')}
          onProductUpdated={fetchCatalog}
        />
      ) : (
        <main className="flex-1 w-full pb-16">
          {/* Hero Banner */}
          <HeroBanner onSelectCategory={handleSelectCategory} />

          {/* Value Propositions Strip */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ValueProps />
          </div>

          {/* Stats Counter Section – full width with inner max-w */}
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
              <StatsCounter />
            </div>
          </div>

          {/* Flash Deals Section – full bleed dark background */}
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
              <FlashDeals />
            </div>
          </div>

          {/* Category Showcase */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <CategoryShowcase onSelectCategory={handleSelectCategory} />
          </div>

          {/* Testimonials Section */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Testimonials />
          </div>

          {/* Newsletter CTA */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <NewsletterCTA />
          </div>

          {/* Catalog & Filter Section (FR-CAT-01 & FR-CAT-02 & TC-01) */}
          <section id="catalog-section" className="mt-8 space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Title & Filter Bar Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-white tracking-tight">
                  Product Catalog
                </h2>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                  Showing {products.length} of {totalCount} items
                  {selectedCategory !== 'All' && ` in "${selectedCategory}"`}
                  {debouncedSearch && ` matching "${debouncedSearch}"`}
                </p>
              </div>

              {/* Search Bar Input */}
              <div className="relative max-w-md w-full">
                <Search className="absolute left-3.5 top-3 w-4 h-4 text-zinc-400" />
                <input
                  id="catalog-search-input"
                  type="text"
                  placeholder="Search products by title or description..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-9 py-2.5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs sm:text-sm text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 shadow-xs"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-3 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Category Pills & Sorting Bar */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 py-2 border-y border-zinc-200/80 dark:border-zinc-800/80">
              {/* Category Pills (FR-CAT-02) */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => handleSelectCategory(cat)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                      selectedCategory === cat
                        ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 shadow-sm'
                        : 'bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 border border-zinc-200/80 dark:border-zinc-800'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Price Range & Sort Selectors */}
              <div className="flex flex-wrap items-center gap-2.5">
                {/* Min / Max Price Inputs */}
                <div className="flex items-center gap-1.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-2 py-1 shadow-xs">
                  <span className="text-[11px] text-zinc-400 font-semibold">$</span>
                  <input
                    type="number"
                    placeholder="Min"
                    value={minPrice}
                    onChange={(e) => { setMinPrice(e.target.value); setCurrentPage(1); }}
                    className="w-14 text-xs bg-transparent focus:outline-hidden text-zinc-900 dark:text-white"
                  />
                  <span className="text-zinc-400 text-xs">-</span>
                  <input
                    type="number"
                    placeholder="Max"
                    value={maxPrice}
                    onChange={(e) => { setMaxPrice(e.target.value); setCurrentPage(1); }}
                    className="w-14 text-xs bg-transparent focus:outline-hidden text-zinc-900 dark:text-white"
                  />
                </div>

                {/* Sort dropdown */}
                <div className="flex items-center gap-1.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3 py-1.5 shadow-xs">
                  <ArrowUpDown className="w-3.5 h-3.5 text-zinc-400" />
                  <select
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value)}
                    className="text-xs bg-transparent text-zinc-900 dark:text-white focus:outline-hidden font-semibold cursor-pointer"
                  >
                    <option value="newest">Newest First</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="rating">Highest Rated</option>
                  </select>
                </div>

                {(selectedCategory !== 'All' || searchQuery || minPrice || maxPrice) && (
                  <button
                    onClick={handleClearFilters}
                    className="text-xs font-semibold text-rose-500 hover:text-rose-600 px-2 py-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 transition cursor-pointer"
                  >
                    Reset Filters
                  </button>
                )}
              </div>
            </div>

            {/* Product Grid (FR-CAT-01, TC-01) */}
            {loading ? (
              <div className="py-24 text-center">
                <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-xs text-zinc-500 font-medium">Loading catalog products...</p>
              </div>
            ) : products.length === 0 ? (
              <div className="py-20 text-center bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 p-8">
                <Filter className="w-12 h-12 text-zinc-300 dark:text-zinc-700 mx-auto mb-3" />
                <h3 className="text-base font-bold text-zinc-900 dark:text-white">No products found</h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 max-w-sm mx-auto">
                  Try adjusting your category selection, price range, or search keyword.
                </p>
                <button
                  onClick={handleClearFilters}
                  className="mt-4 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-500 transition cursor-pointer"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div
                id="product-grid"
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
              >
                {products.map((product) => (
                  <ProductCard
                    key={product._id || product.id}
                    product={product}
                    onViewDetails={(prod) => setSelectedProduct(prod)}
                  />
                ))}
              </div>
            )}

            {/* Pagination Controls (FR-CAT-01) */}
            {totalPages > 1 && (
              <div className="pt-8 pb-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-zinc-200 dark:border-zinc-800">
                <div className="text-xs text-zinc-500 dark:text-zinc-400 font-medium order-2 sm:order-1">
                  Showing page <span className="font-bold text-zinc-900 dark:text-white">{currentPage}</span> of{' '}
                  <span className="font-bold text-zinc-900 dark:text-white">{totalPages}</span>{' '}
                  <span className="text-zinc-400">({totalCount} products)</span>
                </div>

                <div className="flex items-center gap-1.5 order-1 sm:order-2">
                  {/* Prev Button */}
                  <button
                    onClick={() => {
                      setCurrentPage(Math.max(1, currentPage - 1));
                      document.getElementById('catalog-section')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    disabled={currentPage === 1}
                    className="flex items-center gap-1 px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-30 disabled:cursor-not-allowed transition text-xs font-semibold shadow-xs cursor-pointer"
                    aria-label="Previous Page"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span className="hidden sm:inline">Prev</span>
                  </button>

                  {/* Page numbers with smart ellipsis */}
                  {getPaginationItems(currentPage, totalPages).map((item, idx) => {
                    if (item === '...') {
                      return (
                        <span
                          key={`ellipsis-${idx}`}
                          className="w-9 h-9 flex items-center justify-center text-xs text-zinc-400 dark:text-zinc-500 font-bold select-none"
                        >
                          …
                        </span>
                      );
                    }

                    const isCurrent = currentPage === item;
                    return (
                      <button
                        key={`page-${item}`}
                        onClick={() => {
                          setCurrentPage(item);
                          document.getElementById('catalog-section')?.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className={`w-9 h-9 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs ${
                          isCurrent
                            ? 'bg-indigo-600 text-white shadow-indigo-600/30 scale-105 ring-2 ring-indigo-500/20'
                            : 'bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                        }`}
                        aria-current={isCurrent ? 'page' : undefined}
                      >
                        {item}
                      </button>
                    );
                  })}

                  {/* Next Button */}
                  <button
                    onClick={() => {
                      setCurrentPage(Math.min(totalPages, currentPage + 1));
                      document.getElementById('catalog-section')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    disabled={currentPage === totalPages}
                    className="flex items-center gap-1 px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-30 disabled:cursor-not-allowed transition text-xs font-semibold shadow-xs cursor-pointer"
                    aria-label="Next Page"
                  >
                    <span className="hidden sm:inline">Next</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </section>
        </main>
      )}

      {/* Footer */}
      <footer className="mt-auto border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-xs text-zinc-500 dark:text-zinc-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 grid grid-cols-2 sm:grid-cols-4 gap-8">
          {/* Brand column */}
          <div className="col-span-2 sm:col-span-1">
            <span className="font-extrabold tracking-tight bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-400 dark:via-purple-300 dark:to-pink-400 bg-clip-text text-transparent text-base block mb-2">
              TechBazer
            </span>
            <p className="leading-relaxed text-[11px]">
              Your premium destination for next-generation tech hardware. Authentic products, expert curation, lightning delivery.
            </p>
            <div className="flex gap-2.5 mt-4">
              {['Twitter/X', 'Instagram', 'YouTube', 'Discord'].map((s) => (
                <span
                  key={s}
                  title={s}
                  className="w-7 h-7 rounded-lg bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center text-[10px] font-bold hover:bg-indigo-600 hover:text-white transition-all cursor-pointer"
                >
                  {s[0]}
                </span>
              ))}
            </div>
          </div>

          {/* Shop column */}
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-3 text-[11px] uppercase tracking-widest">Shop</h5>
            <ul className="space-y-2">
              {[
                'Smartphones & Tablets',
                'Laptops & Computers',
                'Audio & Sound',
                'Gaming Gear',
                'Wearables',
                'Smart Home & Tech',
                'Cameras & Drones',
                'Storage & Accessories'
              ].map((c) => (
                <li key={c}>
                  <button
                    onClick={() => handleSelectCategory(c)}
                    className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors text-left cursor-pointer"
                  >
                    {c}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Support column */}
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-3 text-[11px] uppercase tracking-widest">Support</h5>
            <ul className="space-y-2">
              {[
                'Help Center',
                'Track Your Order',
                'Returns & Refunds',
                'Warranty Claims',
                'Contact Us',
                'Tech Support Chat',
                'Community Forum',
                'Bulk / B2B Orders'
              ].map((l) => (
                <li key={l}>
                  <span className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer">
                    {l}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Company column */}
          <div>
            <h5 className="font-bold text-zinc-900 dark:text-zinc-100 mb-3 text-[11px] uppercase tracking-widest">Company</h5>
            <ul className="space-y-2">
              {[
                'About TechBazer',
                'Press & Media',
                'Affiliate Program',
                'Sustainability',
                'Careers',
                'Privacy Policy',
                'Terms of Service',
                'Cookie Preferences'
              ].map((l) => (
                <li key={l}>
                  <span className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer">
                    {l}
                  </span>
                </li>
              ))}
            </ul>
            <div className="mt-5 space-y-1.5 text-[11px]">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                REST API: Port 5000
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 inline-block" />
                Next.js: Port 3000
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-500 inline-block" />
                MongoDB Atlas Connected
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-zinc-200 dark:border-zinc-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px]">
            <span>© {new Date().getFullYear()} TechBazer. All rights reserved. Powered by MongoDB Atlas.</span>
            <span className="text-emerald-500 font-semibold">● Production Ready — 112+ Products Live</span>
          </div>
        </div>
      </footer>

      {/* Modals & Overlays */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />

      <CartDrawer
        onOpenCheckout={() => setCheckoutModalOpen(true)}
        onOpenAuth={() => setAuthModalOpen(true)}
      />

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />

      <CheckoutModal
        isOpen={checkoutModalOpen}
        onClose={() => setCheckoutModalOpen(false)}
        onViewOrders={() => setOrdersModalOpen(true)}
      />

      <MyOrdersModal
        isOpen={ordersModalOpen}
        onClose={() => setOrdersModalOpen(false)}
      />
    </div>
  );
}
