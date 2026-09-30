import { ValidationResult, RepairPlan } from '../types';
import { callLLMJson } from '../llm/provider';
import { REPAIR_SYSTEM_PROMPT, buildRepairUserPrompt } from '../llm/prompts/repair';
import { validateProjectFiles } from './validator';
import { synthesizeSmartRepair } from '../llm/smart-engine';

const MAX_REPAIR_ATTEMPTS = Number(process.env.MAX_REPAIR_ATTEMPTS) || 3;

export async function runSelfHealingRepairLoop(
  initialFiles: Record<string, string>,
  onLog?: (stage: string, message: string, type: 'info' | 'warn' | 'error' | 'success') => void
): Promise<{ files: Record<string, string>; validation: ValidationResult }> {
  let currentFiles = { ...initialFiles };
  let validation = validateProjectFiles(currentFiles);
  let attempt = 0;

  while (validation.status === 'failed' && attempt < MAX_REPAIR_ATTEMPTS) {
    attempt++;
    onLog?.(
      'Fixing errors',
      `Validation identified ${validation.errors.length} issue(s). Initiating repair cycle ${attempt}/${MAX_REPAIR_ATTEMPTS}...`,
      'warn'
    );

    // Apply rule-based auto fixes first (fast and deterministic)
    let autoFixed = false;
    for (const error of validation.errors) {
      if (error.includes("without 'use client' directive")) {
        const fileMatch = /In "([^"]+)"/.exec(error);
        if (fileMatch && fileMatch[1] && currentFiles[fileMatch[1]]) {
          currentFiles[fileMatch[1]] = `'use client';\n\n${currentFiles[fileMatch[1]]}`;
          autoFixed = true;
          onLog?.('Fixing errors', `Injected 'use client' into ${fileMatch[1]}`, 'info');
        }
      }
    }

    if (autoFixed) {
      validation = validateProjectFiles(currentFiles);
      if (validation.status === 'passed') {
        onLog?.('Fixing errors', `Automatic deterministic repairs resolved all issues.`, 'success');
        break;
      }
    }

    // Call LLM Repair Engine
    const userPrompt = buildRepairUserPrompt(validation.errors, currentFiles);
    try {
      const response = await callLLMJson<{ repairPlan: RepairPlan; fixedFiles: Record<string, string> }>(
        REPAIR_SYSTEM_PROMPT,
        userPrompt
      );

      if (response && response.fixedFiles && Object.keys(response.fixedFiles).length > 0) {
        for (const [filePath, content] of Object.entries(response.fixedFiles)) {
          currentFiles[filePath] = content;
          onLog?.('Fixing errors', `Applied AI repair to ${filePath}: ${response.repairPlan?.errorSummary || 'Fixed'}`, 'info');
        }
      }
    } catch (llmErr: any) {
      onLog?.('Fixing errors', `LLM repair error (${llmErr.message}). Applying fallback repair synthesis.`, 'warn');
      const fallback = synthesizeSmartRepair(userPrompt);
      for (const [filePath, content] of Object.entries(fallback.fixedFiles)) {
        currentFiles[filePath] = content;
      }
    }

    validation = validateProjectFiles(currentFiles);
    validation.attemptCount = attempt;
  }

  return { files: currentFiles, validation };
}
