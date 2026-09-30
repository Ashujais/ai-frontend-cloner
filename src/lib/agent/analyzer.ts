import * as cheerio from 'cheerio';
import { WebsiteAnalysis } from '../types';
import { callLLMJson } from '../llm/provider';
import { WEBSITE_ANALYSIS_SYSTEM_PROMPT, buildAnalysisUserPrompt } from '../llm/prompts/analyze';

export interface RawWebsiteData {
  url: string;
  title: string;
  description: string;
  headings: string[];
  paragraphs: string[];
  buttons: string[];
  navigation: {
    brand: string;
    links: Array<{ label: string; href: string }>;
  };
  images: Array<{ src: string; alt?: string; width?: number; height?: number }>;
  colors: {
    primary?: string;
    secondary?: string;
    background?: string;
    foreground?: string;
    accent?: string;
  };
  sectionsDetected: string[];
}

export function extractDeterministicFeatures(html: string, url: string): RawWebsiteData {
  const $ = cheerio.load(html);

  // 1. Meta & Title
  const title =
    $('meta[property="og:title"]').attr('content') ||
    $('title').first().text().trim() ||
    new URL(url).hostname;

  const description =
    $('meta[property="og:description"]').attr('content') ||
    $('meta[name="description"]').attr('content') ||
    '';

  // 2. Headings
  const headings: string[] = [];
  $('h1, h2, h3').each((_, el) => {
    const text = $(el).text().replace(/\s+/g, ' ').trim();
    if (text.length > 2 && text.length < 150 && !headings.includes(text)) {
      headings.push(text);
    }
  });

  // 3. Paragraphs
  const paragraphs: string[] = [];
  $('p').each((_, el) => {
    const text = $(el).text().replace(/\s+/g, ' ').trim();
    if (text.length > 20 && text.length < 400 && !paragraphs.includes(text)) {
      paragraphs.push(text);
    }
  });

  // 4. Buttons & CTAs
  const buttons: string[] = [];
  $('button, a.btn, a[class*="button"], a[class*="btn"]').each((_, el) => {
    const text = $(el).text().replace(/\s+/g, ' ').trim();
    if (text.length > 1 && text.length < 50 && !buttons.includes(text)) {
      buttons.push(text);
    }
  });

  // 5. Navigation & Brand
  const navLinks: Array<{ label: string; href: string }> = [];
  $('header nav a, nav a, header a').each((_, el) => {
    const label = $(el).text().replace(/\s+/g, ' ').trim();
    const href = $(el).attr('href') || '#';
    if (label.length > 1 && label.length < 30 && !navLinks.some((l) => l.label === label)) {
      navLinks.push({ label, href });
    }
  });

  const brand =
    $('header .logo, header [class*="brand"], nav .logo, nav [class*="brand"]').first().text().trim() ||
    title.split(/[-|:]/)[0]?.trim() ||
    new URL(url).hostname;

  // 6. Images
  const images: Array<{ src: string; alt?: string; width?: number; height?: number }> = [];
  $('img').each((_, el) => {
    const src = $(el).attr('src') || $(el).attr('data-src');
    if (src && !src.startsWith('data:image/svg+xml;base64')) {
      let resolvedSrc = src;
      try {
        resolvedSrc = new URL(src, url).toString();
      } catch (e) {
        // ignore invalid
      }
      images.push({
        src: resolvedSrc,
        alt: $(el).attr('alt') || 'Website visual media',
        width: Number($(el).attr('width')) || undefined,
        height: Number($(el).attr('height')) || undefined,
      });
    }
  });

  // 7. Colors & Theme
  const themeColor = $('meta[name="theme-color"]').attr('content');
  const detectedColors: RawWebsiteData['colors'] = {
    primary: themeColor || undefined,
    background: '#ffffff',
    foreground: '#0f172a',
  };

  // Inspect style attributes or tags for color cues
  const htmlSample = html.slice(0, 50000);
  const hexMatches = htmlSample.match(/#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})\b/g);
  if (hexMatches && hexMatches.length > 0) {
    const counts: Record<string, number> = {};
    for (const hex of hexMatches) {
      const lower = hex.toLowerCase();
      if (lower !== '#ffffff' && lower !== '#000000' && lower !== '#fff' && lower !== '#000') {
        counts[lower] = (counts[lower] || 0) + 1;
      }
    }
    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    if (sorted[0]) detectedColors.primary = sorted[0][0];
    if (sorted[1]) detectedColors.secondary = sorted[1][0];
    if (sorted[2]) detectedColors.accent = sorted[2][0];
  }

  // 8. Semantic Sections
  const sectionsDetected: string[] = [];
  $('section, article, header, footer, div[id], div[class]').each((_, el) => {
    const id = $(el).attr('id') || '';
    const className = $(el).attr('class') || '';
    const combined = `${id} ${className}`.toLowerCase();

    const candidates = ['hero', 'feature', 'pricing', 'testimonial', 'cta', 'faq', 'team', 'contact', 'footer', 'about'];
    for (const c of candidates) {
      if (combined.includes(c) && !sectionsDetected.includes(c)) {
        sectionsDetected.push(c);
      }
    }
  });

  return {
    url,
    title,
    description,
    headings: headings.slice(0, 10),
    paragraphs: paragraphs.slice(0, 10),
    buttons: buttons.slice(0, 8),
    navigation: {
      brand,
      links: navLinks.slice(0, 8),
    },
    images: images.slice(0, 10),
    colors: detectedColors,
    sectionsDetected,
  };
}

export async function analyzeWebsite(html: string, url: string): Promise<WebsiteAnalysis> {
  const deterministicData = extractDeterministicFeatures(html, url);
  const userPrompt = buildAnalysisUserPrompt(url, deterministicData);

  try {
    const analysis = await callLLMJson<WebsiteAnalysis>(
      WEBSITE_ANALYSIS_SYSTEM_PROMPT,
      userPrompt
    );

    // Ensure fallback safety on mandatory fields
    if (!analysis.sections || analysis.sections.length === 0) {
      analysis.sections = [
        {
          id: 'hero',
          type: 'hero',
          title: analysis.title,
          subtitle: analysis.description,
        },
        {
          id: 'features',
          type: 'features',
          title: 'Features',
        },
        {
          id: 'footer',
          type: 'footer',
          title: analysis.navigation?.brand || 'Brand',
        },
      ];
    }

    if (!analysis.theme) {
      analysis.theme = {
        mode: 'light',
        primaryColor: '#3b82f6',
        secondaryColor: '#1e293b',
        backgroundColor: '#ffffff',
        textColor: '#0f172a',
        accentColor: '#6366f1',
        borderRadius: '0.75rem',
        shadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      };
    }

    return analysis;
  } catch (error: any) {
    console.warn(`[Analyzer] LLM analysis error (${error.message}). Generating fallback analysis.`);
    // Heuristic fallback
    const { synthesizeSmartAnalysis } = await import('../llm/smart-engine');
    return synthesizeSmartAnalysis(userPrompt);
  }
}
