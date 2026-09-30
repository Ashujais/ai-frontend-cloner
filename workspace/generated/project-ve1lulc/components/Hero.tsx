'use client';

import React from 'react';

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-blue-50/50 via-white to-white pt-20 pb-24 md:pt-28 md:pb-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 mb-8 rounded-full bg-blue-100/80 border border-blue-200 text-blue-700 text-xs font-semibold tracking-wide uppercase shadow-sm">
          <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
          Next-Generation Platform
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-slate-900 tracking-tight leading-[1.15] max-w-4xl mx-auto">
          httpbin.org 0.9.2
        </h1>

        {/* Subtitle */}
        <p className="mt-6 text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto font-normal leading-relaxed">
          A simple HTTP Request & Response Service. Run locally: $ docker run -p 80:80 kennethreitz/httpbin
        </p>

        {/* Call to Actions */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="#pricing"
            className="w-full sm:w-auto px-8 py-3.5 text-base font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md hover:shadow-lg transition-all"
          >
            Get Started Free
          </a>
          <a
            href="#features"
            className="w-full sm:w-auto px-8 py-3.5 text-base font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all"
          >
            Learn More
          </a>
        </div>

        {/* Social Proof Stats */}
        <div className="mt-16 pt-12 border-t border-slate-200/60 max-w-3xl mx-auto grid grid-cols-3 gap-6 text-center">
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">99.9%</div>
            <div className="text-xs sm:text-sm text-slate-500 mt-1">Uptime SLA</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-blue-600">10x</div>
            <div className="text-xs sm:text-sm text-slate-500 mt-1">Faster Velocity</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">50,000+</div>
            <div className="text-xs sm:text-sm text-slate-500 mt-1">Active Developers</div>
          </div>
        </div>
      </div>
    </section>
  );
}
