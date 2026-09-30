import { NextRequest, NextResponse } from 'next/server';
import { runFullGenerationWorkflow } from '@/lib/agent/orchestrator';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { url, apiKey, provider } = body;

    if (!url || typeof url !== 'string') {
      return NextResponse.json({ error: 'A valid website URL is required.' }, { status: 400 });
    }

    // Set temporary environment overrides if provided by user in UI settings
    if (apiKey) {
      if (provider === 'openai') process.env.OPENAI_API_KEY = apiKey;
      else if (provider === 'anthropic') process.env.ANTHROPIC_API_KEY = apiKey;
      else if (provider === 'gemini') process.env.GOOGLE_API_KEY = apiKey;
    }
    if (provider) {
      process.env.LLM_PROVIDER = provider;
    }

    const manifest = await runFullGenerationWorkflow(url);
    return NextResponse.json({ success: true, manifest });
  } catch (error: any) {
    console.error('[API /api/generate] Error:', error);
    return NextResponse.json(
      {
        error: error.message || 'Failed to complete website recreation.',
        stage: 'Generation Pipeline',
      },
      { status: 500 }
    );
  }
}
