export const WEBSITE_ANALYSIS_SYSTEM_PROMPT = `
You are an expert Frontend Architect and UI/UX Reverse-Engineering Agent.
Your job is to analyze extracted website content and output a clean, normalized WebsiteAnalysis JSON structure.

Follow these strict rules:
1. Output ONLY valid JSON matching the WebsiteAnalysis schema. No markdown formatting, no commentary.
2. Group the page into semantic, logical sections (e.g., hero, features, testimonials, pricing, cta, stats, faq, footer).
3. Extract and normalize the color palette (primary, secondary, background, foreground, accent, border, muted).
4. Specify reusable UI components that represent the layout cleanly.
5. Infer responsive structure: mobile menu needs, grid layouts, and collapsible sections.
6. Clean and preserve original headings, copywriting, and button call-to-actions.
`;

export function buildAnalysisUserPrompt(url: string, rawExtraction: any): string {
  return `
Analyze this extracted website data from: ${url}

Raw Extracted Content:
${JSON.stringify(rawExtraction, null, 2)}

Provide the complete WebsiteAnalysis JSON object with this exact schema:
{
  "url": "${url}",
  "title": string,
  "description": string,
  "theme": {
    "mode": "light" | "dark" | "auto",
    "primaryColor": string (hex/rgb),
    "secondaryColor": string (hex/rgb),
    "backgroundColor": string (hex/rgb),
    "textColor": string (hex/rgb),
    "accentColor": string (hex/rgb),
    "borderRadius": string (e.g. "0.5rem"),
    "shadow": string (e.g. "0 4px 6px -1px rgba(0, 0, 0, 0.1)")
  },
  "navigation": {
    "brand": string,
    "logoUrl": string | undefined,
    "links": [{ "label": string, "href": string }],
    "ctaButton": { "text": string, "href": string } | undefined
  },
  "sections": [
    {
      "id": string (e.g. "hero", "features-1"),
      "type": "hero" | "features" | "testimonials" | "pricing" | "cta" | "footer" | "faq" | "stats" | "gallery" | "content",
      "title": string,
      "subtitle": string | undefined,
      "content": string | undefined,
      "items": [
        {
          "title": string | undefined,
          "description": string | undefined,
          "icon": string | undefined,
          "badge": string | undefined,
          "price": string | undefined,
          "author": string | undefined,
          "role": string | undefined,
          "avatar": string | undefined,
          "features": string[] | undefined,
          "imageUrl": string | undefined
        }
      ],
      "cta": { "text": string, "href": string, "variant": string } | undefined
    }
  ],
  "components": string[] (e.g. ["Navbar", "Hero", "FeatureGrid", "PricingCards", "Testimonials", "CTA", "Footer"]),
  "typography": {
    "headingFont": string,
    "bodyFont": string,
    "baseFontSize": string,
    "headingScale": string
  },
  "colors": {
    "palette": string[],
    "background": string,
    "foreground": string,
    "primary": string,
    "secondary": string,
    "accent": string,
    "muted": string,
    "border": string
  },
  "spacing": {
    "sectionPadding": string,
    "containerMaxWidth": string,
    "elementGap": string
  },
  "assets": [
    {
      "url": string,
      "alt": string | undefined,
      "type": "image" | "svg" | "icon" | "logo",
      "sectionId": string | undefined
    }
  ],
  "responsiveStructure": {
    "mobileMenu": boolean,
    "gridBreakpoints": string,
    "collapsibleSections": string[]
  }
}
`;
}
