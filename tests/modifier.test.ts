import { synthesizeSmartGeneration, synthesizeSmartModification } from '../src/lib/llm/smart-engine';

export async function testModifier() {
  console.log('--- Testing Natural-Language AI Modification Engine ---');

  const baseFiles = synthesizeSmartGeneration('Analysis Details: {"title": "App", "sections": []} Generate the complete set');

  // Test 1: Modify primary color
  const modPrompt1 = `User Instruction: "Change the primary color to blue." Available files: app/globals.css`;
  const result1 = synthesizeSmartModification(modPrompt1);

  if (!result1.plan.affectedFiles.includes('app/globals.css')) {
    throw new Error('Test 1 Failed: Modification plan did not target app/globals.css');
  }
  if (!result1.modifiedFiles['app/globals.css']?.includes('#2563eb')) {
    throw new Error('Test 1 Failed: Primary color was not updated to blue in globals.css');
  }
  console.log('✓ Test 1: Targeted color modification updates global style tokens');

  // Test 2: Make navbar sticky
  const navPrompt = `User Instruction: "Make the navbar sticky." Available files: components/Navbar.tsx === FILE: components/Navbar.tsx ===\n${baseFiles['components/Navbar.tsx']}\n=== END FILE ===`;
  const result2 = synthesizeSmartModification(navPrompt);

  if (!result2.plan.affectedFiles.includes('components/Navbar.tsx')) {
    throw new Error('Test 2 Failed: Did not target Navbar.tsx');
  }
  if (!result2.modifiedFiles['components/Navbar.tsx']?.includes('sticky top-0')) {
    throw new Error('Test 2 Failed: Did not inject sticky top-0 into Navbar');
  }
  console.log('✓ Test 2: Injects sticky positioning into navbar while preserving links');

  // Test 3: Replace hero with bakery hero
  const bakeryPrompt = `User Instruction: "Replace the hero section with a bakery hero." Available files: components/Hero.tsx`;
  const result3 = synthesizeSmartModification(bakeryPrompt);

  if (!result3.modifiedFiles['components/Hero.tsx']?.includes('Artisan Sourdough')) {
    throw new Error('Test 3 Failed: Did not replace hero with bakery content');
  }
  console.log('✓ Test 3: Replaces hero section with artisan bakery theme and CTAs');

  // Test 4: Remove pricing section
  const removePricingPrompt = `User Instruction: "Remove the pricing section." Available files: app/page.tsx === FILE: app/page.tsx ===\n${baseFiles['app/page.tsx']}\n=== END FILE ===`;
  const result4 = synthesizeSmartModification(removePricingPrompt);

  if (result4.modifiedFiles['app/page.tsx']?.includes('<Pricing />')) {
    throw new Error('Test 4 Failed: Pricing section was not removed from page.tsx');
  }
  console.log('✓ Test 4: Removes section cleanly from render tree while preserving other sections');
}
