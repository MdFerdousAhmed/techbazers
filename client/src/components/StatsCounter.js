'use client';

import React from 'react';
import { Package, Users, ShieldCheck, Zap, Globe, Sparkles } from 'lucide-react';

export default function StatsCounter() {
  const stats = [
    {
      icon: Package,
      value: "112+",
      label: "Premium Hardware Products",
      detail: "Across 8 curated tech categories"
    },
    {
      icon: Users,
      value: "50,000+",
      label: "Happy Global Tech Enthusiasts",
      detail: "Backed by 4.8/5.0 average reviews"
    },
    {
      icon: ShieldCheck,
      value: "99.9%",
      label: "Verified Authentic Hardware",
      detail: "Factory sealed with original warranty"
    },
    {
      icon: Zap,
      value: "< 24h",
      label: "Average Express Dispatch Time",
      detail: "Real-time automated order processing"
    }
  ];

  return (
    <section className="my-16 py-12 px-6 sm:px-12 rounded-3xl bg-zinc-900 text-white relative overflow-hidden border border-zinc-800 shadow-2xl">
      {/* Background ambient gradient */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-48 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 blur-3xl pointer-events-none"></div>

      <div className="relative max-w-5xl mx-auto text-center space-y-4 mb-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-indigo-300 text-xs font-semibold border border-white/10">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Engineered For Creators & Power Users</span>
        </div>
        <h3 className="text-3xl sm:text-4xl font-black tracking-tight">
          Why Over 50,000 Tech Enthusiasts Choose TechBazer
        </h3>
        <p className="text-xs sm:text-sm text-zinc-400 max-w-2xl mx-auto leading-relaxed">
          From cutting-edge Silicon workstations to studio-grade planar acoustics and esports equipment, we only stock tested, verified, and authenticated hardware.
        </p>
      </div>

      <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-white/5 border border-white/10 text-center flex flex-col items-center justify-center hover:border-indigo-500/40 transition-colors"
            >
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center mb-3">
                <Icon className="w-6 h-6" />
              </div>
              <span className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-white via-zinc-200 to-indigo-300 bg-clip-text text-transparent">
                {stat.value}
              </span>
              <h5 className="text-sm font-bold text-zinc-200 mt-2">
                {stat.label}
              </h5>
              <p className="text-xs text-zinc-400 mt-1">
                {stat.detail}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
