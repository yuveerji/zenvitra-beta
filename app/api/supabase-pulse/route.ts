import { NextResponse } from 'next/server';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mehyoegjgteuxhjnzxfz.supabase.co';
const SUPABASE_ANON_KEY = 
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || 
  'sb_publishable_-s2_dYPXUGNBVCBEi_RyLw_h3ewUm4_';

const ENDPOINTS = [
  { name: 'Auth Health', path: '/auth/v1/health' },
  { name: 'Auth Settings', path: '/auth/v1/settings' },
  { name: 'Storage Buckets', path: '/storage/v1/bucket' },
  { name: 'PostgREST Schema Pulse', path: '/rest/v1/?apikey=' + SUPABASE_ANON_KEY }
];

export async function GET() {
  const results = [];
  const parsed = new URL(SUPABASE_URL);

  for (const ep of ENDPOINTS) {
    try {
      const targetUrl = parsed.origin + ep.path;
      const res = await fetch(targetUrl, {
        method: 'GET',
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': 'Bearer ' + SUPABASE_ANON_KEY,
          'User-Agent': 'Zenvitra-Supabase-Activity-Pulse/1.0'
        },
        cache: 'no-store'
      });
      const text = await res.text();
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
        error: err?.message || 'Unknown error'
      });
    }
  }

  return NextResponse.json({
    status: 'success',
    timestamp: new Date().toISOString(),
    host: parsed.hostname,
    endpoints: results
  });
}
