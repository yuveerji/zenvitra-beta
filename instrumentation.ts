export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const https = await import('https');

    const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mehyoegjgteuxhjnzxfz.supabase.co';
    const SUPABASE_ANON_KEY = 
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || 
      'sb_publishable_-s2_dYPXUGNBVCBEi_RyLw_h3ewUm4_';

    const parsedUrl = new URL(SUPABASE_URL);
    const HOSTNAME = parsedUrl.hostname;

    const ENDPOINTS = [
      { name: 'Auth Health', path: '/auth/v1/health' },
      { name: 'Auth Settings', path: '/auth/v1/settings' },
      { name: 'Storage Buckets', path: '/storage/v1/bucket' },
      { name: 'PostgREST DB Query', path: '/rest/v1/profiles?limit=1' }
    ];

    const pingSupabase = () => {
      const timestamp = new Date().toISOString();
      console.log(`[SERVER-KEEPALIVE] Server is running -> Triggering Supabase activity pulse at ${timestamp}`);

      for (const ep of ENDPOINTS) {
        try {
          const req = https.request({
            hostname: HOSTNAME,
            path: ep.path,
            method: 'GET',
            headers: {
              'apikey': SUPABASE_ANON_KEY,
              'Authorization': 'Bearer ' + SUPABASE_ANON_KEY,
              'User-Agent': 'Zenvitra-Server-KeepAlive/1.0'
            },
            timeout: 10000
          }, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
              const icon = (res.statusCode && res.statusCode >= 200 && res.statusCode < 400) ? '✅' : '📡';
              console.log(`[SERVER-KEEPALIVE] ${icon} [${res.statusCode}] ${ep.name} -> ${data.substring(0, 50).replace(/\s+/g, ' ')}`);
            });
          });

          req.on('timeout', () => req.destroy());
          req.on('error', (err) => console.error(`[SERVER-KEEPALIVE] ${ep.name} error:`, err.message));
          req.end();
        } catch (e: any) {
          console.error('[SERVER-KEEPALIVE] Request error:', e?.message || 'Unknown error');
        }
      }
    };

    // 1. Immediately ping Supabase when Next.js server starts
    setTimeout(pingSupabase, 3000);

    // 2. Automatically ping every 30 minutes for as long as the server is running
    const PING_INTERVAL_MS = 30 * 60 * 1000;
    setInterval(pingSupabase, PING_INTERVAL_MS);
    console.log('[SERVER-KEEPALIVE] Supabase server-level 30-minute keepalive registered successfully.');
  }
}
