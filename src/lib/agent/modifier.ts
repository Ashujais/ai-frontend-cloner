import { ModificationPlan, ValidationResult } from '../types';
import { callLLMJson } from '../llm/provider';
import { MODIFICATION_SYSTEM_PROMPT, buildModificationUserPrompt } from '../llm/prompts/modify';
import { validateProjectFiles } from './validator';
import { runSelfHealingRepairLoop } from './repair';
import { synthesizeSmartModification } from '../llm/smart-engine';

export interface ModificationResult {
  plan: ModificationPlan;
  files: Record<string, string>;
  changedFiles: string[];
  validation: ValidationResult;
}

export async function modifyGeneratedProject(
  instruction: string,
  currentFiles: Record<string, string>,
  summaryOfComponents: string[] = ['Navbar', 'Hero', 'Features', 'Testimonials', 'Pricing', 'Footer']
): Promise<ModificationResult> {
  const userPrompt = buildModificationUserPrompt(instruction, currentFiles, summaryOfComponents);

  let response: { plan: ModificationPlan; modifiedFiles: Record<string, string> };

  try {
    response = await callLLMJson<{ plan: ModificationPlan; modifiedFiles: Record<string, string> }>(
      MODIFICATION_SYSTEM_PROMPT,
      userPrompt
    );

    if (!response || !response.modifiedFiles || Object.keys(response.modifiedFiles).length === 0) {
      throw new Error('LLM did not return any modified files.');
    }
  } catch (err: any) {
    console.warn(`[Modifier] Falling back to smart modification synthesis: ${err.message}`);
    response = synthesizeSmartModification(userPrompt);
  }

  // Merge ONLY modified files into the project (Preserves all other files!)
  const updatedFiles = { ...currentFiles };
  const changedFiles: string[] = [];

  for (const [filePath, content] of Object.entries(response.modifiedFiles)) {
    if (content && typeof content === 'string') {
      updatedFiles[filePath] = content;
      changedFiles.push(filePath);
    }
  }

  // Run validation on the merged project
  let validation = validateProjectFiles(updatedFiles);

  if (validation.status === 'failed') {
    const repaired = await runSelfHealingRepairLoop(updatedFiles);
    validation = repaired.validation;
    Object.assign(updatedFiles, repaired.files);
  }

  return {
    plan: response.plan,
    files: updatedFiles,
    changedFiles,
    validation,
  };
}
