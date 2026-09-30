import { NextResponse } from 'next/server';
import { listAllProjects } from '@/lib/storage/manifest';

export async function GET() {
  const projects = listAllProjects();
  return NextResponse.json({ success: true, projects });
}
