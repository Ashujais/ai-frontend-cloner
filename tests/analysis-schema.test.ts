import { extractDeterministicFeatures } from '../src/lib/agent/analyzer';
import { synthesizeSmartAnalysis } from '../src/lib/llm/smart-engine';

export async function testAnalysisSchema() {
  console.log('--- Testing Website Analysis Extraction & Schema ---');

  const mockHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Acme Cloud - Enterprise Automation</title>
        <meta name="description" content="Deliver resilient cloud infrastructure with high agility." />
        <meta name="theme-color" content="#2563eb" />
      </head>
      <body>
        <header>
          <div class="brand">Acme Cloud</div>
          <nav>
            <a href="#features">Features</a>
            <a href="#pricing">Pricing</a>
            <a href="#contact">Contact</a>
          </nav>
        </header>
        <main>
          <section id="hero">
            <h1>Automate Your Infrastructure Effortlessly</h1>
            <p>Deploy scalable workloads across global regions with zero downtime.</p>
            <button>Start Free Trial</button>
          </section>
          <section id="features">
            <h2>Instant Provisioning</h2>
            <p>Spin up isolated nodes in under 500 milliseconds worldwide.</p>
          </section>
        </main>
      </body>
    </html>
  `;

  // Test 1: Feature Extraction
  const features = extractDeterministicFeatures(mockHtml, 'https://acmecloud.io');
  if (features.title !== 'Acme Cloud - Enterprise Automation') {
    throw new Error(`Test 1 Failed: Unexpected title: ${features.title}`);
  }
  if (!features.headings.includes('Automate Your Infrastructure Effortlessly')) {
    throw new Error('Test 1 Failed: Missing h1 heading');
  }
  if (features.navigation.links.length !== 3) {
    throw new Error(`Test 1 Failed: Expected 3 nav links, got ${features.navigation.links.length}`);
  }
  console.log('✓ Test 1: Deterministic DOM feature extraction succeeds');

  // Test 2: WebsiteAnalysis schema conformance
  const prompt = `Raw Extracted Content: ${JSON.stringify(features)} Provide the complete from: https://acmecloud.io`;
  const analysis = synthesizeSmartAnalysis(prompt);

  if (!analysis.url || !analysis.title || !analysis.theme || !analysis.sections) {
    throw new Error('Test 2 Failed: Analysis missing required schema properties');
  }
  if (analysis.sections.length < 3) {
    throw new Error(`Test 2 Failed: Expected at least 3 sections, got ${analysis.sections.length}`);
  }
  if (!analysis.theme.primaryColor || !analysis.theme.backgroundColor) {
    throw new Error('Test 2 Failed: Theme colors missing');
  }
  console.log('✓ Test 2: WebsiteAnalysis schema validation matches specifications');
}
