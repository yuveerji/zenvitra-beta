import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

function sanitizeUrl(raw?: string): URL | null {
  try {
    let clean = (raw || '').trim();
    if (clean.startsWith('"') && clean.endsWith('"')) clean = clean.slice(1, -1);
    if (clean.startsWith("'") && clean.endsWith("'")) clean = clean.slice(1, -1);
    if (!clean || !clean.startsWith('http')) {
      clean = 'https://mehyoegjgteuxhjnzxfz.supabase.co';
    }
    return new URL(clean);
  } catch {
    return new URL('https://mehyoegjgteuxhjnzxfz.supabase.co');
  }
}

export async function GET() {
  const timestamp = new Date().toISOString();

  try {
    const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mehyoegjgteuxhjnzxfz.supabase.co';
    const parsed = sanitizeUrl(rawUrl) || new URL('https://mehyoegjgteuxhjnzxfz.supabase.co');

    const anonKey = (
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
      'sb_publishable_-s2_dYPXUGNBVCBEi_RyLw_h3ewUm4_'
    ).trim();

    const endpoints = [
      { name: 'Auth Health', path: '/auth/v1/health' },
      { name: 'Auth Settings', path: '/auth/v1/settings' },
      { name: 'Storage Buckets', path: '/storage/v1/bucket' },
      { name: 'PostgREST Schema Pulse', path: `/rest/v1/?apikey=${encodeURIComponent(anonKey)}` }
    ];

    const results = [];

    for (const ep of endpoints) {
      try {
        const targetUrl = parsed.origin + ep.path;
        const res = await fetch(targetUrl, {
          method: 'GET',
          headers: {
            'apikey': anonKey,
            'Authorization': `Bearer ${anonKey}`,
            'User-Agent': 'Zenvitra-Supabase-Activity-Pulse/1.0'
          },
          cache: 'no-store',
          signal: AbortSignal.timeout(2500)
        });

        const text = await res.text().catch(() => '');
        results.push({
          name: ep.name,
          path: ep.path,
          status: res.status,
          preview: text.substring(0, 100)
        });
      } catch (err: any) {
        results.push({
          name: ep.name,
          path: ep.path,
          status: 0,
          error: err?.name === 'TimeoutError' ? 'Endpoint ping timed out' : (err?.message || 'Network unreachable')
        });
      }
    }

    const hasAnySuccess = results.some(r => r.status >= 200 && r.status < 400);

    return NextResponse.json(
      {
        status: hasAnySuccess ? 'success' : 'degraded',
        timestamp,
        host: parsed.hostname,
        endpoints: results
      },
      {
        status: 200,
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      }
    );
  } catch (fatalError: any) {
    // Zero-crash guarantee: Always return valid JSON status 200 so keepalive pulse never crashes the host
    return NextResponse.json(
      {
        status: 'error',
        timestamp,
        host: 'supabase',
        error: fatalError?.message || 'Internal pulse error',
        endpoints: []
      },
      {
        status: 200,
        headers: { 'Cache-Control': 'no-store' }
      }
    );
  }
}
