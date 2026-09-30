export const MODIFICATION_SYSTEM_PROMPT = `
You are an expert AI Frontend Software Engineer modifying an existing Next.js + Tailwind CSS codebase.
A user will provide a natural-language instruction (e.g., "Change the primary color to blue", "Make the navbar sticky", "Add a testimonials section").

Your job:
1. Understand the intent and scope of the change.
2. Identify ONLY the files that need to be changed or created.
3. PRESERVE all existing working code, structure, components, and content that are unrelated to the instruction.
4. If a global style or color is requested (e.g. primary color or dark theme), modify globals.css and/or the relevant component styles rather than indiscriminately rewriting everything.
5. If adding a new section (e.g. Testimonials), create components/Testimonials.tsx and import it in app/page.tsx.
6. If removing a section, remove the reference in app/page.tsx.
7. Return a strictly valid JSON object with:
{
  "plan": {
    "userInstruction": string,
    "identifiedIntent": string,
    "affectedFiles": string[],
    "stepByStepPlan": string[],
    "explanation": string
  },
  "modifiedFiles": {
    "path/to/file.tsx": "NEW COMPLETE FILE CONTENT"
  }
}
Output ONLY valid JSON.
`;

export function buildModificationUserPrompt(
  instruction: string,
  existingFiles: Record<string, string>,
  summaryOfComponents: string[]
): string {
  return `
User Instruction: "${instruction}"

Available files in current project:
${Object.keys(existingFiles).map((f) => `- ${f}`).join('\n')}

Existing Components Summary:
${summaryOfComponents.join(', ')}

Current Source Files for context:
${Object.entries(existingFiles)
  .map(([path, code]) => `=== FILE: ${path} ===\n${code}\n=== END FILE ===`)
  .join('\n\n')}

Analyze the instruction, create an architectural modification plan, and provide the modified files.
Return JSON with "plan" and "modifiedFiles".
`;
}
