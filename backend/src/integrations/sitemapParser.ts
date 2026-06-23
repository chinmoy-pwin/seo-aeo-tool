import { XMLParser } from 'fast-xml-parser';

/**
 * Parses a sitemap.xml. In V1 we mock the fetch but support real parsing of
 * provided XML. To avoid external network in this stub, we generate
 * representative URLs from the sitemap URL host.
 */
export async function parseSitemap(sitemapUrl: string): Promise<string[]> {
  // Attempt a real fetch (Node 20 has global fetch). Fall back to mock on error.
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);
    const res = await fetch(sitemapUrl, { signal: controller.signal });
    clearTimeout(timeout);
    if (res.ok) {
      const xml = await res.text();
      const parser = new XMLParser({ ignoreAttributes: false });
      const parsed = parser.parse(xml);
      const urlset = parsed?.urlset?.url;
      if (urlset) {
        const arr = Array.isArray(urlset) ? urlset : [urlset];
        const urls = arr.map((u: any) => u.loc).filter(Boolean);
        if (urls.length) return urls;
      }
    }
  } catch {
    // ignore, fall through to mock
  }

  // Mock fallback: synthesize URLs from the host
  let base = sitemapUrl.replace(/\/sitemap.*$/i, '');
  if (!/^https?:\/\//.test(base)) base = `https://${base}`;
  const paths = ['/', '/about', '/pricing', '/blog', '/blog/seo-guide', '/features', '/contact'];
  return paths.map((p) => `${base}${p}`);
}