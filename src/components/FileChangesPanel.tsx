'use client';

import React, { useState } from 'react';
import { ChangeRecord, ValidationResult } from '../lib/types';
import { FileCode, CheckCircle2, AlertTriangle, FileText, ChevronRight } from 'lucide-react';

interface Props {
  changes: ChangeRecord[];
  files: Record<string, string>;
  validation?: ValidationResult;
}

export default function FileChangesPanel({ changes, files, validation }: Props) {
  const [selectedFile, setSelectedFile] = useState<string | null>(
    Object.keys(files)[0] || null
  );

  const fileList = Object.keys(files);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden flex flex-col">
      <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileCode className="w-4 h-4 text-blue-600" />
          <h3 className="text-sm font-bold text-slate-800">
            Generated Code & Modifications Audit
          </h3>
        </div>

        {/* Validation Status Badge */}
        {validation && (
          <div
            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
              validation.status === 'passed'
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : 'bg-amber-50 text-amber-700 border border-amber-200'
            }`}
          >
            {validation.status === 'passed' ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Build Validation Passed</span>
              </>
            ) : (
              <>
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                <span>Validation Repaired</span>
              </>
            )}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 flex-grow min-h-[350px]">
        {/* Left Column: Recent Changes & File Tree */}
        <div className="md:col-span-4 border-r border-slate-100 p-4 space-y-4 bg-slate-50/50">
          {/* Recent AI Modification History */}
          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
              Recent AI Modifications ({changes.length})
            </h4>
            {changes.length === 0 ? (
              <div className="text-xs text-slate-400 italic py-2">
                No modifications applied yet.
              </div>
            ) : (
              <div className="space-y-2">
                {changes.slice(0, 3).map((change, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-xl bg-white border border-slate-200/80 text-xs shadow-xs"
                  >
                    <div className="font-semibold text-slate-800 mb-1">
                      "{change.instruction}"
                    </div>
                    <div className="text-[11px] text-slate-500 mb-1.5">
                      {change.explanation}
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {change.changedFiles.map((file) => (
                        <span
                          key={file}
                          className="px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 font-mono text-[10px]"
                        >
                          {file}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Project File Tree */}
          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
              Generated Files ({fileList.length})
            </h4>
            <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
              {fileList.map((file) => (
                <button
                  key={file}
                  onClick={() => setSelectedFile(file)}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-mono flex items-center justify-between transition-colors ${
                    selectedFile === file
                      ? 'bg-blue-600 text-white font-medium'
                      : 'text-slate-600 hover:bg-slate-200/60'
                  }`}
                >
                  <span className="truncate">{file}</span>
                  <ChevronRight className="w-3 h-3 flex-shrink-0 opacity-50" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Code Viewer */}
        <div className="md:col-span-8 flex flex-col bg-slate-950 text-slate-200">
          <div className="px-4 py-2 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-xs">
            <span className="font-mono text-slate-400">
              {selectedFile || 'Select a file to inspect'}
            </span>
            <span className="text-[10px] text-slate-500">Read-Only Source Preview</span>
          </div>

          <div className="p-4 flex-grow overflow-auto font-mono text-xs leading-relaxed max-h-[380px]">
            {selectedFile && files[selectedFile] ? (
              <pre className="text-emerald-400 whitespace-pre-wrap">{files[selectedFile]}</pre>
            ) : (
              <div className="text-slate-600 italic">No file selected.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
