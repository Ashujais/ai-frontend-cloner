import { NextRequest, NextResponse } from 'next/server';
import { readManifest, saveManifest, writeProjectFiles, addProjectLog } from '@/lib/storage/manifest';
import { modifyGeneratedProject } from '@/lib/agent/modifier';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { projectId, instruction, apiKey, provider } = body;

    if (!projectId || !instruction) {
      return NextResponse.json({ error: 'Missing projectId or instruction.' }, { status: 400 });
    }

    if (apiKey) {
      if (provider === 'openai') process.env.OPENAI_API_KEY = apiKey;
      else if (provider === 'anthropic') process.env.ANTHROPIC_API_KEY = apiKey;
      else if (provider === 'gemini') process.env.GOOGLE_API_KEY = apiKey;
    }
    if (provider) {
      process.env.LLM_PROVIDER = provider;
    }

    const manifest = readManifest(projectId);
    if (!manifest) {
      return NextResponse.json({ error: `Project "${projectId}" not found.` }, { status: 404 });
    }

    addProjectLog(
      projectId,
      'AI Modification',
      `Analyzing modification request: "${instruction}"`,
      'info'
    );

    const modificationResult = await modifyGeneratedProject(
      instruction,
      manifest.files,
      manifest.analysis?.components || ['Navbar', 'Hero', 'Features', 'Testimonials', 'Pricing', 'Footer']
    );

    // Update manifest
    manifest.files = modificationResult.files;
    manifest.validation = modificationResult.validation;
    manifest.changes.unshift({
      timestamp: new Date().toISOString(),
      instruction,
      changedFiles: modificationResult.changedFiles,
      plan: modificationResult.plan.stepByStepPlan.join('; '),
      explanation: modificationResult.plan.explanation,
    });

    writeProjectFiles(projectId, modificationResult.files);
    saveManifest(manifest);

    addProjectLog(
      projectId,
      'AI Modification',
      `Modified files: ${modificationResult.changedFiles.join(', ')}. Validation: ${manifest.validation.status}.`,
      'success'
    );

    return NextResponse.json({
      success: true,
      manifest,
      plan: modificationResult.plan,
      changedFiles: modificationResult.changedFiles,
    });
  } catch (error: any) {
    console.error('[API /api/modify] Error:', error);
    return NextResponse.json({ error: error.message || 'Failed to modify code.' }, { status: 500 });
  }
}
