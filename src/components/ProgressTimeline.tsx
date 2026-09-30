'use client';

import React from 'react';
import {
  CheckCircle2,
  Circle,
  Loader2,
  AlertCircle,
  Search,
  Layers,
  Palette,
  Code2,
  FileCheck2,
  Wrench,
  Eye,
} from 'lucide-react';
import { ProjectState } from '../lib/types';

interface Props {
  currentStage: string;
  state: ProjectState;
}

const STAGES = [
  { key: 'Fetching website', label: '1. Fetching website', icon: Search },
  { key: 'Analyzing structure', label: '2. Analyzing structure', icon: Layers },
  { key: 'Extracting assets', label: '3. Extracting assets', icon: Layers },
  { key: 'Understanding design', label: '4. Understanding design', icon: Palette },
  { key: 'Generating components', label: '5. Generating components', icon: Code2 },
  { key: 'Writing frontend files', label: '6. Writing frontend files', icon: Code2 },
  { key: 'Running validation', label: '7. Running validation', icon: FileCheck2 },
  { key: 'Fixing errors', label: '8. Fixing errors', icon: Wrench },
  { key: 'Ready for preview', label: '9. Ready for preview', icon: Eye },
];

export default function ProgressTimeline({ currentStage, state }: Props) {
  // Determine index of current stage
  const currentIndex = STAGES.findIndex((s) => s.key === currentStage);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
          Agent Workflow Execution
        </h2>
        <span
          className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
            state === 'READY'
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
              : state === 'FAILED'
              ? 'bg-rose-50 text-rose-700 border border-rose-200'
              : state === 'CREATED'
              ? 'bg-slate-100 text-slate-600'
              : 'bg-blue-50 text-blue-700 border border-blue-200 animate-pulse'
          }`}
        >
          {state}
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-9 gap-2">
        {STAGES.map((stage, idx) => {
          const isDone = state === 'READY' || (currentIndex !== -1 && idx < currentIndex);
          const isCurrent = idx === currentIndex && state !== 'READY' && state !== 'FAILED';
          const isFailed = state === 'FAILED' && idx === currentIndex;
          const Icon = stage.icon;

          return (
            <div
              key={stage.key}
              className={`p-3 rounded-xl border flex flex-col items-center text-center transition-all ${
                isDone
                  ? 'bg-emerald-50/50 border-emerald-200 text-emerald-900'
                  : isCurrent
                  ? 'bg-blue-50 border-blue-300 text-blue-900 shadow-sm ring-2 ring-blue-500/20'
                  : isFailed
                  ? 'bg-rose-50 border-rose-300 text-rose-900'
                  : 'bg-slate-50/60 border-slate-200/70 text-slate-400'
              }`}
            >
              <div className="mb-2">
                {isDone ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                ) : isCurrent ? (
                  <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
                ) : isFailed ? (
                  <AlertCircle className="w-5 h-5 text-rose-600" />
                ) : (
                  <Circle className="w-5 h-5 text-slate-300" />
                )}
              </div>
              <span className="text-[11px] font-medium leading-tight">
                {stage.label.split('. ')[1]}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
