'use client';

import React, { useState, useEffect } from 'react';
import { Flame, Clock, ShoppingCart, Star, ArrowRight, Zap, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';

export default function FlashDeals({ onSelectProduct }) {
  const { addToCart } = useCart();
  const { addToast } = useToast();
  const [timeLeft, setTimeLeft] = useState({ hours: 14, minutes: 35, seconds: 20 });
  const [addingId, setAddingId] = useState(null);

  // Live countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: 59, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 24, minutes: 0, seconds: 0 };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const deals = [
    {
      _id: "deal_001",
      title: "Titan 5G Ultra Smartphone (256GB - Titanium Gray)",
      originalPrice: 1199.00,
      price: 999.00,
      discount: "17% OFF",
      category: "Smartphones & Tablets",
      image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&auto=format&fit=crop&q=80",
      rating: 4.9,
      reviewsCount: 184,
      stock: 25,
      claimed: 78
    },
    {
      _id: "deal_002",
      title: "Nova Horizon 34-Inch 4K Curved Gaming Monitor",
      originalPrice: 649.00,
      price: 499.00,
      discount: "23% OFF",
      category: "Gaming Gear",
      image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&auto=format&fit=crop&q=80",
      rating: 4.9,
      reviewsCount: 78,
      stock: 12,
      claimed: 85
    },
    {
      _id: "deal_003",
      title: "Aura Sound Pro Wireless Noise-Cancelling Headphones",
      originalPrice: 329.00,
      price: 249.99,
      discount: "24% OFF",
      category: "Audio & Sound",
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80",
      rating: 4.8,
      reviewsCount: 215,
      stock: 35,
      claimed: 62
    },
    {
      _id: "deal_004",
      title: "DJI Mini 4 Pro Drone Fly More Combo",
      originalPrice: 1129.00,
      price: 959.00,
      discount: "15% OFF",
      category: "Cameras & Drones",
      image: "https://images.unsplash.com/photo-1527977966376-1c8408f9f108?w=800&auto=format&fit=crop&q=80",
      rating: 4.9,
      reviewsCount: 142,
      stock: 12,
      claimed: 90
    }
  ];

  const handleQuickAdd = async (e, deal) => {
    e.stopPropagation();
    setAddingId(deal._id);
    try {
      await addToCart(deal);
      addToast(`Added "${deal.title.slice(0, 30)}..." to your cart!`, 'success');
    } catch {
      addToast('Failed to add deal to cart', 'error');
    } finally {
      setTimeout(() => setAddingId(null), 600);
    }
  };

  return (
    <section className="my-12 p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-indigo-950/60 via-purple-950/40 to-zinc-950/90 border border-indigo-500/20 backdrop-blur-xl relative overflow-hidden shadow-2xl">
      {/* Glow elements */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Header with Title and Countdown */}
      <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs font-bold tracking-wide uppercase mb-2">
            <Flame className="w-3.5 h-3.5 animate-pulse text-rose-400" />
            <span>Limited Time Deal</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Flash Tech Specials
          </h3>
          <p className="text-xs sm:text-sm text-zinc-300 mt-1">
            Exclusive discounts on premier hardware. Prices revert when timer expires.
          </p>
        </div>

        {/* Countdown Timer Block */}
        <div className="flex items-center gap-2 bg-black/40 border border-white/10 px-4 py-2.5 rounded-2xl shrink-0">
          <Clock className="w-4 h-4 text-indigo-400 shrink-0" />
          <span className="text-xs text-zinc-400 font-medium mr-1">Ends in:</span>
          <div className="flex items-center gap-1 font-mono font-bold text-white text-sm">
            <span className="px-2 py-1 bg-white/10 rounded-lg">{String(timeLeft.hours).padStart(2, '0')}h</span>
            <span>:</span>
            <span className="px-2 py-1 bg-white/10 rounded-lg">{String(timeLeft.minutes).padStart(2, '0')}m</span>
            <span>:</span>
            <span className="px-2 py-1 bg-rose-500/30 text-rose-300 rounded-lg">{String(timeLeft.seconds).padStart(2, '0')}s</span>
          </div>
        </div>
      </div>

      {/* Deals Grid */}
      <div className="relative mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {deals.map((deal) => (
          <div
            key={deal._id}
            onClick={() => onSelectProduct && onSelectProduct(deal)}
            className="group flex flex-col justify-between rounded-2xl bg-white/5 dark:bg-zinc-900/60 border border-white/10 hover:border-indigo-400/40 p-4 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer"
          >
            <div>
              {/* Image & Discount Badge */}
              <div className="relative aspect-4/3 rounded-xl overflow-hidden bg-black/40 mb-3">
                <img
                  src={deal.image}
                  alt={deal.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-2 left-2 px-2.5 py-1 rounded-lg bg-rose-600 text-white font-black text-xs shadow-md tracking-wider">
                  {deal.discount}
                </span>
                <span className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-xs text-zinc-300 text-[10px] font-semibold">
                  {deal.category}
                </span>
              </div>

              {/* Title & Rating */}
              <h4 className="text-sm font-bold text-white line-clamp-2 group-hover:text-indigo-300 transition-colors">
                {deal.title}
              </h4>

              <div className="flex items-center gap-1 mt-1 text-xs text-zinc-400">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span className="font-bold text-zinc-200">{deal.rating}</span>
                <span>({deal.reviewsCount})</span>
              </div>

              {/* Stock Bar */}
              <div className="mt-3 space-y-1">
                <div className="flex justify-between text-[11px] text-zinc-400">
                  <span>Claimed: {deal.claimed}%</span>
                  <span className="text-rose-400 font-semibold">{deal.stock} left</span>
                </div>
                <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-rose-500 to-amber-500 rounded-full"
                    style={{ width: `${deal.claimed}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Price & Add to Cart */}
            <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
              <div>
                <span className="text-lg font-black text-white">
                  ${deal.price.toFixed(2)}
                </span>
                <span className="block text-xs line-through text-zinc-400 -mt-0.5">
                  ${deal.originalPrice.toFixed(2)}
                </span>
              </div>

              <button
                onClick={(e) => handleQuickAdd(e, deal)}
                disabled={addingId === deal._id}
                className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/30 hover:scale-105 active:scale-95 transition-all cursor-pointer"
                title="Add Deal to Cart"
              >
                {addingId === deal._id ? (
                  <Check className="w-4 h-4 text-emerald-300" />
                ) : (
                  <ShoppingCart className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
