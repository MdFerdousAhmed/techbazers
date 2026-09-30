'use client';

import React from 'react';
import { Star, CheckCircle, Quote } from 'lucide-react';

export default function Testimonials() {
  const reviews = [
    {
      name: "Marcus Vance",
      role: "Full-Stack Software Architect",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80",
      product: "ProBook 16-inch M3 Pro Laptop",
      stars: 5,
      comment: "TechBazer delivered my ProBook within 24 hours. The packaging was immaculate, factory-sealed with official serial verification. This is now my go-to store for all studio tech hardware."
    },
    {
      name: "Elena Rostova",
      role: "Esports Streamer & Competitive Gamer",
      avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80",
      product: "Nova Horizon 34-Inch Curved Monitor",
      stars: 5,
      comment: "The 165Hz ultra-wide display transformed my streaming setup. Zero dead pixels, stunning HDR calibration out of the box, and their customer support answered my cable questions instantly at 11 PM."
    },
    {
      name: "David Chen",
      role: "Audiophile & Music Producer",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80",
      product: "Aura Sound Pro Wireless Headphones",
      stars: 5,
      comment: "Incredible active noise cancellation and neutral soundstage. The build quality exceeds $400 alternatives. Seamless checkout and order tracking updates from dispatch to doorstep."
    }
  ];

  return (
    <section className="my-16">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <span className="text-[11px] font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
          Verified Feedback
        </span>
        <h3 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-white tracking-tight mt-1">
          Loved by Creators & Builders
        </h3>
        <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-2">
          Read what genuine tech professionals say about their shopping experience with TechBazer.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {reviews.map((rev, idx) => (
          <div
            key={idx}
            className="flex flex-col justify-between p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-sm hover:shadow-lg transition-shadow relative"
          >
            <div>
              <div className="flex items-center gap-1 text-amber-400 mb-3">
                {[...Array(rev.stars)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>

              <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed italic">
                "{rev.comment}"
              </p>

              <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800/80">
                <span className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 block">
                  Purchased: {rev.product}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 mt-6">
              <img
                src={rev.avatar}
                alt={rev.name}
                className="w-10 h-10 rounded-full object-cover ring-2 ring-indigo-500/20"
              />
              <div>
                <div className="flex items-center gap-1.5">
                  <h5 className="text-sm font-bold text-zinc-900 dark:text-white">
                    {rev.name}
                  </h5>
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-500" title="Verified Customer" />
                </div>
                <p className="text-[11px] text-zinc-400">
                  {rev.role}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
