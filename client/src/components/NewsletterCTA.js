'use client';

import React, { useState } from 'react';
import { Mail, Sparkles, CheckCircle2, Bell } from 'lucide-react';

export default function NewsletterCTA() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubmitted(true);
    setEmail('');
    setTimeout(() => setSubmitted(false), 4000);
  };

  const benefits = [
    'Exclusive flash deal alerts before anyone else',
    'Tech unboxing and review content from our experts',
    'Early access to new product launches and bundles',
    'Promo codes worth up to 20% off sent monthly'
  ];

  return (
    <section className="my-16 relative overflow-hidden rounded-3xl shadow-2xl">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 opacity-95" />
      <div className="absolute -top-20 -right-20 w-72 h-72 bg-white/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-pink-500/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative px-6 sm:px-12 py-12 sm:py-16 max-w-5xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-10">
        <div className="flex-1 text-white text-center lg:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 border border-white/30 text-white/90 text-xs font-semibold tracking-wide uppercase mb-4">
            <Bell className="w-3.5 h-3.5" />
            <span>Stay in the Loop</span>
          </div>
          <h3 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight">
            Get the Best Tech Deals First
          </h3>
          <p className="mt-3 text-sm sm:text-base text-white/80 max-w-md mx-auto lg:mx-0 leading-relaxed">
            Join <strong>50,000+</strong> TechBazer subscribers. Get exclusive offers, expert guides, and flash sale alerts straight to your inbox.
          </p>
          <ul className="mt-5 space-y-2.5">
            {benefits.map((b, i) => (
              <li key={i} className="flex items-start gap-2 text-xs sm:text-sm text-white/85">
                <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0 mt-0.5" />
                <span>{b}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="w-full lg:max-w-sm bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 sm:p-8 shadow-xl">
          {submitted ? (
            <div className="text-center py-6">
              <div className="w-14 h-14 rounded-full bg-emerald-400/20 flex items-center justify-center mx-auto mb-3">
                <CheckCircle2 className="w-7 h-7 text-emerald-300" />
              </div>
              <h4 className="text-lg font-black text-white">You are in!</h4>
              <p className="text-xs text-white/70 mt-1">Check your inbox for a welcome offer.</p>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-yellow-300" />
                <span className="text-base font-bold text-white">Subscribe and Save</span>
              </div>
              <p className="text-xs text-white/70 mb-5 leading-relaxed">No spam, ever. Unsubscribe in one click.</p>
              <form onSubmit={handleSubmit} className="space-y-3">
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3 w-4 h-4 text-white/50" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    required
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 text-sm focus:outline-none focus:ring-2 focus:ring-white/40 transition"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 px-5 rounded-xl bg-white text-indigo-700 font-black text-sm hover:bg-zinc-100 active:scale-95 transition-all shadow-lg cursor-pointer"
                >
                  Subscribe Now - Free
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
