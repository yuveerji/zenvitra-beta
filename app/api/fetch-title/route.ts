import { NextRequest, NextResponse } from 'next/server';

const DOMAIN_MAP: Record<string, string> = {
  'timesofindia.indiatimes.com': 'TOI',
  'indiatimes.com': 'TOI',
  'thehindu.com': 'The Hindu',
  'indianexpress.com': 'Indian Express',
  'hindustantimes.com': 'HT',
  'ndtv.com': 'NDTV',
  'livemint.com': 'Mint',
  'reuters.com': 'Reuters',
  'bbc.com': 'BBC',
  'bbc.co.uk': 'BBC',
  'theguardian.com': 'The Guardian',
  'aljazeera.com': 'Al Jazeera',
  'apnews.com': 'AP News',
  'bloomberg.com': 'Bloomberg',
  'ft.com': 'Financial Times',
  'wsj.com': 'WSJ',
  'cnn.com': 'CNN',
  'theprint.in': 'ThePrint',
  'scroll.in': 'Scroll',
  'thewire.in': 'The Wire',
  'aninews.in': 'ANI',
  'ptinews.com': 'PTI',
  'economictimes.indiatimes.com': 'ET',
  'deccanherald.com': 'Deccan Herald',
  'telegraphindia.com': 'The Telegraph',
  'news18.com': 'News18',
  'firstpost.com': 'Firstpost',
};

function decodeHtmlEntities(str: string): string {
  return str
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&#39;/g, "'")
    .replace(/&ldquo;/g, '"')
    .replace(/&rdquo;/g, '"')
    .replace(/&lsquo;/g, "'")
    .replace(/&rsquo;/g, "'")
    .replace(/&ndash;/g, '–')
    .replace(/&mdash;/g, '—')
    .replace(/&bull;/g, '•')
    .replace(/\s+/g, ' ')
    .trim();
}

function getPublicationName(urlObj: URL, ogSiteName?: string): string {
  const hostname = urlObj.hostname.toLowerCase().replace(/^www\./, '');
  
  if (DOMAIN_MAP[hostname]) {
    return DOMAIN_MAP[hostname];
  }

  for (const [key, val] of Object.entries(DOMAIN_MAP)) {
    if (hostname.endsWith(key)) {
      return val;
    }
  }

  if (ogSiteName && ogSiteName.trim().length > 0 && ogSiteName.trim().length < 30) {
    return decodeHtmlEntities(ogSiteName.trim());
  }

  // Derive from domain: e.g. "forbes.com" -> "Forbes"
  const parts = hostname.split('.');
  if (parts.length >= 2) {
    const mainPart = parts[parts.length - 2];
    return mainPart.charAt(0).toUpperCase() + mainPart.slice(1);
  }

  return hostname;
}

async function handleFetchTitle(rawUrl: string | undefined | null) {
  try {
    if (!rawUrl || !rawUrl.trim()) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    const cleanUrl = rawUrl.trim();
    let urlObj: URL;
    try {
      urlObj = new URL(cleanUrl.startsWith('http') ? cleanUrl : `https://${cleanUrl}`);
    } catch {
      return NextResponse.json({ error: 'Invalid URL format' }, { status: 400 });
    }

  const domain = urlObj.hostname;
    let title = '';
    let ogSiteName = '';

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4500);

      const res = await fetch(urlObj.toString(), {
        signal: controller.signal,
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36 (compatible; ZenvitraNewsWire/1.0; +https://zenvitra.xyz)',
          Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.9',
        },
      });

      clearTimeout(timeoutId);

      if (res.ok) {
        const html = await res.text();

        // 1. Check og:title
        const ogTitleMatch = html.match(/<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)["']/i) ||
                             html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:title["']/i);
        if (ogTitleMatch && ogTitleMatch[1]) {
          title = ogTitleMatch[1];
        }

        // 2. Check og:site_name
        const ogSiteMatch = html.match(/<meta[^>]+property=["']og:site_name["'][^>]+content=["']([^"']+)["']/i) ||
                            html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:site_name["']/i);
        if (ogSiteMatch && ogSiteMatch[1]) {
          ogSiteName = ogSiteMatch[1];
        }

        // 3. Check twitter:title if no og:title
        if (!title) {
          const twitterTitleMatch = html.match(/<meta[^>]+name=["']twitter:title["'][^>]+content=["']([^"']+)["']/i) ||
                                    html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+name=["']twitter:title["']/i);
          if (twitterTitleMatch && twitterTitleMatch[1]) {
            title = twitterTitleMatch[1];
          }
        }

        // 4. Fallback to <title>
        if (!title) {
          const titleTagMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
          if (titleTagMatch && titleTagMatch[1]) {
            title = titleTagMatch[1];
          }
        }

        // 5. Fallback to first <h1>
        if (!title) {
          const h1Match = html.match(/<h1[^>]*>([^<]+)<\/h1>/i);
          if (h1Match && h1Match[1]) {
            title = h1Match[1];
          }
        }
      }
    } catch (fetchErr) {
      // Network/CORS/Anti-bot or timeout - will fall back to smart domain parsing
    }

    const pubName = getPublicationName(urlObj, ogSiteName);

    // Clean up title
    let cleanTitle = decodeHtmlEntities(title);

    // Remove repetitive site names from the end of the title if present
    // e.g., "India signs deal - Times of India" -> "India signs deal"
    cleanTitle = cleanTitle
      .replace(new RegExp(`\\s*[-|•–—|:]\\s*${pubName}.*$`, 'i'), '')
      .replace(new RegExp(`^${pubName}\\s*[-|•–—|:]\\s*`, 'i'), '')
      .trim();

    // Fallback title if extraction failed or page returned empty
    if (!cleanTitle || cleanTitle.length < 3) {
      // Try to parse pathname: e.g. /world/summit-declared-open -> "Summit Declared Open"
      const slugSegment = urlObj.pathname.split('/').filter(Boolean).pop()?.replace(/\.[^/.]+$/, '');
      if (slugSegment && slugSegment.length > 3) {
        cleanTitle = slugSegment
          .replace(/[-_]+/g, ' ')
          .replace(/\b\w/g, (c) => c.toUpperCase())
          .slice(0, 80);
      } else {
        cleanTitle = `Article from ${pubName}`;
      }
    }

    // Format final heading: e.g. "TOI - Article X"
    const formattedHeading = `${pubName} - ${cleanTitle}`;

    return NextResponse.json({
      success: true,
      title: cleanTitle,
      publication: pubName,
      formattedHeading,
      domain,
      url: urlObj.toString(),
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Failed to process URL' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    return await handleFetchTitle(body?.url);
  } catch {
    return NextResponse.json({ error: 'Invalid JSON request body' }, { status: 400 });
  }
}

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get('url');
  return await handleFetchTitle(url);
}
