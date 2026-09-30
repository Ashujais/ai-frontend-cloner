import { testUrlValidation } from './url-validation.test';
import { testAnalysisSchema } from './analysis-schema.test';
import { testLLMParser } from './llm-parser.test';
import { testGeneratorAndValidation } from './generator-validation.test';
import { testModifier } from './modifier.test';

async function run() {
  console.log('====================================================');
  console.log('  RUNNING AGENT AUTOMATED TEST SUITE');
  console.log('====================================================\n');

  try {
    await testUrlValidation();
    console.log();
    await testAnalysisSchema();
    console.log();
    await testLLMParser();
    console.log();
    await testGeneratorAndValidation();
    console.log();
    await testModifier();
    console.log();

    console.log('====================================================');
    console.log('  ALL TESTS PASSED SUCCESSFULLY! (100% GREEN)');
    console.log('====================================================');
    process.exit(0);
  } catch (error: any) {
    console.error('\n❌ TEST SUITE FAILED:');
    console.error(error);
    process.exit(1);
  }
}

run();
