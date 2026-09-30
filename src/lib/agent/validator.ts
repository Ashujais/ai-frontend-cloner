import { ValidationResult } from '../types';

export function validateProjectFiles(files: Record<string, string>): ValidationResult {
  const errors: string[] = [];

  // 1. Mandatory Entry Files
  if (!files['app/page.tsx'] && !files['app/page.jsx']) {
    errors.push('Missing entry point: "app/page.tsx" must be present.');
  }
  if (!files['app/layout.tsx'] && !files['app/layout.jsx']) {
    errors.push('Missing root layout: "app/layout.tsx" must be present.');
  }
  if (!files['app/globals.css']) {
    errors.push('Missing global stylesheet: "app/globals.css" must be present.');
  }

  // 2. Scan every TSX/JSX file for standard syntax and import integrity
  for (const [path, code] of Object.entries(files)) {
    if (path.endsWith('.tsx') || path.endsWith('.jsx') || path.endsWith('.ts')) {
      // Check for Client Hook usage without "use client"
      if (
        (code.includes('useState') || code.includes('useEffect') || code.includes('useRef')) &&
        !code.includes('use client')
      ) {
        errors.push(
          `In "${path}": React state or effect hook detected without 'use client' directive at the top of the file.`
        );
      }

      // Check for unclosed JSX tags or gross syntax errors
      const openDivs = (code.match(/<div\b/g) || []).length;
      const closeDivs = (code.match(/<\/div>/g) || []).length;
      if (openDivs !== closeDivs) {
        errors.push(
          `In "${path}": Mismatched <div> tags detected (${openDivs} opened vs ${closeDivs} closed).`
        );
      }

      const openSections = (code.match(/<section\b/g) || []).length;
      const closeSections = (code.match(/<\/section>/g) || []).length;
      if (openSections !== closeSections) {
        errors.push(
          `In "${path}": Mismatched <section> tags detected (${openSections} opened vs ${closeSections} closed).`
        );
      }

      // Check local component imports
      const importRegex = /import\s+(?:[A-Za-z0-9_,\s{}*]+)\s+from\s+['"](\.[^'"]+)['"]/g;
      let match;
      while ((match = importRegex.exec(code)) !== null) {
        const relativeImport = match[1];
        // Normalize import target to match file in project
        const resolvedCandidates = [
          relativeImport.replace(/^\.\//, 'components/').replace(/^\.\.\//, ''),
          `${relativeImport.replace(/^\.\//, 'components/').replace(/^\.\.\//, '')}.tsx`,
          `${relativeImport.replace(/^\.\//, 'components/').replace(/^\.\.\//, '')}.jsx`,
          `${relativeImport.replace(/^\.\//, 'components/').replace(/^\.\.\//, '')}.ts`,
          `components/${relativeImport.replace(/^\.\.\/components\//, '')}.tsx`,
          `components/${relativeImport.replace(/^\.\//, '')}.tsx`,
        ];

        const exists = resolvedCandidates.some((c) => !!files[c] || !!files[c.replace('.tsx', '')]);
        if (!exists && !relativeImport.endsWith('.css') && !relativeImport.includes('globals')) {
          errors.push(
            `In "${path}": Unresolved local import "${relativeImport}". Ensure the component file exists.`
          );
        }
      }
    }
  }

  const passed = errors.length === 0;
  return {
    status: passed ? 'passed' : 'failed',
    errors,
    attemptCount: 1,
  };
}
