'use client';

import React from 'react';
import { 
  Smartphone, 
  Laptop, 
  Headphones, 
  Gamepad2, 
  Watch, 
  Home, 
  Camera, 
  HardDrive, 
  ArrowRight 
} from 'lucide-react';

export default function CategoryShowcase({ onSelectCategory, selectedCategory }) {
  const categories = [
    {
      name: "Smartphones & Tablets",
      count: "14 items",
      icon: Smartphone,
      gradient: "from-blue-600 to-indigo-600",
      image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&auto=format&fit=crop&q=80"
    },
    {
      name: "Laptops & Computers",
      count: "14 items",
      icon: Laptop,
      gradient: "from-purple-600 to-violet-600",
      image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop&q=80"
    },
    {
      name: "Audio & Sound",
      count: "14 items",
      icon: Headphones,
      gradient: "from-rose-600 to-pink-600",
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80"
    },
    {
      name: "Gaming Gear",
      count: "14 items",
      icon: Gamepad2,
      gradient: "from-red-600 to-orange-600",
      image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600&auto=format&fit=crop&q=80"
    },
    {
      name: "Wearables",
      count: "14 items",
      icon: Watch,
      gradient: "from-emerald-600 to-teal-600",
      image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80"
    },
    {
      name: "Smart Home & Tech",
      count: "14 items",
      icon: Home,
      gradient: "from-amber-600 to-yellow-600",
      image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600&auto=format&fit=crop&q=80"
    },
    {
      name: "Cameras & Drones",
      count: "14 items",
      icon: Camera,
      gradient: "from-cyan-600 to-blue-600",
      image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&auto=format&fit=crop&q=80"
    },
    {
      name: "Storage & Accessories",
      count: "14 items",
      icon: HardDrive,
      gradient: "from-indigo-600 to-cyan-600",
      image: "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=600&auto=format&fit=crop&q=80"
    }
  ];

  return (
    <section className="my-12">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
            Hardware Categories
          </span>
          <h3 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-white tracking-tight">
            Browse By Department
          </h3>
        </div>
        <button
          onClick={() => onSelectCategory('All')}
          className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer self-start sm:self-auto"
        >
          <span>View All 112+ Products</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isSelected = selectedCategory === cat.name;

          return (
            <div
              key={cat.name}
              onClick={() => onSelectCategory(cat.name)}
              className={`group relative overflow-hidden rounded-2xl border p-4 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer ${
                isSelected
                  ? 'border-indigo-600 dark:border-indigo-400 bg-indigo-50/50 dark:bg-indigo-950/40 ring-2 ring-indigo-500/20'
                  : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-zinc-300 dark:hover:border-zinc-700'
              }`}
            >
              {/* Background preview image */}
              <div className="absolute right-0 bottom-0 w-24 h-24 sm:w-28 sm:h-28 opacity-25 dark:opacity-20 rounded-tl-full overflow-hidden pointer-events-none group-hover:scale-110 group-hover:opacity-40 transition-all duration-500">
                <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
              </div>

              {/* Icon badge */}
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${cat.gradient} flex items-center justify-center text-white shadow-md mb-3 group-hover:scale-110 transition-transform`}>
                <Icon className="w-5 h-5" />
              </div>

              {/* Text info */}
              <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-1">
                {cat.name}
              </h4>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">
                {cat.count}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
