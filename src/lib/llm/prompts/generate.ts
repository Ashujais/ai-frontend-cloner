import { WebsiteAnalysis } from '../../types';

export const CODE_GENERATION_SYSTEM_PROMPT = `
You are an elite Next.js and Tailwind CSS Frontend Engineer.
Your task is to generate production-quality, modular, responsive React / Next.js code matching the provided WebsiteAnalysis.

Strict Requirements:
1. Output MUST be a JSON map of relative file paths to file contents:
{
  "app/globals.css": "...",
  "app/layout.tsx": "...",
  "app/page.tsx": "...",
  "components/Navbar.tsx": "...",
  "components/Hero.tsx": "...",
  "components/Footer.tsx": "..."
}
2. Use modern React 18/19 with Tailwind CSS utility classes.
3. Every component must be in its own file under components/ (e.g. Navbar.tsx, Hero.tsx, Features.tsx, Pricing.tsx, Testimonials.tsx, Footer.tsx).
4. Use Lucide icons (or clean SVG icons) gracefully without broken imports.
5. All components must have "use client" if they use interactive hooks (useState, mobile menus, accordion toggles).
6. TypeScript must be strictly valid without syntax errors. No imaginary or missing imports.
7. Design must be fully responsive:
   - Mobile menu toggle in Navbar.
   - Responsive grids: grid-cols-1 md:grid-cols-2 lg:grid-cols-3.
   - Clean spacing, padding, and typography scaling.
8. Recreate the original site's visual theme faithfully (primary color, background, card styling, buttons).
9. Output ONLY valid JSON. No markdown code fence outside the JSON.
`;

export function buildGenerationUserPrompt(analysis: WebsiteAnalysis): string {
  return `
Recreate the website as a modern Next.js + Tailwind CSS application based on this structured analysis:

Website Title: ${analysis.title}
Theme: Primary: ${analysis.theme.primaryColor}, Secondary: ${analysis.theme.secondaryColor}, Background: ${analysis.theme.backgroundColor}, Text: ${analysis.theme.textColor}
Navigation: Brand "${analysis.navigation.brand}", ${analysis.navigation.links.length} links
Sections: ${analysis.sections.map((s) => `${s.id} (${s.type}) - "${s.title || 'untitled'}"`).join(', ')}

Analysis Details:
${JSON.stringify(analysis, null, 2)}

Generate the complete set of files needed for the frontend:
1. "app/globals.css": Tailwind base and custom theme variables.
2. "app/layout.tsx": Standard root layout with metadata, fonts, and clean HTML structure.
3. "app/page.tsx": Assembles all components in proper section order.
4. "components/Navbar.tsx": Responsive navbar with logo, links, CTA, and mobile hamburger menu.
5. Dedicated component files for each section in the analysis (e.g., Hero.tsx, Features.tsx, Testimonials.tsx, Pricing.tsx, CTA.tsx, Footer.tsx).

Ensure all component files are clean, fully implemented, and strictly error-free. Return the JSON map.
`;
}
