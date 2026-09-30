import React from 'react';

const plans = [{"title":"Starter","price":"$29","description":"Ideal for independent developers and emerging projects.","features":["Up to 5 Projects","Standard Analytics","Community Support","99.9% Uptime SLA"]},{"title":"Pro","price":"$79","badge":"Most Popular","description":"Designed for high-growth teams requiring enterprise capabilities.","features":["Unlimited Projects","Advanced Telemetry","Priority 24/7 Support","Custom Integrations","Role-based Access"]},{"title":"Enterprise","price":"$199","description":"Dedicated infrastructure, custom security, and specialized SLAs.","features":["Dedicated Virtual Instances","Custom AI Pipeline","Executive Account Manager","Custom Compliance Audits"]}];

export default function Pricing() {
  return (
    <section id="pricing" className="py-20 bg-slate-50 border-t border-slate-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Simple, Transparent Pricing
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            Choose the plan that aligns with your scale and ambitions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {plans.map((plan, idx) => {
            const isFeatured = !!plan.badge;
            return (
              <div
                key={idx}
                className={`relative rounded-2xl p-8 flex flex-col justify-between transition-all ${
                  isFeatured
                    ? 'bg-white border-2 border-blue-600 shadow-xl scale-105 z-10'
                    : 'bg-white border border-slate-200 shadow-sm'
                }`}
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
                    className={`w-full py-3 rounded-xl font-semibold text-sm transition-all ${
                      isFeatured
                        ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-md'
                        : 'bg-slate-100 text-slate-800 hover:bg-slate-200'
                    }`}
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
