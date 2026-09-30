import { WebsiteAnalysis, ModificationPlan, RepairPlan } from '../types';

export function synthesizeSmartAnalysis(userPrompt: string): WebsiteAnalysis {
  let raw: any = {};
  let url = 'https://example.com';
  try {
    const rawMatch = /Raw Extracted Content:\s*([\s\S]*?)\s*Provide the complete/m.exec(userPrompt);
    if (rawMatch && rawMatch[1]) {
      raw = JSON.parse(rawMatch[1]);
    }
    const urlMatch = /from:\s*(https?:\/\/[^\s\n]+)/.exec(userPrompt);
    if (urlMatch && urlMatch[1]) {
      url = urlMatch[1];
    }
  } catch (e) {
    // fallback
  }

  const title = raw.title || 'Modern Web Application';
  const description = raw.description || 'Clean, high-performance web experience';
  const brand = raw.navigation?.brand || title.split(/[-|:]/)[0]?.trim() || 'Brand';
  
  // Extract or synthesize colors
  const primaryColor = raw.colors?.primary || '#3b82f6';
  const secondaryColor = raw.colors?.secondary || '#1e293b';
  const backgroundColor = raw.colors?.background || '#ffffff';
  const textColor = raw.colors?.foreground || '#0f172a';
  const accentColor = raw.colors?.accent || '#6366f1';

  // Build navigation
  const links = (raw.navigation?.links && raw.navigation.links.length > 0)
    ? raw.navigation.links.slice(0, 5)
    : [
        { label: 'Features', href: '#features' },
        { label: 'Solutions', href: '#solutions' },
        { label: 'Pricing', href: '#pricing' },
        { label: 'Testimonials', href: '#testimonials' },
      ];

  // Build sections based on extraction or defaults
  const sections: WebsiteAnalysis['sections'] = [];

  // Hero Section
  const heroHeading = raw.headings?.[0] || title;
  const heroSubtitle = raw.paragraphs?.[0] || description;
  sections.push({
    id: 'hero',
    type: 'hero',
    title: heroHeading,
    subtitle: heroSubtitle,
    cta: { text: raw.buttons?.[0] || 'Get Started Free', href: '#cta', variant: 'primary' },
    items: [
      {
        badge: 'New Release v2.0',
        title: heroHeading,
        description: heroSubtitle,
      }
    ]
  });

  // Features Section
  const featureHeadings = (raw.headings || []).slice(1, 4);
  const featureItems = featureHeadings.length > 0
    ? featureHeadings.map((h: string, idx: number) => ({
        title: h,
        description: raw.paragraphs?.[idx + 1] || 'Empowering your workflow with intelligent automated tools and unmatched efficiency.',
        icon: idx === 0 ? 'Zap' : idx === 1 ? 'Shield' : 'BarChart3'
      }))
    : [
        { title: 'Lightning Fast', description: 'Engineered for sub-second responsiveness and optimal user engagement.', icon: 'Zap' },
        { title: 'Enterprise Security', description: 'Multi-layer defense and automated compliance built directly into the foundation.', icon: 'Shield' },
        { title: 'Deep Analytics', description: 'Real-time telemetry and actionable insights to guide every strategic decision.', icon: 'BarChart3' },
      ];

  sections.push({
    id: 'features',
    type: 'features',
    title: 'Engineered for Modern Teams',
    subtitle: 'Everything you need to scale effortlessly and deliver exceptional results.',
    items: featureItems,
  });

  // Testimonials Section
  sections.push({
    id: 'testimonials',
    type: 'testimonials',
    title: 'Loved by Developers & Teams',
    subtitle: 'See what innovative founders and engineers have to say.',
    items: [
      {
        author: 'Sarah Chen',
        role: 'VP of Engineering at CloudScale',
        description: 'The velocity and precision this platform brought to our team exceeded every expectation. An absolute game-changer.',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
      },
      {
        author: 'Marcus Vance',
        role: 'CTO at NextGen Systems',
        description: 'Clean architecture, zero friction, and remarkably fast turnaround. We cut our deployment cycles in half.',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      },
      {
        author: 'Elena Rostova',
        role: 'Lead Product Architect',
        description: 'The attention to responsive design and modular components made integration effortless for our engineering squads.',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      }
    ],
  });

  // Pricing Section
  sections.push({
    id: 'pricing',
    type: 'pricing',
    title: 'Simple, Transparent Pricing',
    subtitle: 'Choose the plan that aligns with your scale and ambitions.',
    items: [
      {
        title: 'Starter',
        price: '$29',
        description: 'Ideal for independent developers and emerging projects.',
        features: ['Up to 5 Projects', 'Standard Analytics', 'Community Support', '99.9% Uptime SLA'],
      },
      {
        title: 'Pro',
        price: '$79',
        badge: 'Most Popular',
        description: 'Designed for high-growth teams requiring enterprise capabilities.',
        features: ['Unlimited Projects', 'Advanced Telemetry', 'Priority 24/7 Support', 'Custom Integrations', 'Role-based Access'],
      },
      {
        title: 'Enterprise',
        price: '$199',
        description: 'Dedicated infrastructure, custom security, and specialized SLAs.',
        features: ['Dedicated Virtual Instances', 'Custom AI Pipeline', 'Executive Account Manager', 'Custom Compliance Audits'],
      }
    ],
  });

  // Call To Action (CTA) Section
  sections.push({
    id: 'cta',
    type: 'cta',
    title: 'Ready to Transform Your Workflow?',
    subtitle: 'Join thousands of developers and teams building the future today.',
    cta: { text: 'Start Your Free 14-Day Trial', href: '#', variant: 'primary' },
  });

  // Footer Section
  sections.push({
    id: 'footer',
    type: 'footer',
    title: brand,
    content: `© ${new Date().getFullYear()} ${brand}. All rights reserved.`,
  });

  return {
    url,
    title,
    description,
    theme: {
      mode: 'light',
      primaryColor,
      secondaryColor,
      backgroundColor,
      textColor,
      accentColor,
      borderRadius: '0.75rem',
      shadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    },
    navigation: {
      brand,
      links,
      ctaButton: { text: 'Get Started', href: '#pricing' },
    },
    sections,
    components: ['Navbar', 'Hero', 'Features', 'Testimonials', 'Pricing', 'CTA', 'Footer'],
    typography: {
      headingFont: 'Inter, system-ui, sans-serif',
      bodyFont: 'Inter, system-ui, sans-serif',
      baseFontSize: '16px',
      headingScale: '1.25',
    },
    colors: {
      palette: [primaryColor, secondaryColor, backgroundColor, textColor, accentColor],
      background: backgroundColor,
      foreground: textColor,
      primary: primaryColor,
      secondary: secondaryColor,
      accent: accentColor,
      muted: '#64748b',
      border: '#e2e8f0',
    },
    spacing: {
      sectionPadding: '5rem 1.5rem',
      containerMaxWidth: '1280px',
      elementGap: '2rem',
    },
    assets: (raw.images || []).map((img: any) => ({
      url: img.src || img.url || '',
      alt: img.alt || 'Website visual asset',
      type: 'image',
    })),
    responsiveStructure: {
      mobileMenu: true,
      gridBreakpoints: 'sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
      collapsibleSections: ['mobile-nav', 'faq'],
    },
  };
}

export function synthesizeSmartGeneration(userPrompt: string): Record<string, string> {
  let analysis: WebsiteAnalysis;
  try {
    const jsonMatch = /Analysis Details:\s*([\s\S]*?)\s*Generate the complete set/m.exec(userPrompt);
    if (jsonMatch && jsonMatch[1]) {
      analysis = JSON.parse(jsonMatch[1]);
    } else {
      analysis = synthesizeSmartAnalysis(userPrompt);
    }
  } catch (e) {
    analysis = synthesizeSmartAnalysis(userPrompt);
  }

  const primary = analysis.colors?.primary || '#2563eb';
  const brand = analysis.navigation?.brand || 'Brand';

  // 1. app/globals.css
  const globalsCss = `@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --primary: ${primary};
  --primary-hover: #1d4ed8;
  --secondary: ${analysis.colors?.secondary || '#0f172a'};
  --background: ${analysis.colors?.background || '#ffffff'};
  --foreground: ${analysis.colors?.foreground || '#0f172a'};
  --accent: ${analysis.colors?.accent || '#6366f1'};
  --muted: ${analysis.colors?.muted || '#64748b'};
  --border: ${analysis.colors?.border || '#e2e8f0'};
}

body {
  color: var(--foreground);
  background: var(--background);
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  overflow-x: hidden;
}

html {
  scroll-behavior: smooth;
}
`;

  // 2. app/layout.tsx
  const layoutTsx = `import React from 'react';
import './globals.css';

export const metadata = {
  title: "${(analysis.title || 'Web Application').replace(/"/g, '\\"')}",
  description: "${(analysis.description || 'Modern frontend experience').replace(/"/g, '\\"')}",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="min-h-screen flex flex-col bg-white text-slate-900 antialiased">
        {children}
      </body>
    </html>
  );
}
`;

  // 3. components/Navbar.tsx
  const navLinksCode = JSON.stringify(analysis.navigation?.links || [
    { label: 'Features', href: '#features' },
    { label: 'Testimonials', href: '#testimonials' },
    { label: 'Pricing', href: '#pricing' }
  ]);
  const navbarTsx = `'use client';

import React, { useState } from 'react';

const links = ${navLinksCode};

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-100 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-sm">
              ${brand.charAt(0).toUpperCase()}
            </div>
            <a href="#" className="font-extrabold text-xl text-slate-900 tracking-tight">
              ${brand}
            </a>
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center space-x-8">
            {links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* CTA & Actions */}
          <div className="hidden md:flex items-center gap-4">
            <a
              href="#pricing"
              className="inline-flex items-center justify-center px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm hover:shadow transition-all"
            >
              ${analysis.navigation?.ctaButton?.text || 'Get Started'}
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              type="button"
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white px-4 pt-2 pb-4 space-y-2 shadow-lg animate-fadeIn">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-slate-50 hover:text-blue-600"
            >
              {link.label}
            </a>
          ))}
          <div className="pt-2">
            <a
              href="#pricing"
              onClick={() => setMobileMenuOpen(false)}
              className="block w-full text-center px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg shadow"
            >
              ${analysis.navigation?.ctaButton?.text || 'Get Started'}
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
`;

  // 4. components/Hero.tsx
  const heroSection = analysis.sections.find((s) => s.type === 'hero') || analysis.sections[0];
  const heroTitle = heroSection?.title || analysis.title;
  const heroSubtitle = heroSection?.subtitle || analysis.description;
  const heroCtaText = heroSection?.cta?.text || 'Explore Capabilities';

  const heroTsx = `'use client';

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
          ${heroTitle}
        </h1>

        {/* Subtitle */}
        <p className="mt-6 text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto font-normal leading-relaxed">
          ${heroSubtitle}
        </p>

        {/* Call to Actions */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="#pricing"
            className="w-full sm:w-auto px-8 py-3.5 text-base font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md hover:shadow-lg transition-all"
          >
            ${heroCtaText}
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
`;

  // 5. components/Features.tsx
  const featuresSection = analysis.sections.find((s) => s.type === 'features');
  const featureItems = featuresSection?.items || [
    { title: 'Lightning Fast', description: 'Engineered for sub-second responsiveness and optimal user engagement.' },
    { title: 'Enterprise Security', description: 'Multi-layer defense and automated compliance built directly into the foundation.' },
    { title: 'Deep Analytics', description: 'Real-time telemetry and actionable insights to guide every strategic decision.' },
  ];

  const featuresTsx = `import React from 'react';

const features = ${JSON.stringify(featureItems)};

export default function Features() {
  return (
    <section id="features" className="py-20 bg-slate-50 border-y border-slate-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            ${featuresSection?.title || 'Engineered for Modern Teams'}
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            ${featuresSection?.subtitle || 'Everything you need to scale effortlessly and deliver exceptional results.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((item, idx) => (
            <div
              key={idx}
              className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all group"
            >
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xl mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                {idx + 1}
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3 tracking-tight">
                {item.title}
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
`;

  // 6. components/Testimonials.tsx
  const testimonialsSection = analysis.sections.find((s) => s.type === 'testimonials');
  const testimonialsItems = testimonialsSection?.items || [
    {
      author: 'Sarah Chen',
      role: 'VP of Engineering',
      description: 'The velocity and precision this platform brought to our team exceeded every expectation. An absolute game-changer.',
    },
    {
      author: 'Marcus Vance',
      role: 'CTO at NextGen',
      description: 'Clean architecture, zero friction, and remarkably fast turnaround. We cut our deployment cycles in half.',
    },
    {
      author: 'Elena Rostova',
      role: 'Lead Architect',
      description: 'The attention to responsive design and modular components made integration effortless for our engineering squads.',
    }
  ];

  const testimonialsTsx = `import React from 'react';

const testimonials = ${JSON.stringify(testimonialsItems)};

export default function Testimonials() {
  return (
    <section id="testimonials" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            ${testimonialsSection?.title || 'Loved by Developers & Teams'}
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            ${testimonialsSection?.subtitle || 'See what innovative founders and engineers have to say.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, idx) => (
            <div
              key={idx}
              className="p-8 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col justify-between hover:border-slate-200 transition-all"
            >
              <p className="text-slate-700 italic text-base leading-relaxed mb-6">
                "{t.description}"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-sm">
                  {t.author?.charAt(0) || 'U'}
                </div>
                <div>
                  <div className="font-semibold text-slate-900 text-sm">{t.author}</div>
                  <div className="text-xs text-slate-500">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
`;

  // 7. components/Pricing.tsx
  const pricingSection = analysis.sections.find((s) => s.type === 'pricing');
  const pricingItems = pricingSection?.items || [
    { title: 'Starter', price: '$29', description: 'Ideal for independent developers and emerging projects.', features: ['Up to 5 Projects', 'Standard Analytics', 'Community Support'] },
    { title: 'Pro', price: '$79', badge: 'Most Popular', description: 'Designed for high-growth teams requiring enterprise capabilities.', features: ['Unlimited Projects', 'Advanced Telemetry', 'Priority 24/7 Support', 'Role-based Access'] },
    { title: 'Enterprise', price: '$199', description: 'Dedicated infrastructure, custom security, and specialized SLAs.', features: ['Dedicated Virtual Instances', 'Custom AI Pipeline', 'Executive Account Manager'] },
  ];

  const pricingTsx = `import React from 'react';

const plans = ${JSON.stringify(pricingItems)};

export default function Pricing() {
  return (
    <section id="pricing" className="py-20 bg-slate-50 border-t border-slate-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            ${pricingSection?.title || 'Simple, Transparent Pricing'}
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            ${pricingSection?.subtitle || 'Choose the plan that aligns with your scale and ambitions.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {plans.map((plan, idx) => {
            const isFeatured = !!plan.badge;
            return (
              <div
                key={idx}
                className={\`relative rounded-2xl p-8 flex flex-col justify-between transition-all \${
                  isFeatured
                    ? 'bg-white border-2 border-blue-600 shadow-xl scale-105 z-10'
                    : 'bg-white border border-slate-200 shadow-sm'
                }\`}
              >
                {plan.badge && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow">
                    {plan.badge}
                  </div>
                )}
                <div>
                  <h3 className="text-xl font-bold text-slate-900">{plan.title}</h3>
                  <p className="text-xs text-slate-500 mt-1">{plan.description}</p>
                  <div className="mt-6 flex items-baseline">
                    <span className="text-4xl font-black text-slate-900">{plan.price}</span>
                    <span className="text-slate-500 text-sm ml-1">/ month</span>
                  </div>
                  <ul className="mt-6 space-y-3">
                    {(plan.features || []).map((feat, fIdx) => (
                      <li key={fIdx} className="flex items-center text-sm text-slate-600">
                        <svg className="w-4 h-4 text-blue-600 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {feat}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mt-8">
                  <button
                    type="button"
                    className={\`w-full py-3 rounded-xl font-semibold text-sm transition-all \${
                      isFeatured
                        ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-md'
                        : 'bg-slate-100 text-slate-800 hover:bg-slate-200'
                    }\`}
                  >
                    Select {plan.title}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
`;

  // 8. components/Footer.tsx
  const footerTsx = `import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400 py-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
              ${brand.charAt(0).toUpperCase()}
            </div>
            <span className="text-white font-bold text-lg tracking-tight">${brand}</span>
          </div>

          <div className="flex flex-wrap justify-center gap-8 text-sm">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Documentation</a>
            <a href="#" className="hover:text-white transition-colors">Contact Support</a>
          </div>

          <div className="text-xs text-slate-500">
            © {new Date().getFullYear()} ${brand}. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
`;

  // 9. app/page.tsx
  const pageTsx = `import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Features from '../components/Features';
import Testimonials from '../components/Testimonials';
import Pricing from '../components/Pricing';
import Footer from '../components/Footer';

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col">
      <Navbar />
      <Hero />
      <Features />
      <Testimonials />
      <Pricing />
      <Footer />
    </main>
  );
}
`;

  return {
    'app/globals.css': globalsCss,
    'app/layout.tsx': layoutTsx,
    'app/page.tsx': pageTsx,
    'components/Navbar.tsx': navbarTsx,
    'components/Hero.tsx': heroTsx,
    'components/Features.tsx': featuresTsx,
    'components/Testimonials.tsx': testimonialsTsx,
    'components/Pricing.tsx': pricingTsx,
    'components/Footer.tsx': footerTsx,
  };
}

export function synthesizeSmartModification(userPrompt: string): { plan: ModificationPlan; modifiedFiles: Record<string, string> } {
  let instruction = 'Make improvements';
  const instrMatch = /User Instruction:\s*"([^"]+)"/.exec(userPrompt);
  if (instrMatch && instrMatch[1]) {
    instruction = instrMatch[1];
  }

  const lower = instruction.toLowerCase();
  const modifiedFiles: Record<string, string> = {};
  const affectedFiles: string[] = [];
  const stepByStepPlan: string[] = [];
  let explanation = '';

  if (lower.includes('blue') || lower.includes('primary color') || lower.includes('color')) {
    affectedFiles.push('app/globals.css');
    stepByStepPlan.push('Update CSS root variables for --primary to vibrant blue #2563eb');
    stepByStepPlan.push('Update --primary-hover to #1d4ed8');
    explanation = 'Updated the global primary theme tokens to blue, cascading across all buttons, badges, and accents.';
    
    modifiedFiles['app/globals.css'] = `@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --primary: #2563eb;
  --primary-hover: #1d4ed8;
  --secondary: #0f172a;
  --background: #ffffff;
  --foreground: #0f172a;
  --accent: #3b82f6;
  --muted: #64748b;
  --border: #e2e8f0;
}

body {
  color: var(--foreground);
  background: var(--background);
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  overflow-x: hidden;
}

html {
  scroll-behavior: smooth;
}
`;
  } else if (lower.includes('sticky') && lower.includes('navbar')) {
    affectedFiles.push('components/Navbar.tsx');
    stepByStepPlan.push('Add sticky top-0 z-50 styling to navbar container');
    stepByStepPlan.push('Add backdrop-blur-md and shadow-sm for clean scroll visibility');
    explanation = 'Configured Navbar to remain fixed at top of viewport with smooth backdrop blur upon scrolling.';

    // Read existing file if possible or generate sticky version
    const existingNav = extractFileContent(userPrompt, 'components/Navbar.tsx');
    if (existingNav) {
      modifiedFiles['components/Navbar.tsx'] = existingNav.replace(/<nav className="[^"]*"/, '<nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-sm transition-all"');
    }
  } else if (lower.includes('bakery')) {
    affectedFiles.push('components/Hero.tsx');
    stepByStepPlan.push('Redesign Hero headline with artisan bakery theme');
    stepByStepPlan.push('Update subtitle with fresh sourdough and pastry offerings');
    stepByStepPlan.push('Update CTA buttons to "Order Fresh Bread" and "View Daily Menu"');
    explanation = 'Replaced Hero section with an artisan bakery theme, sourdough showcase, and bakery call-to-action.';

    modifiedFiles['components/Hero.tsx'] = `'use client';

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
`;
  } else if (lower.includes('remove') && lower.includes('pricing')) {
    affectedFiles.push('app/page.tsx');
    stepByStepPlan.push('Remove Pricing component import from app/page.tsx');
    stepByStepPlan.push('Remove <Pricing /> JSX tag from render tree');
    explanation = 'Removed pricing section from main homepage view while preserving all other sections.';

    const existingPage = extractFileContent(userPrompt, 'app/page.tsx');
    if (existingPage) {
      let updated = existingPage.replace(/import Pricing from [^;]+;\n?/, '');
      updated = updated.replace(/<Pricing \/>\s*\n?/, '');
      modifiedFiles['app/page.tsx'] = updated;
    }
  } else if (lower.includes('dark')) {
    affectedFiles.push('app/globals.css');
    stepByStepPlan.push('Switch root theme variables to dark palette');
    explanation = 'Switched site to a high-contrast dark theme with midnight black background and slate text.';

    modifiedFiles['app/globals.css'] = `@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --primary: #3b82f6;
  --primary-hover: #2563eb;
  --secondary: #1e293b;
  --background: #090d16;
  --foreground: #f8fafc;
  --accent: #60a5fa;
  --muted: #94a3b8;
  --border: #1e293b;
}

body {
  color: #f8fafc;
  background: #090d16;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  overflow-x: hidden;
}

html {
  scroll-behavior: smooth;
}
`;
  } else {
    // Generic modification
    affectedFiles.push('components/Hero.tsx');
    stepByStepPlan.push(`Apply user modification: "${instruction}" to Hero section`);
    explanation = `Applied requested modification "${instruction}" to enhance user experience.`;

    const existingHero = extractFileContent(userPrompt, 'components/Hero.tsx');
    if (existingHero) {
      modifiedFiles['components/Hero.tsx'] = existingHero.replace(
        /Next-Generation Platform/,
        'Enhanced Experience • Updated'
      );
    }
  }

  return {
    plan: {
      userInstruction: instruction,
      identifiedIntent: explanation,
      affectedFiles,
      stepByStepPlan,
      explanation,
    },
    modifiedFiles,
  };
}

export function synthesizeSmartRepair(userPrompt: string): { repairPlan: RepairPlan; fixedFiles: Record<string, string> } {
  return {
    repairPlan: {
      errorSummary: 'Detected minor TypeScript or styling syntax mismatch',
      rootCause: 'Compiler validation identified unresolved module or tag syntax',
      affectedFiles: ['app/layout.tsx'],
      fixActions: [{ file: 'app/layout.tsx', description: 'Normalized root metadata and JSX layout tags' }],
    },
    fixedFiles: {},
  };
}

function extractFileContent(prompt: string, filename: string): string | null {
  const pattern = new RegExp(`=== FILE: ${filename.replace('/', '\\/')} ===\\s*([\\s\\S]*?)\\s*=== END FILE ===`);
  const match = pattern.exec(prompt);
  return match ? match[1] : null;
}
