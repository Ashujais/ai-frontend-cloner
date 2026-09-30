import { WebsiteAnalysis } from '../types';
import { callLLMJson } from '../llm/provider';
import { CODE_GENERATION_SYSTEM_PROMPT, buildGenerationUserPrompt } from '../llm/prompts/generate';
import { synthesizeSmartGeneration } from '../llm/smart-engine';

export async function generateFrontendCode(
  analysis: WebsiteAnalysis
): Promise<Record<string, string>> {
  const userPrompt = buildGenerationUserPrompt(analysis);

  try {
    const generatedFiles = await callLLMJson<Record<string, string>>(
      CODE_GENERATION_SYSTEM_PROMPT,
      userPrompt
    );

    // Validate that we got real code files
    if (
      generatedFiles &&
      typeof generatedFiles === 'object' &&
      (generatedFiles['app/page.tsx'] || generatedFiles['app/page.jsx'] || generatedFiles['src/app/page.tsx'])
    ) {
      // Ensure essential configuration files exist for the standalone project
      ensureProjectScaffolding(generatedFiles, analysis);
      return generatedFiles;
    }

    throw new Error('LLM did not return standard app/page.tsx file.');
  } catch (error: any) {
    console.warn(`[Generator] LLM code generation fallback: ${error.message}`);
    const fallbackFiles = synthesizeSmartGeneration(userPrompt);
    ensureProjectScaffolding(fallbackFiles, analysis);
    return fallbackFiles;
  }
}

function ensureProjectScaffolding(files: Record<string, string>, analysis: WebsiteAnalysis): void {
  // Always include standard package.json for generated project isolation
  if (!files['package.json']) {
    files['package.json'] = JSON.stringify(
      {
        name: `cloned-${slugify(analysis.navigation?.brand || 'site')}`,
        version: '0.1.0',
        private: true,
        scripts: {
          dev: 'next dev',
          build: 'next build',
          start: 'next start',
          lint: 'next lint',
        },
        dependencies: {
          next: '^14.2.15',
          react: '^18.3.1',
          'react-dom': '^18.3.1',
          'lucide-react': '^0.453.0',
          clsx: '^2.1.1',
          'tailwind-merge': '^2.5.4',
        },
        devDependencies: {
          typescript: '^5.6.3',
          '@types/node': '^20.17.0',
          '@types/react': '^18.3.11',
          '@types/react-dom': '^18.3.1',
          tailwindcss: '^3.4.14',
          postcss: '^8.4.47',
          autoprefixer: '^10.4.20',
        },
      },
      null,
      2
    );
  }

  if (!files['tsconfig.json']) {
    files['tsconfig.json'] = JSON.stringify(
      {
        compilerOptions: {
          target: 'es2020',
          lib: ['dom', 'dom.iterable', 'esnext'],
          allowJs: true,
          skipLibCheck: true,
          strict: true,
          noEmit: true,
          esModuleInterop: true,
          module: 'esnext',
          moduleResolution: 'bundler',
          resolveJsonModule: true,
          isolatedModules: true,
          jsx: 'preserve',
          incremental: true,
          plugins: [{ name: 'next' }],
          paths: { '@/*': ['./*'] },
        },
        include: ['next-env.d.ts', '**/*.ts', '**/*.tsx'],
        exclude: ['node_modules'],
      },
      null,
      2
    );
  }

  if (!files['tailwind.config.js'] && !files['tailwind.config.ts']) {
    files['tailwind.config.js'] = `/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "${analysis.colors?.primary || '#2563eb'}",
        secondary: "${analysis.colors?.secondary || '#0f172a'}",
      },
    },
  },
  plugins: [],
};
`;
  }

  if (!files['postcss.config.js'] && !files['postcss.config.mjs']) {
    files['postcss.config.js'] = `module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
`;
  }
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '') || 'app';
}
