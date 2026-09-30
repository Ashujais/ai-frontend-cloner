'use client';

import React from 'react';
import { Sparkles, Settings, ExternalLink, Bot, CheckCircle2 } from 'lucide-react';

interface Props {
  provider: string;
  onOpenSettings: () => void;
  activeProjectCount: number;
}

export default function DashboardHeader({ provider, onOpenSettings, activeProjectCount }: Props) {
  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight flex items-center gap-2">
              Autonomous Frontend Cloning Agent
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                v1.0 MVP
              </span>
            </h1>
            <p className="text-xs text-slate-400">
              Analyze unfamiliar websites • Generate responsive React/Next.js • Self-heal • Natural-language modify
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700/60 text-xs">
            <Bot className="w-3.5 h-3.5 text-blue-400" />
            <span className="text-slate-400">AI Engine:</span>
            <span className="font-semibold text-slate-200 capitalize">{provider}</span>
          </div>

          <button
            onClick={onOpenSettings}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-medium text-slate-300 transition-colors"
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Config</span>
          </button>
        </div>
      </div>
    </header>
  );
}
