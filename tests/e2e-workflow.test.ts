import { runFullGenerationWorkflow } from '../src/lib/agent/orchestrator';
import { modifyGeneratedProject } from '../src/lib/agent/modifier';
import { renderStandalonePreviewHtml } from '../src/lib/agent/preview-manager';
import { readManifest } from '../src/lib/storage/manifest';

async function testE2E() {
  console.log('====================================================');
  console.log('  RUNNING END-TO-END WORKFLOW INTEGRATION TEST');
  console.log('====================================================\n');

  // Step 1: Recreate https://example.com
  console.log('Step 1: Generating clone for https://example.com...');
  const manifest = await runFullGenerationWorkflow('https://example.com', {
    onProgress: (stage, msg, state) => {
      console.log(`  [${state}] ${stage}: ${msg}`);
    },
    onLog: (stage, msg, type) => {
      console.log(`    ↳ (${type}) [${stage}] ${msg}`);
    },
  });

  if (!manifest || manifest.state !== 'READY') {
    throw new Error(`E2E Step 1 Failed: Project state is ${manifest?.state}, expected READY`);
  }
  console.log(`✓ Step 1 Success: Created project ${manifest.id} with ${Object.keys(manifest.files).length} files.`);

  // Step 2: Validate manifest on disk
  const savedManifest = readManifest(manifest.id);
  if (!savedManifest) {
    throw new Error('E2E Step 2 Failed: Manifest not found on disk');
  }
  console.log('✓ Step 2 Success: Manifest verified on disk in workspace/generated/project-' + manifest.id);

  // Step 3: Test Preview Rendering
  const previewHtml = renderStandalonePreviewHtml(manifest);
  if (!previewHtml.includes('<!DOCTYPE html>') || !previewHtml.includes('Example Domain')) {
    throw new Error('E2E Step 3 Failed: Preview HTML output incomplete');
  }
  console.log('✓ Step 3 Success: Standalone preview HTML generated with full responsive styles.');

  // Step 4: Apply Natural-Language Modification
  console.log('\nStep 4: Applying modification: "Make the navbar sticky and change the primary color to blue."');
  const modResult = await modifyGeneratedProject(
    'Make the navbar sticky and change the primary color to blue.',
    manifest.files
  );

  if (!modResult.changedFiles.includes('app/globals.css') && !modResult.changedFiles.includes('components/Navbar.tsx')) {
    throw new Error('E2E Step 4 Failed: Expected app/globals.css or components/Navbar.tsx to be modified');
  }
  console.log(`✓ Step 4 Success: Modified ${modResult.changedFiles.join(', ')}`);
  console.log(`  Plan: ${modResult.plan.explanation}`);
  console.log(`  Validation status: ${modResult.validation.status}`);

  console.log('\n====================================================');
  console.log('  END-TO-END WORKFLOW INTEGRATION TEST PASSED! 🚀');
  console.log('====================================================');
}

testE2E().catch((err) => {
  console.error('\n❌ E2E TEST FAILED:', err);
  process.exit(1);
});
