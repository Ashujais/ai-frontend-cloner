import { synthesizeSmartGeneration } from '../src/lib/llm/smart-engine';
import { validateProjectFiles } from '../src/lib/agent/validator';
import { runSelfHealingRepairLoop } from '../src/lib/agent/repair';

export async function testGeneratorAndValidation() {
  console.log('--- Testing Code Generation & Self-Healing Validator ---');

  // Test 1: Code generation emits all mandatory components
  const mockPrompt = `
    Analysis Details:
    {
      "url": "https://testbrand.com",
      "title": "TestBrand Landing",
      "description": "Smart web services",
      "navigation": { "brand": "TestBrand", "links": [] },
      "theme": { "primaryColor": "#3b82f6", "backgroundColor": "#ffffff" },
      "sections": [
        { "id": "hero", "type": "hero", "title": "Hero Heading" },
        { "id": "features", "type": "features", "title": "Features" }
      ]
    }
    Generate the complete set
  `;

  const files = synthesizeSmartGeneration(mockPrompt);
  if (!files['app/page.tsx'] || !files['app/layout.tsx'] || !files['components/Navbar.tsx']) {
    throw new Error('Test 1 Failed: Generated project is missing critical Next.js files');
  }
  console.log('✓ Test 1: Code generator synthesizes complete modular Next.js application');

  // Test 2: Validation of correct code passes
  const validResult = validateProjectFiles(files);
  if (validResult.status !== 'passed') {
    throw new Error(`Test 2 Failed: Clean files failed validation: ${validResult.errors.join(', ')}`);
  }
  console.log('✓ Test 2: Validator approves clean generated code');

  // Test 3: Validator catches missing 'use client'
  const brokenFiles = {
    ...files,
    'components/Counter.tsx': `import React, { useState } from 'react';\nexport default function Counter() { const [c, setC] = useState(0); return <div>{c}</div>; }`,
  };
  const invalidResult = validateProjectFiles(brokenFiles);
  if (invalidResult.status !== 'failed' || !invalidResult.errors[0]?.includes("'use client'")) {
    throw new Error('Test 3 Failed: Validator failed to catch missing "use client" directive');
  }
  console.log('✓ Test 3: Validator identifies missing "use client" in client hook components');

  // Test 4: Self-healing repair loop fixes the missing directive automatically
  const repairResult = await runSelfHealingRepairLoop(brokenFiles);
  if (repairResult.validation.status !== 'passed') {
    throw new Error('Test 4 Failed: Self-healing loop could not resolve the error');
  }
  if (!repairResult.files['components/Counter.tsx'].includes("'use client'")) {
    throw new Error('Test 4 Failed: Repaired file is missing "use client" directive');
  }
  console.log('✓ Test 4: Self-healing engine automatically repairs compiler/lint issues');
}
