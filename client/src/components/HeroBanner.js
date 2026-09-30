'use client';

import React from 'react';
import { Truck, ShieldCheck, Clock, ArrowRight, Sparkles } from 'lucide-react';

export default function HeroBanner({ onSelectCategory }) {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-zinc-900 via-indigo-950 to-zinc-950 text-white shadow-2xl my-6 border border-zinc-800">
      {/* Background ambient lighting effects */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-indigo-500/15 blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-1/3 -mb-20 w-80 h-80 rounded-full bg-purple-500/15 blur-3xl pointer-events-none"></div>

      <div className="relative px-6 py-12 sm:px-12 sm:py-16 lg:py-20 max-w-4xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 text-xs font-semibold mb-6">
          <Sparkles className="w-3.5 h-3.5" />
          <span>TechBazer — Next-Gen Tech & Gear 2026</span>
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight sm:leading-none">
          Power Up Your World <br />
          <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400 bg-clip-text text-transparent">
            With TechBazer.
          </span>
        </h1>

        <p className="mt-4 sm:mt-6 text-base sm:text-lg text-zinc-300 max-w-2xl leading-relaxed">
          Discover top-tier smartphones, workstation laptops, pro audio, immersive gaming gear, and smart technology. Authenticity guaranteed, fast express shipping, and seamless checkout.
        </p>

        {/* Action button & category chips */}
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <a
            href="#catalog-section"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold shadow-lg shadow-indigo-600/30 hover:scale-[1.02] transition cursor-pointer"
          >
            <span>Explore Catalog</span>
            <ArrowRight className="w-4 h-4" />
          </a>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            {['Smartphones & Tablets', 'Laptops & Computers', 'Audio & Sound', 'Gaming Gear', 'Wearables', 'Smart Home & Tech'].map(cat => (
              <button
                key={cat}
                onClick={() => onSelectCategory(cat)}
                className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-zinc-200 border border-white/10 transition cursor-pointer"
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom feature badges */}
      <div className="border-t border-white/10 bg-black/20 px-6 py-4 sm:px-12">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs sm:text-sm text-zinc-300">
          <div className="flex items-center gap-2.5">
            <Truck className="w-4 h-4 text-indigo-400 shrink-0" />
            <span>Free express delivery on orders over $100</span>
          </div>
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Verified authentic 1-year warranty</span>
          </div>
          <div className="flex items-center gap-2.5">
            <Clock className="w-4 h-4 text-purple-400 shrink-0" />
            <span>Instant order tracking & live dispatch updates</span>
          </div>
        </div>
      </div>
    </div>
  );
}
