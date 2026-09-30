import { URL } from 'url';

export interface FetchResult {
  url: string;
  finalUrl: string;
  html: string;
  statusCode: number;
  contentType: string;
}

const FORBIDDEN_HOSTNAMES = new Set([
  'localhost',
  '127.0.0.1',
  '0.0.0.0',
  '::1',
  '[::1]',
]);

export function validateAndNormalizeUrl(rawUrl: string): string {
  if (!rawUrl || typeof rawUrl !== 'string') {
    throw new Error('Please enter a valid website URL.');
  }

  let trimmed = rawUrl.trim();
  if (trimmed.includes('://') && !trimmed.startsWith('http://') && !trimmed.startsWith('https://')) {
    throw new Error('Only HTTP and HTTPS URLs are permitted.');
  }
  if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://')) {
    trimmed = `https://${trimmed}`;
  }

  let parsed: URL;
  try {
    parsed = new URL(trimmed);
  } catch (e) {
    throw new Error(`Invalid URL format: "${rawUrl}". Please ensure it is a valid web address.`);
  }

  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    throw new Error('Only HTTP and HTTPS URLs are permitted.');
  }

  const hostname = parsed.hostname.toLowerCase();

  // SSRF Protection: Check loopback and local hostnames
  if (FORBIDDEN_HOSTNAMES.has(hostname) || hostname.endsWith('.local') || hostname.endsWith('.internal')) {
    throw new Error('Access to local network or private hostnames is restricted for security.');
  }

  // SSRF Protection: Private IPv4 check (10.x, 172.16-31.x, 192.168.x, 169.254.x)
  const ipv4Regex = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/;
  const ipMatch = ipv4Regex.exec(hostname);
  if (ipMatch) {
    const [, a, b] = ipMatch.map(Number);
    if (
      a === 10 ||
      a === 127 ||
      (a === 172 && b >= 16 && b <= 31) ||
      (a === 192 && b === 168) ||
      (a === 169 && b === 254)
    ) {
      throw new Error('Access to private network IP addresses is restricted for security.');
    }
  }

  return parsed.toString();
}

export async function fetchWebsite(rawUrl: string, timeoutMs: number = 15000): Promise<FetchResult> {
  const normalizedUrl = validateAndNormalizeUrl(rawUrl);

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(normalizedUrl, {
      signal: controller.signal,
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36 AI-Frontend-Cloner/1.0',
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
      },
      redirect: 'follow',
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Website returned HTTP ${response.status} (${response.statusText}).`);
    }

    const contentType = response.headers.get('content-type') || '';
    if (!contentType.includes('text/html') && !contentType.includes('application/xhtml')) {
      throw new Error(`Target returned non-HTML content-type: ${contentType}`);
    }

    const html = await response.text();
    if (!html || html.trim().length === 0) {
      throw new Error('The target website returned an empty response.');
    }

    return {
      url: normalizedUrl,
      finalUrl: response.url || normalizedUrl,
      html,
      statusCode: response.status,
      contentType,
    };
  } catch (error: any) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new Error(`Request timed out after ${timeoutMs / 1000}s while fetching "${normalizedUrl}". Please ensure the site is accessible.`);
    }
    throw new Error(`Unable to access website: ${error.message}`);
  }
}
