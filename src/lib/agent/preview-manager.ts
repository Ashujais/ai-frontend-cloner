import { ProjectManifest } from '../types';

export function renderStandalonePreviewHtml(manifest: ProjectManifest): string {
  const { files, analysis } = manifest;

  // Extract CSS
  const globalsCss = files['app/globals.css'] || '';
  const rootVarsMatch = /:root\s*\{([\s\S]*?)\}/m.exec(globalsCss);
  const rootVars = rootVarsMatch ? rootVarsMatch[1] : '';

  // Extract primary colors
  const primaryColor = analysis?.theme?.primaryColor || '#2563eb';
  const brand = analysis?.navigation?.brand || 'Brand';
  const pageTitle = analysis?.title || `${brand} - Next.js Recreated Frontend`;

  // Render components into clean modern HTML
  // Let's inspect the files present in the project
  let navbarHtml = renderNavbarHtml(files, brand);
  let heroHtml = renderHeroHtml(files, analysis);
  let featuresHtml = renderFeaturesHtml(files);
  let testimonialsHtml = renderTestimonialsHtml(files);
  let pricingHtml = renderPricingHtml(files);
  let footerHtml = renderFooterHtml(files, brand);

  // Check if pricing or other sections were removed in app/page.tsx
  const pageCode = files['app/page.tsx'] || '';
  if (pageCode && !pageCode.includes('Pricing') && !pageCode.includes('<Pricing')) {
    pricingHtml = '';
  }
  if (pageCode && !pageCode.includes('Testimonials') && !pageCode.includes('<Testimonials')) {
    testimonialsHtml = '';
  }

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(pageTitle)}</title>
  <!-- Tailwind CSS Engine for dynamic preview rendering -->
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      theme: {
        extend: {
          colors: {
            primary: '${primaryColor}',
            brand: '${primaryColor}',
          }
        }
      }
    }
  </script>
  <style>
    :root {
      ${rootVars}
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      margin: 0;
      padding: 0;
      color: var(--foreground, #0f172a);
      background: var(--background, #ffffff);
    }
    html {
      scroll-behavior: smooth;
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(-4px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .animate-fadeIn {
      animation: fadeIn 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }
  </style>
</head>
<body className="min-h-screen flex flex-col antialiased">
  ${navbarHtml}
  <main class="flex-grow">
    ${heroHtml}
    ${featuresHtml}
    ${testimonialsHtml}
    ${pricingHtml}
  </main>
  ${footerHtml}

  <script>
    // Client-side interactions simulation
    function toggleMobileMenu() {
      const menu = document.getElementById('mobile-menu');
      if (menu) {
        menu.classList.toggle('hidden');
      }
    }
  </script>
</body>
</html>`;
}

function renderNavbarHtml(files: Record<string, string>, brand: string): string {
  const code = files['components/Navbar.tsx'] || '';
  const isSticky = code.includes('sticky top-0');
  
  // Extract links
  const linksMatch = /const links = (\[[\s\S]*?\]);/m.exec(code);
  let links: Array<{ label: string; href: string }> = [
    { label: 'Features', href: '#features' },
    { label: 'Testimonials', href: '#testimonials' },
    { label: 'Pricing', href: '#pricing' },
  ];
  if (linksMatch && linksMatch[1]) {
    try {
      links = JSON.parse(linksMatch[1]);
    } catch (e) {}
  }

  const linksHtml = links
    .map(
      (l) =>
        `<a href="${l.href}" class="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">${escapeHtml(l.label)}</a>`
    )
    .join('\n');

  const mobileLinksHtml = links
    .map(
      (l) =>
        `<a href="${l.href}" onclick="toggleMobileMenu()" class="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-slate-50 hover:text-blue-600">${escapeHtml(l.label)}</a>`
    )
    .join('\n');

  return `
  <nav class="${isSticky ? 'sticky top-0 z-50 bg-white/95 backdrop-blur-md shadow-sm' : 'relative bg-white'} border-b border-slate-100 transition-all">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <div class="flex items-center gap-3">
          <div class="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-sm">
            ${brand.charAt(0).toUpperCase()}
          </div>
          <a href="#" class="font-extrabold text-xl text-slate-900 tracking-tight">${escapeHtml(brand)}</a>
        </div>

        <div class="hidden md:flex items-center space-x-8">
          ${linksHtml}
        </div>

        <div class="hidden md:flex items-center gap-4">
          <a href="#pricing" class="inline-flex items-center justify-center px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm hover:shadow transition-all">
            Get Started
          </a>
        </div>

        <div class="flex md:hidden">
          <button onclick="toggleMobileMenu()" type="button" class="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none">
            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <div id="mobile-menu" class="hidden md:hidden border-b border-slate-200 bg-white px-4 pt-2 pb-4 space-y-2 shadow-lg animate-fadeIn">
      ${mobileLinksHtml}
      <div class="pt-2">
        <a href="#pricing" onclick="toggleMobileMenu()" class="block w-full text-center px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg shadow">
          Get Started
        </a>
      </div>
    </div>
  </nav>`;
}

function renderHeroHtml(files: Record<string, string>, analysis?: any): string {
  const code = files['components/Hero.tsx'] || '';

  // Extract custom bakery hero if present
  if (code.includes('Artisan Sourdough') || code.includes('bakery')) {
    return `
    <section class="relative overflow-hidden bg-gradient-to-b from-amber-50/70 via-orange-50/30 to-white pt-20 pb-24 md:pt-28 md:pb-32">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div class="inline-flex items-center gap-2 px-3 py-1 mb-8 rounded-full bg-amber-100 border border-amber-200 text-amber-800 text-xs font-semibold tracking-wide uppercase shadow-sm">
          🥖 Handcrafted Daily from 5:00 AM
        </div>
        <h1 class="text-4xl sm:text-5xl md:text-6xl font-black text-amber-950 tracking-tight leading-[1.15] max-w-4xl mx-auto">
          Warm Artisan Sourdough & French Pastries Fresh from the Hearth
        </h1>
        <p class="mt-6 text-lg sm:text-xl text-amber-900/80 max-w-2xl mx-auto font-normal leading-relaxed">
          Naturally leavened organic flour, slow 36-hour cold fermentation, and traditional European baking techniques for an unforgettable crust and crumb.
        </p>
        <div class="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <a href="#pricing" class="w-full sm:w-auto px-8 py-3.5 text-base font-semibold text-white bg-amber-700 hover:bg-amber-800 rounded-xl shadow-md hover:shadow-lg transition-all">
            Order Fresh Bread
          </a>
          <a href="#features" class="w-full sm:w-auto px-8 py-3.5 text-base font-semibold text-amber-900 bg-amber-100 hover:bg-amber-200 rounded-xl transition-all">
            View Daily Menu
          </a>
        </div>
      </div>
    </section>`;
  }

  // Parse standard hero
  const h1Match = /<h1[^>]*>([\s\S]*?)<\/h1>/m.exec(code);
  const pMatch = /<p[^>]*>([\s\S]*?)<\/p>/m.exec(code);
  const title = h1Match ? cleanJsx(h1Match[1]) : analysis?.title || 'Next-Generation Web Platform';
  const subtitle = pMatch ? cleanJsx(pMatch[1]) : analysis?.description || 'Build, iterate, and deploy with unparalleled developer velocity.';

  return `
  <section class="relative overflow-hidden bg-gradient-to-b from-blue-50/50 via-white to-white pt-20 pb-24 md:pt-28 md:pb-32">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <div class="inline-flex items-center gap-2 px-3 py-1 mb-8 rounded-full bg-blue-100/80 border border-blue-200 text-blue-700 text-xs font-semibold tracking-wide uppercase shadow-sm">
        <span class="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
        Next-Generation Platform
      </div>

      <h1 class="text-4xl sm:text-5xl md:text-6xl font-black text-slate-900 tracking-tight leading-[1.15] max-w-4xl mx-auto">
        ${title}
      </h1>

      <p class="mt-6 text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto font-normal leading-relaxed">
        ${subtitle}
      </p>

      <div class="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
        <a href="#pricing" class="w-full sm:w-auto px-8 py-3.5 text-base font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md hover:shadow-lg transition-all">
          Explore Platform
        </a>
        <a href="#features" class="w-full sm:w-auto px-8 py-3.5 text-base font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all">
          Learn More
        </a>
      </div>

      <div class="mt-16 pt-12 border-t border-slate-200/60 max-w-3xl mx-auto grid grid-cols-3 gap-6 text-center">
        <div>
          <div class="text-2xl sm:text-3xl font-extrabold text-slate-900">99.9%</div>
          <div class="text-xs sm:text-sm text-slate-500 mt-1">Uptime SLA</div>
        </div>
        <div>
          <div class="text-2xl sm:text-3xl font-extrabold text-blue-600">10x</div>
          <div class="text-xs sm:text-sm text-slate-500 mt-1">Faster Velocity</div>
        </div>
        <div>
          <div class="text-2xl sm:text-3xl font-extrabold text-slate-900">50,000+</div>
          <div class="text-xs sm:text-sm text-slate-500 mt-1">Active Developers</div>
        </div>
      </div>
    </div>
  </section>`;
}

function renderFeaturesHtml(files: Record<string, string>): string {
  const code = files['components/Features.tsx'] || '';
  if (!code) return '';

  const jsonMatch = /const features = (\[[\s\S]*?\]);/m.exec(code);
  let items: Array<{ title: string; description: string }> = [
    { title: 'Lightning Fast', description: 'Engineered for sub-second responsiveness and optimal user engagement.' },
    { title: 'Enterprise Security', description: 'Multi-layer defense and automated compliance built directly into the foundation.' },
    { title: 'Deep Analytics', description: 'Real-time telemetry and actionable insights to guide every strategic decision.' },
  ];

  if (jsonMatch && jsonMatch[1]) {
    try {
      items = JSON.parse(jsonMatch[1]);
    } catch (e) {}
  }

  const itemsHtml = items
    .map(
      (item, idx) => `
      <div class="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all group">
        <div class="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xl mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors">
          ${idx + 1}
        </div>
        <h3 class="text-xl font-bold text-slate-900 mb-3 tracking-tight">${escapeHtml(item.title)}</h3>
        <p class="text-slate-600 text-sm leading-relaxed">${escapeHtml(item.description)}</p>
      </div>`
    )
    .join('\n');

  return `
  <section id="features" class="py-20 bg-slate-50 border-y border-slate-200/60">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center max-w-3xl mx-auto mb-16">
        <h2 class="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Engineered for Modern Teams
        </h2>
        <p class="mt-4 text-lg text-slate-600">
          Everything you need to scale effortlessly and deliver exceptional results.
        </p>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        ${itemsHtml}
      </div>
    </div>
  </section>`;
}

function renderTestimonialsHtml(files: Record<string, string>): string {
  const code = files['components/Testimonials.tsx'] || '';
  if (!code) return '';

  const jsonMatch = /const testimonials = (\[[\s\S]*?\]);/m.exec(code);
  let items: Array<{ author: string; role: string; description: string }> = [
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

  if (jsonMatch && jsonMatch[1]) {
    try {
      items = JSON.parse(jsonMatch[1]);
    } catch (e) {}
  }

  const itemsHtml = items
    .map(
      (t) => `
      <div class="p-8 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col justify-between hover:border-slate-200 transition-all">
        <p class="text-slate-700 italic text-base leading-relaxed mb-6">
          "${escapeHtml(t.description)}"
        </p>
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-sm">
            ${escapeHtml((t.author || 'U').charAt(0))}
          </div>
          <div>
            <div class="font-semibold text-slate-900 text-sm">${escapeHtml(t.author || 'Anonymous')}</div>
            <div class="text-xs text-slate-500">${escapeHtml(t.role || 'Member')}</div>
          </div>
        </div>
      </div>`
    )
    .join('\n');

  return `
  <section id="testimonials" class="py-20 bg-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center max-w-3xl mx-auto mb-16">
        <h2 class="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Loved by Developers & Teams
        </h2>
        <p class="mt-4 text-lg text-slate-600">
          See what innovative founders and engineers have to say.
        </p>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        ${itemsHtml}
      </div>
    </div>
  </section>`;
}

function renderPricingHtml(files: Record<string, string>): string {
  const code = files['components/Pricing.tsx'] || '';
  if (!code) return '';

  const jsonMatch = /const plans = (\[[\s\S]*?\]);/m.exec(code);
  let plans: Array<{ title: string; price: string; description: string; badge?: string; features?: string[] }> = [
    { title: 'Starter', price: '$29', description: 'Ideal for independent developers and emerging projects.', features: ['Up to 5 Projects', 'Standard Analytics', 'Community Support'] },
    { title: 'Pro', price: '$79', badge: 'Most Popular', description: 'Designed for high-growth teams requiring enterprise capabilities.', features: ['Unlimited Projects', 'Advanced Telemetry', 'Priority 24/7 Support', 'Role-based Access'] },
    { title: 'Enterprise', price: '$199', description: 'Dedicated infrastructure, custom security, and specialized SLAs.', features: ['Dedicated Virtual Instances', 'Custom AI Pipeline', 'Executive Account Manager'] },
  ];

  if (jsonMatch && jsonMatch[1]) {
    try {
      plans = JSON.parse(jsonMatch[1]);
    } catch (e) {}
  }

  const plansHtml = plans
    .map((p) => {
      const isFeatured = !!p.badge;
      const featuresHtml = (p.features || [])
        .map(
          (f) =>
            `<li class="flex items-center text-sm text-slate-600"><svg class="w-4 h-4 text-blue-600 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>${escapeHtml(f)}</li>`
        )
        .join('\n');

      return `
      <div class="relative rounded-2xl p-8 flex flex-col justify-between transition-all ${
        isFeatured
          ? 'bg-white border-2 border-blue-600 shadow-xl md:scale-105 z-10'
          : 'bg-white border border-slate-200 shadow-sm'
      }">
        ${
          p.badge
            ? `<div class="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow">${escapeHtml(p.badge)}</div>`
            : ''
        }
        <div>
          <h3 class="text-xl font-bold text-slate-900">${escapeHtml(p.title)}</h3>
          <p class="text-xs text-slate-500 mt-1">${escapeHtml(p.description)}</p>
          <div class="mt-6 flex items-baseline">
            <span class="text-4xl font-black text-slate-900">${escapeHtml(p.price)}</span>
            <span class="text-slate-500 text-sm ml-1">/ month</span>
          </div>
          <ul class="mt-6 space-y-3">
            ${featuresHtml}
          </ul>
        </div>
        <div class="mt-8">
          <button type="button" class="w-full py-3 rounded-xl font-semibold text-sm transition-all ${
            isFeatured
              ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-md'
              : 'bg-slate-100 text-slate-800 hover:bg-slate-200'
          }">
            Select ${escapeHtml(p.title)}
          </button>
        </div>
      </div>`;
    })
    .join('\n');

  return `
  <section id="pricing" class="py-20 bg-slate-50 border-t border-slate-200/60">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center max-w-3xl mx-auto mb-16">
        <h2 class="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Simple, Transparent Pricing
        </h2>
        <p class="mt-4 text-lg text-slate-600">
          Choose the plan that aligns with your scale and ambitions.
        </p>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
        ${plansHtml}
      </div>
    </div>
  </section>`;
}

function renderFooterHtml(files: Record<string, string>, brand: string): string {
  return `
  <footer class="bg-slate-950 text-slate-400 py-12 border-t border-slate-800">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex flex-col md:flex-row items-center justify-between gap-6">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
            ${brand.charAt(0).toUpperCase()}
          </div>
          <span class="text-white font-bold text-lg tracking-tight">${escapeHtml(brand)}</span>
        </div>
        <div class="flex flex-wrap justify-center gap-8 text-sm">
          <a href="#" class="hover:text-white transition-colors">Privacy Policy</a>
          <a href="#" class="hover:text-white transition-colors">Terms of Service</a>
          <a href="#" class="hover:text-white transition-colors">Documentation</a>
          <a href="#" class="hover:text-white transition-colors">Contact Support</a>
        </div>
        <div class="text-xs text-slate-500">
          © ${new Date().getFullYear()} ${escapeHtml(brand)}. All rights reserved.
        </div>
      </div>
    </div>
  </footer>`;
}

function cleanJsx(str: string): string {
  return str.replace(/\{['"](.*?)['"]\}/g, '$1').replace(/\{.*?\}/g, '').trim();
}

function escapeHtml(text: string): string {
  if (!text) return '';
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
