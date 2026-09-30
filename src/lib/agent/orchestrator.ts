import {
  ProjectManifest,
  ProjectState,
  WebsiteAnalysis,
  ValidationResult,
  LLMConfig,
} from '../types';
import { fetchWebsite } from './fetcher';
import { analyzeWebsite } from './analyzer';
import { generateFrontendCode } from './generator';
import { validateProjectFiles } from './validator';
import { runSelfHealingRepairLoop } from './repair';
import {
  readManifest,
  saveManifest,
  writeProjectFiles,
  addProjectLog,
  updateProjectState,
} from '../storage/manifest';

export interface WorkflowCallbacks {
  onProgress?: (stage: string, message: string, state: ProjectState) => void;
  onLog?: (stage: string, message: string, type: 'info' | 'warn' | 'error' | 'success') => void;
}

export async function runFullGenerationWorkflow(
  rawUrl: string,
  callbacks?: WorkflowCallbacks,
  projectId?: string
): Promise<ProjectManifest> {
  const id = projectId || Math.random().toString(36).substring(2, 9);
  const now = new Date().toISOString();

  const manifest: ProjectManifest = {
    id,
    sourceUrl: rawUrl,
    createdAt: now,
    updatedAt: now,
    state: 'CREATED',
    files: {},
    logs: [],
    changes: [],
    validation: { status: 'pending', errors: [], attemptCount: 0 },
    previewUrl: `/api/preview/${id}`,
  };

  saveManifest(manifest);

  const log = (stage: string, message: string, type: 'info' | 'warn' | 'error' | 'success' = 'info') => {
    addProjectLog(id, stage, message, type);
    callbacks?.onLog?.(stage, message, type);
  };

  const setProgress = (stage: string, message: string, state: ProjectState) => {
    updateProjectState(id, state);
    log(stage, message, 'info');
    callbacks?.onProgress?.(stage, message, state);
  };

  try {
    // Stage 1: Fetching website
    setProgress('Fetching website', `Connecting to ${rawUrl}...`, 'FETCHING');
    const fetchResult = await fetchWebsite(rawUrl);
    log('Fetching website', `Fetched ${fetchResult.html.length} bytes (HTTP ${fetchResult.statusCode})`, 'success');

    // Stage 2: Analyzing structure & Extracting assets
    setProgress('Analyzing structure', 'Parsing DOM hierarchy, typography, colors, and layout components...', 'ANALYZING');
    const analysis = await analyzeWebsite(fetchResult.html, fetchResult.url);
    log('Analyzing structure', `Discovered brand "${analysis.navigation.brand}" with ${analysis.sections.length} semantic sections`, 'success');

    // Stage 3 & 4: Understanding design
    setProgress('Understanding design', `Theme detected: ${analysis.theme.mode} mode, primary ${analysis.theme.primaryColor}`, 'ANALYZED');
    manifest.analysis = analysis;
    saveManifest(manifest);

    // Stage 5: Generating components
    setProgress('Generating components', 'Synthesizing Next.js pages, Tailwind styling, and responsive UI components...', 'GENERATING');
    const files = await generateFrontendCode(analysis);
    manifest.files = files;
    saveManifest(manifest);
    log('Generating components', `Generated ${Object.keys(files).length} project files.`, 'success');

    // Stage 6: Writing frontend files
    setProgress('Writing frontend files', `Saving project files to workspace/generated/project-${id}...`, 'GENERATED');
    writeProjectFiles(id, files);
    log('Writing frontend files', 'Files written to disk successfully.', 'success');

    // Stage 7: Running validation
    setProgress('Running validation', 'Checking TypeScript interfaces, imports, and JSX validity...', 'VALIDATING');
    let validation = validateProjectFiles(files);

    // Stage 8: Fixing errors (Self-healing repair loop)
    if (validation.status === 'failed') {
      setProgress('Fixing errors', `Found ${validation.errors.length} build/lint issue(s). Initiating AI self-healing...`, 'REPAIRING');
      const repairResult = await runSelfHealingRepairLoop(files, (stage, msg, type) => {
        log(stage, msg, type);
      });
      manifest.files = repairResult.files;
      validation = repairResult.validation;
      writeProjectFiles(id, repairResult.files);
    }

    manifest.validation = validation;
    if (validation.status === 'passed') {
      log('Running validation', 'Validation passed! Zero compiler/import errors.', 'success');
    } else {
      log('Running validation', `Validation completed with warnings: ${validation.errors.join('; ')}`, 'warn');
    }

    // Stage 9: Ready for preview
    manifest.state = 'READY';
    saveManifest(manifest);
    setProgress('Ready for preview', `Generated site ready at ${manifest.previewUrl}`, 'READY');

    return manifest;
  } catch (error: any) {
    manifest.state = 'FAILED';
    log('Workflow Failure', error.message, 'error');
    saveManifest(manifest);
    callbacks?.onProgress?.('Workflow Failure', error.message, 'FAILED');
    throw error;
  }
}
