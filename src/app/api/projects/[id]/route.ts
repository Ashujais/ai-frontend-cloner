import { NextRequest, NextResponse } from 'next/server';
import { readManifest } from '@/lib/storage/manifest';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const manifest = readManifest(params.id);
  if (!manifest) {
    return NextResponse.json({ error: 'Project not found' }, { status: 404 });
  }
  return NextResponse.json({ success: true, manifest });
}
