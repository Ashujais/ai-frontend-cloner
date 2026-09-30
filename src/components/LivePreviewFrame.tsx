'use client';

import React, { useState } from 'react';
import {
  Monitor,
  Tablet,
  Smartphone,
  ExternalLink,
  RotateCw,
  Eye,
  CheckCircle2,
} from 'lucide-react';

interface Props {
  previewUrl?: string | null;
  projectId?: string | null;
}

type DeviceMode = 'desktop' | 'tablet' | 'mobile';

export default function LivePreviewFrame({ previewUrl, projectId }: Props) {
  const [device, setDevice] = useState<DeviceMode>('desktop');
  const [iframeKey, setIframeKey] = useState(0);

  const reloadIframe = () => {
    setIframeKey((prev) => prev + 1);
  };

  const getContainerWidth = () => {
    switch (device) {
      case 'mobile':
        return 'max-w-[375px]';
      case 'tablet':
        return 'max-w-[768px]';
      case 'desktop':
      default:
        return 'w-full';
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden flex flex-col h-[750px]">
      {/* Top Preview Controls Bar */}
      <div className="bg-slate-900 text-white px-4 py-3 flex flex-wrap items-center justify-between gap-3 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Live Preview
            </span>
          </div>

          {projectId && (
            <span className="hidden sm:inline-block text-[11px] font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
              project-{projectId}
            </span>
          )}
        </div>

        {/* Viewport Device Selectors */}
        <div className="flex items-center bg-slate-800 p-1 rounded-lg border border-slate-700/60">
          <button
            onClick={() => setDevice('desktop')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
              device === 'desktop'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Desktop (100%)"
          >
            <Monitor className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Desktop</span>
          </button>

          <button
            onClick={() => setDevice('tablet')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
              device === 'tablet'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Tablet (768px)"
          >
            <Tablet className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Tablet</span>
          </button>

          <button
            onClick={() => setDevice('mobile')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
              device === 'mobile'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Mobile (375px)"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Mobile</span>
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={reloadIframe}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
            title="Reload Preview"
          >
            <RotateCw className="w-3.5 h-3.5" />
          </button>

          {previewUrl && (
            <a
              href={previewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium shadow-sm transition-all"
            >
              <span>Open Tab</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>
      </div>

      {/* Frame Container */}
      <div className="flex-grow bg-slate-100/70 p-4 flex items-center justify-center overflow-auto">
        {previewUrl ? (
          <div
            className={`h-full transition-all duration-300 mx-auto shadow-2xl rounded-xl overflow-hidden border border-slate-300 bg-white ${getContainerWidth()}`}
          >
            <iframe
              key={iframeKey}
              src={previewUrl}
              title="Generated Frontend Website Preview"
              className="w-full h-full border-0"
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
            />
          </div>
        ) : (
          <div className="text-center text-slate-400 p-8">
            <Eye className="w-12 h-12 mx-auto mb-3 opacity-25" />
            <h4 className="text-sm font-semibold text-slate-600">Preview Not Ready</h4>
            <p className="text-xs text-slate-400 mt-1 max-w-sm">
              Enter a website URL and click Recreate Frontend to generate the React/Next.js application.
            </p>
          </div>
        )}
      </div>

      {/* Bottom Info Bar */}
      {previewUrl && (
        <div className="bg-slate-50 border-t border-slate-200 px-4 py-2 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Standalone Next.js App Serving</span>
          </div>
          <div className="font-mono text-[11px] text-slate-400">
            Viewport: {device.toUpperCase()}
          </div>
        </div>
      )}
    </div>
  );
}
