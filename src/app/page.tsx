'use client';

import React, { useState, useEffect } from 'react';
import DashboardHeader from '@/components/DashboardHeader';
import UrlInputBar from '@/components/UrlInputBar';
import ProgressTimeline from '@/components/ProgressTimeline';
import WebsiteAnalysisPanel from '@/components/WebsiteAnalysisPanel';
import LivePreviewFrame from '@/components/LivePreviewFrame';
import AiModifierPanel from '@/components/AiModifierPanel';
import FileChangesPanel from '@/components/FileChangesPanel';
import TerminalLogsView from '@/components/TerminalLogsView';
import SettingsModal from '@/components/SettingsModal';
import { ProjectManifest, ProjectState, LogEntry } from '@/lib/types';

export default function DashboardPage() {
  const [provider, setProvider] = useState<string>('gemini');
  const [apiKey, setApiKey] = useState<string>('');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [isModifying, setIsModifying] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [currentStage, setCurrentStage] = useState<string>('Ready for preview');
  const [projectState, setProjectState] = useState<ProjectState>('CREATED');

  const [manifest, setManifest] = useState<ProjectManifest | null>(null);
  const [logs, setLogs] = useState<LogEntry[]>([]);

  // Function to run full generation workflow
  const handleGenerate = async (url: string) => {
    setIsLoading(true);
    setErrorMessage(null);
    setProjectState('FETCHING');
    setCurrentStage('Fetching website');
    setLogs((prev) => [
      ...prev,
      {
        timestamp: new Date().toISOString(),
        stage: 'Fetching website',
        message: `Agent initiated extraction pipeline for "${url}"`,
        type: 'info',
      },
    ]);

    try {
      // Simulate progressive stage updates for UI responsiveness
      const stages = [
        { stage: 'Fetching website', state: 'FETCHING' as ProjectState, delay: 400 },
        { stage: 'Analyzing structure', state: 'ANALYZING' as ProjectState, delay: 1000 },
        { stage: 'Extracting assets', state: 'ANALYZING' as ProjectState, delay: 1600 },
        { stage: 'Understanding design', state: 'ANALYZED' as ProjectState, delay: 2200 },
        { stage: 'Generating components', state: 'GENERATING' as ProjectState, delay: 3000 },
        { stage: 'Writing frontend files', state: 'GENERATED' as ProjectState, delay: 3800 },
        { stage: 'Running validation', state: 'VALIDATING' as ProjectState, delay: 4400 },
      ];

      stages.forEach(({ stage, state, delay }) => {
        setTimeout(() => {
          setCurrentStage(stage);
          setProjectState(state);
        }, delay);
      });

      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, provider, apiKey: apiKey || undefined }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to recreate website.');
      }

      setManifest(data.manifest);
      setProjectState('READY');
      setCurrentStage('Ready for preview');
      setLogs((prev) => [
        ...prev,
        ...(data.manifest?.logs || []),
        {
          timestamp: new Date().toISOString(),
          stage: 'Ready for preview',
          message: `Generation complete! Project ${data.manifest.id} is ready.`,
          type: 'success',
        },
      ]);
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'An error occurred during generation.');
      setProjectState('FAILED');
      setLogs((prev) => [
        ...prev,
        {
          timestamp: new Date().toISOString(),
          stage: 'Workflow Failure',
          message: err.message || 'Workflow halted.',
          type: 'error',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to apply natural-language modification
  const handleApplyModification = async (instruction: string) => {
    if (!manifest) return;
    setIsModifying(true);
    setErrorMessage(null);
    setCurrentStage('AI Modification');
    setLogs((prev) => [
      ...prev,
      {
        timestamp: new Date().toISOString(),
        stage: 'AI Modification',
        message: `User requested: "${instruction}"`,
        type: 'info',
      },
    ]);

    try {
      const res = await fetch('/api/modify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId: manifest.id,
          instruction,
          provider,
          apiKey: apiKey || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to apply modification.');
      }

      setManifest(data.manifest);
      setLogs((prev) => [
        ...prev,
        {
          timestamp: new Date().toISOString(),
          stage: 'AI Modification',
          message: `Modified: ${data.changedFiles?.join(', ')}. Plan: ${data.plan?.explanation}`,
          type: 'success',
        },
      ]);
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'An error occurred during modification.');
      setLogs((prev) => [
        ...prev,
        {
          timestamp: new Date().toISOString(),
          stage: 'AI Modification',
          message: err.message,
          type: 'error',
        },
      ]);
    } finally {
      setIsModifying(false);
      setCurrentStage('Ready for preview');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-100/60 text-slate-900">
      <DashboardHeader
        provider={provider}
        onOpenSettings={() => setIsSettingsOpen(true)}
        activeProjectCount={manifest ? 1 : 0}
      />

      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 flex-grow">
        {/* URL Input Bar */}
        <UrlInputBar
          onGenerate={handleGenerate}
          isLoading={isLoading}
          errorMessage={errorMessage}
        />

        {/* 9-Stage Progress Workflow Timeline */}
        <ProgressTimeline currentStage={currentStage} state={projectState} />

        {/* Core Workspace: Analysis Panel & Live Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Website Analysis */}
          <div className="lg:col-span-5 space-y-6">
            <WebsiteAnalysisPanel analysis={manifest?.analysis} />
          </div>

          {/* Right Column: Live Responsive Preview Frame */}
          <div className="lg:col-span-7 space-y-6">
            <LivePreviewFrame
              previewUrl={manifest?.previewUrl}
              projectId={manifest?.id}
            />
          </div>
        </div>

        {/* Natural-Language AI Modification Engine */}
        <AiModifierPanel
          onApplyModification={handleApplyModification}
          isModifying={isModifying}
          disabled={!manifest || isLoading}
        />

        {/* File Changes, Code Inspection & Validation Audit */}
        <FileChangesPanel
          changes={manifest?.changes || []}
          files={manifest?.files || {}}
          validation={manifest?.validation}
        />

        {/* Real-time Telemetry Terminal Logs */}
        <TerminalLogsView logs={logs} />
      </main>

      <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500">
        Autonomous AI Frontend Website Cloning Agent • Built with Next.js, TypeScript & Tailwind CSS
      </footer>

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        currentProvider={provider}
        onSave={(newProvider, newKey) => {
          setProvider(newProvider);
          if (newKey) setApiKey(newKey);
        }}
      />
    </div>
  );
}
