'use client';

import React from 'react';
import { WebsiteAnalysis } from '../lib/types';
import { Palette, Type, Layout, Image, Navigation, CheckCircle } from 'lucide-react';

interface Props {
  analysis?: WebsiteAnalysis | null;
}

export default function WebsiteAnalysisPanel({ analysis }: Props) {
  if (!analysis) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200/80 p-8 text-center text-slate-400">
        <Layout className="w-10 h-10 mx-auto mb-3 opacity-30" />
        <h3 className="text-sm font-semibold text-slate-600">No Website Analyzed Yet</h3>
        <p className="text-xs text-slate-400 mt-1">
          Enter a URL above to inspect the extracted DOM structure, color palette, and layout.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-6">
      <div className="flex items-start justify-between border-b border-slate-100 pb-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
            Discovered Structure
          </span>
          <h3 className="text-lg font-bold text-slate-900 mt-1.5 line-clamp-1">{analysis.title}</h3>
          <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{analysis.description}</p>
        </div>
      </div>

      {/* Colors & Palette */}
      <div>
        <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5 mb-2.5">
          <Palette className="w-3.5 h-3.5 text-blue-600" />
          Color System & Theme
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 border border-slate-200/60">
            <div
              className="w-6 h-6 rounded-md shadow-inner border border-black/10 flex-shrink-0"
              style={{ backgroundColor: analysis.theme.primaryColor }}
            />
            <div className="overflow-hidden">
              <div className="text-[10px] text-slate-400 font-medium">Primary</div>
              <div className="text-xs font-mono text-slate-700 truncate">{analysis.theme.primaryColor}</div>
            </div>
          </div>

          <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 border border-slate-200/60">
            <div
              className="w-6 h-6 rounded-md shadow-inner border border-black/10 flex-shrink-0"
              style={{ backgroundColor: analysis.theme.secondaryColor }}
            />
            <div className="overflow-hidden">
              <div className="text-[10px] text-slate-400 font-medium">Secondary</div>
              <div className="text-xs font-mono text-slate-700 truncate">{analysis.theme.secondaryColor}</div>
            </div>
          </div>

          <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 border border-slate-200/60">
            <div
              className="w-6 h-6 rounded-md shadow-inner border border-black/10 flex-shrink-0"
              style={{ backgroundColor: analysis.theme.backgroundColor }}
            />
            <div className="overflow-hidden">
              <div className="text-[10px] text-slate-400 font-medium">Background</div>
              <div className="text-xs font-mono text-slate-700 truncate">{analysis.theme.backgroundColor}</div>
            </div>
          </div>

          <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 border border-slate-200/60">
            <div
              className="w-6 h-6 rounded-md shadow-inner border border-black/10 flex-shrink-0"
              style={{ backgroundColor: analysis.theme.textColor }}
            />
            <div className="overflow-hidden">
              <div className="text-[10px] text-slate-400 font-medium">Text Color</div>
              <div className="text-xs font-mono text-slate-700 truncate">{analysis.theme.textColor}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div>
        <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5 mb-2.5">
          <Navigation className="w-3.5 h-3.5 text-blue-600" />
          Navigation Architecture
        </h4>
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/60 text-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="font-semibold text-slate-800">Brand: {analysis.navigation.brand}</span>
            <span className="text-[11px] text-slate-500">{analysis.navigation.links.length} menu items</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {analysis.navigation.links.map((link, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 bg-white border border-slate-200 text-slate-700 rounded-md font-medium text-[11px]"
              >
                {link.label}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Recreated Sections */}
      <div>
        <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5 mb-2.5">
          <Layout className="w-3.5 h-3.5 text-blue-600" />
          Semantic Sections ({analysis.sections.length})
        </h4>
        <div className="space-y-1.5">
          {analysis.sections.map((section, idx) => (
            <div
              key={section.id || idx}
              className="p-2.5 rounded-lg bg-slate-50/80 border border-slate-200/60 flex items-center justify-between text-xs"
            >
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-md bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-[10px]">
                  {idx + 1}
                </span>
                <span className="font-semibold text-slate-800 capitalize">{section.type}</span>
                {section.title && (
                  <span className="text-slate-500 truncate max-w-[200px] sm:max-w-xs">
                    — "{section.title}"
                  </span>
                )}
              </div>
              <span className="text-[10px] text-slate-400 font-mono">#{section.id}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Components & Responsive Info */}
      <div className="pt-2 border-t border-slate-100 grid grid-cols-2 gap-4 text-xs">
        <div>
          <div className="font-bold text-slate-700 mb-1 flex items-center gap-1">
            <Type className="w-3.5 h-3.5 text-blue-600" /> Typography
          </div>
          <div className="text-slate-500">{analysis.typography.headingFont}</div>
        </div>

        <div>
          <div className="font-bold text-slate-700 mb-1 flex items-center gap-1">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> Responsive
          </div>
          <div className="text-slate-500">
            {analysis.responsiveStructure.mobileMenu ? 'Mobile Menu Enabled' : 'Fixed Bar'}
          </div>
        </div>
      </div>
    </div>
  );
}
