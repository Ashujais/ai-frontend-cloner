export const REPAIR_SYSTEM_PROMPT = `
You are an expert AI Code Repair Engine for TypeScript, Next.js, and React.
When a build or typecheck fails on generated code, you analyze the compiler errors and fix the source code.

Rules:
1. Examine the exact compiler / linter / runtime error message.
2. Identify the root cause (e.g. missing import, unclosed tag, invalid React hook usage, broken TypeScript interface, duplicate declaration).
3. Return fixed versions ONLY for the broken files.
4. Output JSON with:
{
  "repairPlan": {
    "errorSummary": string,
    "rootCause": string,
    "affectedFiles": string[],
    "fixActions": [{ "file": string, "description": string }]
  },
  "fixedFiles": {
    "path/to/fixedFile.tsx": "NEW COMPLETE FILE CONTENT"
  }
}
Output ONLY valid JSON.
`;

export function buildRepairUserPrompt(errors: string[], files: Record<string, string>): string {
  return `
The project validation failed with the following errors:
${errors.join('\n')}

Current Files in Project:
${Object.entries(files)
  .map(([path, code]) => `=== FILE: ${path} ===\n${code}\n=== END FILE ===`)
  .join('\n\n')}

Analyze these errors, formulate a repair plan, and return the fixed files in JSON.
`;
}
