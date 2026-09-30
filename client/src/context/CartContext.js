'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  // Load initial cart from localStorage
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('auspify_cart_items');
      if (savedCart) {
        setCartItems(JSON.parse(savedCart));
      }
    } catch (e) {
      console.error('Failed to load cart from localStorage', e);
    }
  }, []);

  // Save to localStorage whenever cartItems changes
  useEffect(() => {
    try {
      localStorage.setItem('auspify_cart_items', JSON.stringify(cartItems));
    } catch (e) {
      console.error('Failed to save cart to localStorage', e);
    }
  }, [cartItems]);

  // Synchronize cart with server
  const syncServerCart = useCallback(async () => {
    try {
      setIsSyncing(true);
      const res = await api.getCart();
      if (res.cart && Array.isArray(res.cart.items)) {
        // If server has items, we harmonize
        if (res.cart.items.length > 0) {
          const formatted = res.cart.items.map(item => ({
            productId: item.productId || (item.product ? (item.product._id || item.product) : null),
            title: item.title,
            price: Number(item.price),
            image: item.image,
            category: item.category || 'Product',
            quantity: Number(item.quantity)
          }));
          setCartItems(formatted);
        }
      }
    } catch (err) {
      // Offline or network error - local items remain
    } finally {
      setIsSyncing(false);
    }
  }, []);

  // Sync on mount or when user logs in/out
  useEffect(() => {
    syncServerCart();
  }, [user, syncServerCart]);

  const addToCart = async (product, quantity = 1) => {
    const pId = product._id || product.id;
    const qty = parseInt(quantity, 10) || 1;

    setCartItems(prev => {
      const existingIndex = prev.findIndex(item => item.productId === pId);
      if (existingIndex > -1) {
        const next = [...prev];
        next[existingIndex] = {
          ...next[existingIndex],
          quantity: next[existingIndex].quantity + qty
        };
        return next;
      } else {
        return [
          ...prev,
          {
            productId: pId,
            title: product.title,
            price: Number(product.price),
            image: product.image,
            category: product.category,
            quantity: qty
          }
        ];
      }
    });

    // Notify backend
    try {
      await api.addToCart(pId, qty);
    } catch (e) {
      // Backend sync error silently handled by local state
    }
  };

  const updateQuantity = async (productId, newQuantity) => {
    const qty = parseInt(newQuantity, 10);
    if (qty <= 0) {
      return removeFromCart(productId);
    }

    setCartItems(prev =>
      prev.map(item => (item.productId === productId ? { ...item, quantity: qty } : item))
    );

    try {
      await api.updateCartQuantity(productId, qty);
    } catch (e) {
      // Handled locally
    }
  };

  const removeFromCart = async (productId) => {
    setCartItems(prev => prev.filter(item => item.productId !== productId));
    try {
      await api.removeFromCart(productId);
    } catch (e) {
      // Handled locally
    }
  };

  const clearCart = async () => {
    setCartItems([]);
    try {
      localStorage.removeItem('auspify_cart_items');
      await api.clearCart();
    } catch (e) {
      // Handled locally
    }
  };

  // Calculations
  const subtotal = Number(
    cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0).toFixed(2)
  );
  const tax = Number((subtotal * 0.08).toFixed(2));
  const shipping = subtotal > 100 || cartItems.length === 0 ? 0 : 9.99;
  const total = Number((subtotal + tax + shipping).toFixed(2));
  const totalItemsCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        isCartOpen,
        setIsCartOpen,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        subtotal,
        tax,
        shipping,
        total,
        totalItemsCount,
        isSyncing,
        syncServerCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
