'use client';

import React from 'react';

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-amber-50/70 via-orange-50/30 to-white pt-20 pb-24 md:pt-28 md:pb-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 mb-8 rounded-full bg-amber-100 border border-amber-200 text-amber-800 text-xs font-semibold tracking-wide uppercase shadow-sm">
          🥖 Handcrafted Daily from 5:00 AM
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-amber-950 tracking-tight leading-[1.15] max-w-4xl mx-auto">
          Warm Artisan Sourdough & French Pastries Fresh from the Hearth
        </h1>

        <p className="mt-6 text-lg sm:text-xl text-amber-900/80 max-w-2xl mx-auto font-normal leading-relaxed">
          Naturally leavened organic flour, slow 36-hour cold fermentation, and traditional European baking techniques for an unforgettable crust and crumb.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="#pricing"
            className="w-full sm:w-auto px-8 py-3.5 text-base font-semibold text-white bg-amber-700 hover:bg-amber-800 rounded-xl shadow-md hover:shadow-lg transition-all"
          >
            Order Fresh Bread
          </a>
          <a
            href="#features"
            className="w-full sm:w-auto px-8 py-3.5 text-base font-semibold text-amber-900 bg-amber-100 hover:bg-amber-200 rounded-xl transition-all"
          >
            View Daily Menu
          </a>
        </div>
      </div>
    </section>
  );
}
