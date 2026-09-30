'use client';

import React, { useState } from 'react';
import { Wand2, Loader2, Sparkles, Send } from 'lucide-react';

interface Props {
  onApplyModification: (instruction: string) => void;
  isModifying: boolean;
  disabled: boolean;
}

const EXAMPLE_PROMPTS = [
  'Change the primary color to blue.',
  'Make the navbar sticky.',
  'Replace the hero section with a bakery hero.',
  'Remove the pricing section.',
  'Use a dark theme.',
  'Make the buttons rounded.',
];

export default function AiModifierPanel({ onApplyModification, isModifying, disabled }: Props) {
  const [instruction, setInstruction] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!instruction.trim() || disabled || isModifying) return;
    onApplyModification(instruction.trim());
    setInstruction('');
  };

  const handleSelectExample = (prompt: string) => {
    setInstruction(prompt);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
          <Wand2 className="w-4 h-4" />
        </div>
        <h3 className="text-sm font-bold text-slate-800">
          Natural-Language AI Modification Engine
        </h3>
      </div>
      <p className="text-xs text-slate-500 mb-4">
        Instruct the agent to modify styles, components, or layout. The agent creates an architectural plan and updates only the necessary files.
      </p>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="relative">
          <textarea
            value={instruction}
            onChange={(e) => setInstruction(e.target.value)}
            disabled={disabled || isModifying}
            rows={3}
            placeholder="Tell the AI what you want to change (e.g. 'Make the navbar sticky and change the primary color to blue')..."
            className="w-full p-3.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm text-slate-900 bg-slate-50/50 hover:bg-white transition-all disabled:opacity-50 resize-none"
          />
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Quick Prompt Suggestions */}
          <div className="flex flex-wrap gap-1.5 items-center">
            <span className="text-[11px] font-medium text-slate-400 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-indigo-500" /> Suggestions:
            </span>
            {EXAMPLE_PROMPTS.slice(0, 4).map((ex) => (
              <button
                key={ex}
                type="button"
                disabled={disabled || isModifying}
                onClick={() => handleSelectExample(ex)}
                className="text-[11px] px-2 py-0.5 rounded-md bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-600 transition-colors disabled:opacity-40"
              >
                {ex}
              </button>
            ))}
          </div>

          <button
            type="submit"
            disabled={disabled || isModifying || !instruction.trim()}
            className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-sm hover:shadow transition-all disabled:opacity-50 disabled:pointer-events-none self-end sm:self-auto"
          >
            {isModifying ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Applying AI Changes...</span>
              </>
            ) : (
              <>
                <span>Apply Change</span>
                <Send className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
