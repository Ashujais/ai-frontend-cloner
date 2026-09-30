import { NextRequest, NextResponse } from 'next/server';
import { readManifest } from '@/lib/storage/manifest';
import { renderStandalonePreviewHtml } from '@/lib/agent/preview-manager';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const manifest = readManifest(id);

  if (!manifest) {
    return new NextResponse(
      `<!DOCTYPE html>
      <html>
        <head><title>Preview Not Found</title></head>
        <body style="font-family:sans-serif;padding:40px;text-align:center;">
          <h2>Project preview not available</h2>
          <p>The project "${id}" has not been generated or does not exist.</p>
        </body>
      </html>`,
      {
        status: 404,
        headers: { 'Content-Type': 'text/html' },
      }
    );
  }

  const html = renderStandalonePreviewHtml(manifest);
  return new NextResponse(html, {
    status: 200,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'X-Frame-Options': 'SAMEORIGIN',
    },
  });
}
