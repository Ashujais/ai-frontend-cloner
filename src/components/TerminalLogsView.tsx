'use client';

import React from 'react';
import { Terminal, Check, Info, AlertTriangle, XCircle } from 'lucide-react';
import { LogEntry } from '../lib/types';

interface Props {
  logs: LogEntry[];
}

export default function TerminalLogsView({ logs }: Props) {
  return (
    <div className="bg-slate-950 rounded-2xl border border-slate-800 shadow-sm overflow-hidden flex flex-col h-64">
      <div className="bg-slate-900 px-4 py-2.5 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            Agent Execution Telemetry & Logs
          </span>
        </div>
        <span className="text-[10px] font-mono text-slate-500">{logs.length} events</span>
      </div>

      <div className="p-4 flex-grow overflow-y-auto font-mono text-xs space-y-1.5 bg-slate-950/95">
        {logs.length === 0 ? (
          <div className="text-slate-600 italic">Telemetry awaiting workflow trigger...</div>
        ) : (
          logs.map((log, idx) => {
            const time = new Date(log.timestamp).toLocaleTimeString();
            return (
              <div key={idx} className="flex items-start gap-2.5 leading-relaxed">
                <span className="text-slate-600 text-[10px] select-none flex-shrink-0">
                  [{time}]
                </span>
                <span
                  className={`text-[10px] uppercase font-bold px-1.5 rounded flex-shrink-0 ${
                    log.type === 'success'
                      ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/40'
                      : log.type === 'warn'
                      ? 'bg-amber-950 text-amber-400 border border-amber-800/40'
                      : log.type === 'error'
                      ? 'bg-rose-950 text-rose-400 border border-rose-800/40'
                      : 'bg-slate-900 text-blue-400 border border-slate-800'
                  }`}
                >
                  {log.stage}
                </span>
                <span
                  className={
                    log.type === 'success'
                      ? 'text-emerald-300'
                      : log.type === 'warn'
                      ? 'text-amber-300'
                      : log.type === 'error'
                      ? 'text-rose-300'
                      : 'text-slate-300'
                  }
                >
                  {log.message}
                </span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
