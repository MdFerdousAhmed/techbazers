'use client';

import React, { useState } from 'react';
import { ShoppingBag, User as UserIcon, LogOut, ShieldCheck, Package, Sparkles, Sun, Moon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { useTheme } from '../context/ThemeContext';

export default function Navbar({ onOpenAuth, onOpenOrders, onOpenAdmin, activeView, setActiveView }) {
  const { user, isAuthenticated, isAdmin, logout, loginAsAdmin, loginAsCustomer } = useAuth();
  const { totalItemsCount, setIsCartOpen } = useCart();
  const { addToast } = useToast();
  const { isDark, toggleTheme } = useTheme();
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const handleQuickAdmin = async () => {
    try {
      await loginAsAdmin();
      addToast('Logged in as Administrator (admin@techbazer.com)', 'success');
      setActiveView('admin');
    } catch (e) {
      addToast('Failed to switch to admin', 'error');
    }
  };

  const handleQuickCustomer = async () => {
    try {
      await loginAsCustomer();
      addToast('Logged in as Customer (customer@techbazer.com)', 'success');
      setActiveView('store');
    } catch (e) {
      addToast('Failed to switch to customer', 'error');
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/85 dark:bg-zinc-950/85 border-b border-zinc-200 dark:border-zinc-800 transition-colors">
      {/* Top Demo Bar */}
      <div className="bg-gradient-to-r from-indigo-900 via-purple-900 to-zinc-900 text-zinc-100 text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="bg-indigo-500/30 text-indigo-300 font-semibold px-2 py-0.5 rounded text-[10px] tracking-wide border border-indigo-400/30">
              TechBazer Platform
            </span>
            <span className="hidden sm:inline text-zinc-300">
              Next-Gen E-Commerce with persistent database storage & REST APIs
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-zinc-400 text-[11px] hidden md:inline">Quick Test:</span>
            <button
              onClick={handleQuickAdmin}
              className="text-[11px] bg-indigo-600/60 hover:bg-indigo-600 text-white px-2.5 py-0.5 rounded-full border border-indigo-400/30 transition flex items-center gap-1 cursor-pointer"
            >
              <ShieldCheck className="w-3 h-3 text-indigo-200" />
              Demo Admin
            </button>
            <button
              onClick={handleQuickCustomer}
              className="text-[11px] bg-purple-600/60 hover:bg-purple-600 text-white px-2.5 py-0.5 rounded-full border border-purple-400/30 transition flex items-center gap-1 cursor-pointer"
            >
              <Sparkles className="w-3 h-3 text-purple-200" />
              Demo Customer
            </button>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo & Navigation */}
          <div className="flex items-center gap-6">
            <button
              onClick={() => setActiveView('store')}
              className="flex items-center gap-2.5 text-left group cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-400 dark:via-purple-300 dark:to-pink-400 bg-clip-text text-transparent">
                  TechBazer
                </span>
                <span className="block text-[10px] uppercase font-bold tracking-widest text-indigo-600 dark:text-indigo-400 -mt-1">
                  Tech & Gadgets Superstore
                </span>
              </div>
            </button>

            {/* Navigation Tabs */}
            <nav className="hidden md:flex items-center gap-1">
              <button
                onClick={() => setActiveView('store')}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition cursor-pointer ${
                  activeView === 'store'
                    ? 'bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-white'
                    : 'text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white'
                }`}
              >
                Storefront
              </button>

              {isAdmin && (
                <button
                  onClick={() => setActiveView('admin')}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition flex items-center gap-1.5 cursor-pointer ${
                    activeView === 'admin'
                      ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800'
                      : 'text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50/50'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4" />
                  Admin Dashboard
                </button>
              )}
            </nav>
          </div>

          {/* Right Action Icons */}
          <div className="flex items-center gap-3">
            {/* My Orders button for logged in user */}
            {isAuthenticated && (
              <button
                onClick={onOpenOrders}
                className="hidden sm:flex items-center gap-1.5 text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white px-3 py-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition cursor-pointer"
              >
                <Package className="w-4 h-4 text-zinc-500" />
                <span>My Orders</span>
              </button>
            )}

            {/* User Dropdown / Auth Button */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition cursor-pointer border border-zinc-200 dark:border-zinc-700"
                >
                  <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 font-bold flex items-center justify-center text-xs">
                    {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <span className="hidden lg:inline text-xs font-semibold text-zinc-800 dark:text-zinc-200 max-w-[120px] truncate pr-1">
                    {user?.name}
                  </span>
                </button>

                {userMenuOpen && (
                  <div
                    className="absolute right-0 mt-2 w-56 bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-800 py-2 z-50 animate-in fade-in zoom-in-95 duration-150"
                    onMouseLeave={() => setUserMenuOpen(false)}
                  >
                    <div className="px-4 py-2.5 border-b border-zinc-100 dark:border-zinc-800">
                      <p className="text-sm font-bold text-zinc-900 dark:text-white truncate">{user?.name}</p>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate">{user?.email}</p>
                      <span className="inline-block mt-1 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400">
                        {user?.role}
                      </span>
                    </div>

                    {isAdmin && (
                      <button
                        onClick={() => {
                          setActiveView('admin');
                          setUserMenuOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 flex items-center gap-2 transition cursor-pointer"
                      >
                        <ShieldCheck className="w-4 h-4" />
                        Admin Dashboard
                      </button>
                    )}

                    <button
                      onClick={() => {
                        onOpenOrders();
                        setUserMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center gap-2 transition cursor-pointer"
                    >
                      <Package className="w-4 h-4 text-zinc-500" />
                      My Orders
                    </button>

                    <div className="border-t border-zinc-100 dark:border-zinc-800 my-1"></div>

                    <button
                      onClick={() => {
                        logout();
                        setUserMenuOpen(false);
                        addToast('Logged out successfully', 'info');
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 flex items-center gap-2 transition cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="flex items-center gap-1.5 text-sm font-semibold bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200 px-4 py-2 rounded-xl shadow-sm transition cursor-pointer"
              >
                <UserIcon className="w-4 h-4" />
                <span>Sign In</span>
              </button>
            )}

            {/* Theme Toggle Button (Dark / Light Mode) */}
            <button
              id="theme-toggle-btn"
              onClick={toggleTheme}
              className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-200 transition-all cursor-pointer shadow-sm active:scale-95"
              aria-label={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
              title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {isDark ? (
                <Sun className="w-5 h-5 text-amber-400 hover:rotate-90 transition-transform duration-300" />
              ) : (
                <Moon className="w-5 h-5 text-indigo-600 hover:-rotate-12 transition-transform duration-300" />
              )}
            </button>

            {/* Cart Trigger Button */}
            <button
              id="cart-button"
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-900 dark:text-white transition cursor-pointer shadow-sm"
              aria-label="Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {totalItemsCount > 0 && (
                <span
                  id="cart-badge-count"
                  className="absolute -top-1.5 -right-1.5 bg-indigo-600 text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-md animate-scale"
                >
                  {totalItemsCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
