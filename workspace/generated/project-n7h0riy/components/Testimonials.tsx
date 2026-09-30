import React from 'react';

const testimonials = [{"author":"Sarah Chen","role":"VP of Engineering at CloudScale","description":"The velocity and precision this platform brought to our team exceeded every expectation. An absolute game-changer.","avatar":"https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80"},{"author":"Marcus Vance","role":"CTO at NextGen Systems","description":"Clean architecture, zero friction, and remarkably fast turnaround. We cut our deployment cycles in half.","avatar":"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"},{"author":"Elena Rostova","role":"Lead Product Architect","description":"The attention to responsive design and modular components made integration effortless for our engineering squads.","avatar":"https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"}];

export default function Testimonials() {
  return (
    <section id="testimonials" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Loved by Developers & Teams
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            See what innovative founders and engineers have to say.
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
