import fs from 'fs';
import path from 'path';
import { ProjectManifest, ProjectState, WebsiteAnalysis, ChangeRecord, ValidationResult } from '../types';

const WORKSPACE_BASE = process.env.WORKSPACE_DIR || 'workspace/generated';

export function getProjectDir(id: string): string {
  const dir = path.resolve(process.cwd(), WORKSPACE_BASE, `project-${id}`);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  return dir;
}

export function getManifestPath(id: string): string {
  return path.join(getProjectDir(id), 'generation.json');
}

export function readManifest(id: string): ProjectManifest | null {
  const file = getManifestPath(id);
  if (!fs.existsSync(file)) return null;
  try {
    const raw = fs.readFileSync(file, 'utf-8');
    return JSON.parse(raw) as ProjectManifest;
  } catch (e) {
    console.error(`Failed to read manifest for ${id}:`, e);
    return null;
  }
}

export function saveManifest(manifest: ProjectManifest): void {
  const projectDir = getProjectDir(manifest.id);
  const file = path.join(projectDir, 'generation.json');
  manifest.updatedAt = new Date().toISOString();
  fs.writeFileSync(file, JSON.stringify(manifest, null, 2), 'utf-8');
}

export function writeProjectFiles(id: string, files: Record<string, string>): void {
  const projectDir = getProjectDir(id);
  for (const [relativePath, content] of Object.entries(files)) {
    const fullPath = path.join(projectDir, relativePath);
    const parentDir = path.dirname(fullPath);
    if (!fs.existsSync(parentDir)) {
      fs.mkdirSync(parentDir, { recursive: true });
    }
    fs.writeFileSync(fullPath, content, 'utf-8');
  }
}

export function addProjectLog(
  id: string,
  stage: string,
  message: string,
  type: 'info' | 'warn' | 'error' | 'success' = 'info'
): void {
  const manifest = readManifest(id);
  if (!manifest) return;
  manifest.logs.push({
    timestamp: new Date().toISOString(),
    stage,
    message,
    type,
  });
  saveManifest(manifest);
}

export function updateProjectState(id: string, state: ProjectState): void {
  const manifest = readManifest(id);
  if (!manifest) return;
  manifest.state = state;
  saveManifest(manifest);
}

export function listAllProjects(): Array<{ id: string; sourceUrl: string; createdAt: string; state: ProjectState }> {
  const baseDir = path.resolve(process.cwd(), WORKSPACE_BASE);
  if (!fs.existsSync(baseDir)) return [];
  const entries = fs.readdirSync(baseDir, { withFileTypes: true });
  const results: Array<{ id: string; sourceUrl: string; createdAt: string; state: ProjectState }> = [];

  for (const entry of entries) {
    if (entry.isDirectory() && entry.name.startsWith('project-')) {
      const id = entry.name.replace('project-', '');
      const manifest = readManifest(id);
      if (manifest) {
        results.push({
          id: manifest.id,
          sourceUrl: manifest.sourceUrl,
          createdAt: manifest.createdAt,
          state: manifest.state,
        });
      }
    }
  }

  return results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}
