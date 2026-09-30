import { extractJsonFromResponse } from '../src/lib/llm/provider';

export async function testLLMParser() {
  console.log('--- Testing LLM JSON Response Parsing ---');

  // Test 1: Plain JSON
  const raw1 = '{"status": "ok", "count": 42}';
  const parsed1 = extractJsonFromResponse(raw1);
  if (parsed1.status !== 'ok' || parsed1.count !== 42) {
    throw new Error('Test 1 Failed: Plain JSON parse failed');
  }
  console.log('✓ Test 1: Parses standard JSON');

  // Test 2: Markdown backticks wrapped JSON
  const raw2 = `
Here is your requested response:
\`\`\`json
{
  "theme": "dark",
  "components": ["Navbar", "Hero"]
}
\`\`\`
Hope this helps!
  `;
  const parsed2 = extractJsonFromResponse(raw2);
  if (parsed2.theme !== 'dark' || parsed2.components.length !== 2) {
    throw new Error('Test 2 Failed: Markdown-fenced JSON parse failed');
  }
  console.log('✓ Test 2: Extracts JSON safely from markdown code blocks');

  // Test 3: Raw text with embedded JSON object
  const raw3 = 'I analyzed the website and generated: {"url": "https://test.com", "success": true} as requested.';
  const parsed3 = extractJsonFromResponse(raw3);
  if (parsed3.url !== 'https://test.com' || parsed3.success !== true) {
    throw new Error('Test 3 Failed: Embedded JSON extraction failed');
  }
  console.log('✓ Test 3: Extracts embedded JSON objects from free-form text');
}
