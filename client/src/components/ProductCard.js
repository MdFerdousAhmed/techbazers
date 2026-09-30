'use client';

import React, { useState } from 'react';
import { ShoppingBag, Star, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';

export default function ProductCard({ product, onViewDetails }) {
  const { addToCart } = useCart();
  const { addToast } = useToast();
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (product.stock <= 0) {
      addToast('Sorry, this product is currently out of stock', 'error');
      return;
    }

    setIsAdding(true);
    addToCart(product, 1);
    addToast(`Added "${product.title}" to cart!`, 'success');

    setTimeout(() => {
      setIsAdding(false);
    }, 1200);
  };

  const isLowStock = product.stock > 0 && product.stock <= 5;
  const isOutOfStock = product.stock <= 0;

  return (
    <div
      onClick={() => onViewDetails(product)}
      className="group relative bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200/80 dark:border-zinc-800/80 p-4 transition-all duration-300 hover:shadow-2xl hover:border-indigo-500/40 hover:-translate-y-1 flex flex-col justify-between cursor-pointer"
    >
      <div>
        {/* Product Image Container */}
        <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-zinc-100 dark:bg-zinc-800/50 mb-4">
          <img
            src={product.image}
            alt={product.title}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />

          {/* Category Tag */}
          <div className="absolute top-3 left-3">
            <span className="px-2.5 py-1 rounded-full bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md text-[11px] font-bold uppercase tracking-wider text-zinc-800 dark:text-zinc-200 border border-zinc-200/50 dark:border-zinc-700/50 shadow-sm">
              {product.category}
            </span>
          </div>

          {/* Stock Tag */}
          <div className="absolute top-3 right-3">
            {isOutOfStock ? (
              <span className="px-2.5 py-1 rounded-full bg-rose-500/90 text-white backdrop-blur-md text-[11px] font-semibold">
                Out of Stock
              </span>
            ) : isLowStock ? (
              <span className="px-2.5 py-1 rounded-full bg-amber-500/90 text-white backdrop-blur-md text-[11px] font-semibold">
                Only {product.stock} left
              </span>
            ) : (
              <span className="px-2.5 py-1 rounded-full bg-emerald-500/90 text-white backdrop-blur-md text-[11px] font-semibold">
                In Stock
              </span>
            )}
          </div>
        </div>

        {/* Rating and Reviews */}
        <div className="flex items-center gap-1.5 mb-2">
          <div className="flex items-center text-amber-400">
            <Star className="w-3.5 h-3.5 fill-current" />
          </div>
          <span className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">
            {product.rating || 4.8}
          </span>
          <span className="text-xs text-zinc-400">
            ({product.reviewsCount || 12})
          </span>
        </div>

        {/* Product Title */}
        <h3 className="font-bold text-zinc-900 dark:text-zinc-100 text-base leading-snug line-clamp-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
          {product.title}
        </h3>

        {/* Product Short Description */}
        <p className="mt-1.5 text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2 leading-relaxed">
          {product.description}
        </p>
      </div>

      {/* Price & Add to Cart button */}
      <div className="mt-5 pt-3 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between gap-3">
        <div>
          <span className="text-[10px] uppercase font-bold text-zinc-400 block tracking-wider">
            Price
          </span>
          <span className="text-lg font-black text-zinc-900 dark:text-white">
            ${Number(product.price).toFixed(2)}
          </span>
        </div>

        <button
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          className={`flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all shadow-sm cursor-pointer ${
            isOutOfStock
              ? 'bg-zinc-200 dark:bg-zinc-800 text-zinc-400 cursor-not-allowed'
              : isAdding
              ? 'bg-emerald-600 text-white scale-95'
              : 'bg-zinc-900 hover:bg-indigo-600 text-white dark:bg-zinc-800 dark:hover:bg-indigo-600'
          }`}
          aria-label="Add to cart"
        >
          {isAdding ? (
            <>
              <Check className="w-4 h-4" />
              <span>Added</span>
            </>
          ) : (
            <>
              <ShoppingBag className="w-4 h-4" />
              <span>Add</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
