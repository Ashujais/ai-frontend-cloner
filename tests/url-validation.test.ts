import { validateAndNormalizeUrl } from '../src/lib/agent/fetcher';

export async function testUrlValidation() {
  console.log('--- Testing URL Validation & Security (SSRF) ---');

  // Test 1: Valid HTTP / HTTPS URL
  const valid1 = validateAndNormalizeUrl('https://example.com');
  if (valid1 !== 'https://example.com/') {
    throw new Error(`Test 1 Failed: Expected https://example.com/ but got ${valid1}`);
  }
  console.log('✓ Test 1: Normalizes standard HTTPS URL');

  // Test 2: Auto-prepend protocol
  const valid2 = validateAndNormalizeUrl('example.org/about');
  if (!valid2.startsWith('https://example.org/about')) {
    throw new Error(`Test 2 Failed: Auto-prepend failed: ${valid2}`);
  }
  console.log('✓ Test 2: Auto-prepends https:// when protocol omitted');

  // Test 3: Reject Localhost (SSRF protection)
  let rejectedLocalhost = false;
  try {
    validateAndNormalizeUrl('http://localhost:8080');
  } catch (e: any) {
    rejectedLocalhost = true;
    if (!e.message.includes('restricted for security')) {
      throw new Error(`Test 3 Unexpected error message: ${e.message}`);
    }
  }
  if (!rejectedLocalhost) throw new Error('Test 3 Failed: Did not reject localhost');
  console.log('✓ Test 3: Rejects localhost SSRF attempt');

  // Test 4: Reject Private IP range (127.0.0.1 and 192.168.1.1)
  let rejectedIp = false;
  try {
    validateAndNormalizeUrl('http://192.168.1.1/admin');
  } catch (e: any) {
    rejectedIp = true;
  }
  if (!rejectedIp) throw new Error('Test 4 Failed: Did not reject private IPv4 192.168.1.1');
  console.log('✓ Test 4: Rejects private subnet IP address');

  // Test 5: Reject invalid schemes like file:// or javascript:
  let rejectedFile = false;
  try {
    validateAndNormalizeUrl('file:///etc/passwd');
  } catch (e: any) {
    rejectedFile = true;
  }
  if (!rejectedFile) throw new Error('Test 5 Failed: Did not reject file:// URL');
  console.log('✓ Test 5: Rejects dangerous file:// scheme');
}
