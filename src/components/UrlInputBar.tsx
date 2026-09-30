'use client';

import React, { useState } from 'react';
import { Globe, ArrowRight, Loader2, AlertCircle } from 'lucide-react';

interface Props {
  onGenerate: (url: string) => void;
  isLoading: boolean;
  errorMessage?: string | null;
}

const PRESET_URLS = [
  { label: 'Example Domain (Minimal)', url: 'https://example.com' },
  { label: 'Hacker News (Content)', url: 'https://news.ycombinator.com' },
  { label: 'HTTPBin (Service)', url: 'https://httpbin.org' },
];

export default function UrlInputBar({ onGenerate, isLoading, errorMessage }: Props) {
  const [url, setUrl] = useState('https://example.com');
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    if (!url.trim()) {
      setLocalError('Please enter a website URL.');
      return;
    }

    try {
      let normalized = url.trim();
      if (!normalized.startsWith('http://') && !normalized.startsWith('https://')) {
        normalized = `https://${normalized}`;
      }
      new URL(normalized);
      onGenerate(normalized);
    } catch {
      setLocalError('Invalid URL format. Please enter a valid HTTP/HTTPS web address.');
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
      <form onSubmit={handleSubmit}>
        <label className="block text-sm font-semibold text-slate-800 mb-2">
          Target Website URL to Recreate
        </label>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Globe className="w-5 h-5" />
            </div>
            <input
              type="text"
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
                setLocalError(null);
              }}
              disabled={isLoading}
              placeholder="https://example.com or any public website..."
              className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-slate-900 bg-slate-50/50 hover:bg-white transition-all disabled:opacity-60"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-sm hover:shadow transition-all disabled:opacity-60 disabled:pointer-events-none"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Recreating Site...</span>
              </>
            ) : (
              <>
                <span>Recreate Frontend</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>

        {/* Quick presets */}
        <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-500">
          <span className="font-medium">Quick Test Sites:</span>
          {PRESET_URLS.map((preset) => (
            <button
              key={preset.url}
              type="button"
              disabled={isLoading}
              onClick={() => {
                setUrl(preset.url);
                setLocalError(null);
              }}
              className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition-colors"
            >
              {preset.label}
            </button>
          ))}
        </div>

        {(localError || errorMessage) && (
          <div className="mt-4 p-3 rounded-xl bg-rose-50 border border-rose-200 flex items-center gap-2.5 text-rose-700 text-sm">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{localError || errorMessage}</span>
          </div>
        )}
      </form>
    </div>
  );
}
