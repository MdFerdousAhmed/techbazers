'use client';

import React from 'react';
import { Zap, ShieldCheck, RefreshCw, Headphones, Award, Truck } from 'lucide-react';

export default function ValueProps() {
  const perks = [
    {
      icon: Zap,
      title: "Lightning Express Shipping",
      desc: "Dispatched within 24 hours. Free express delivery on orders over $99.",
      color: "from-amber-500 to-orange-500",
      bg: "bg-amber-500/10 text-amber-500"
    },
    {
      icon: ShieldCheck,
      title: "2-Year Official Warranty",
      desc: "100% authentic hardware with full manufacturer warranty and replacement.",
      color: "from-emerald-500 to-teal-500",
      bg: "bg-emerald-500/10 text-emerald-500"
    },
    {
      icon: RefreshCw,
      title: "30-Day Hassle-Free Returns",
      desc: "Prepaid return labels included with zero restocking fees or questions asked.",
      color: "from-blue-500 to-cyan-500",
      bg: "bg-blue-500/10 text-blue-500"
    },
    {
      icon: Headphones,
      title: "24/7 Tech Concierge",
      desc: "Direct access to certified tech specialists for setup assistance & troubleshooting.",
      color: "from-indigo-500 to-purple-500",
      bg: "bg-indigo-500/10 text-indigo-500"
    }
  ];

  return (
    <section className="py-6 border-y border-zinc-200 dark:border-zinc-800/80 my-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {perks.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className="flex items-start gap-4 p-4 rounded-2xl bg-white/60 dark:bg-zinc-900/60 border border-zinc-200/80 dark:border-zinc-800/80 backdrop-blur-xs hover:border-indigo-500/30 transition-all hover:shadow-md group"
            >
              <div className={`p-3 rounded-xl ${item.bg} shrink-0 group-hover:scale-110 transition-transform`}>
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                  {item.title}
                </h4>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
