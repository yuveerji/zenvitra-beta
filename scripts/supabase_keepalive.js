/**
 * ZENVITRA PLATFORM — SUPABASE ACTIVITY KEEPALIVE DAEMON
 * 
 * Automatically pings Supabase Auth, Storage, and PostgREST endpoints
 * every 30 minutes to keep the Supabase project active and prevent pausing.
 */

const https = require('https');
const path = require('path');
const fs = require('fs');

function loadEnv() {
  const envPath = path.resolve(__dirname, '../.env');
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, 'utf8');
    content.split('\n').forEach(line => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) return;
      const eqIdx = trimmed.indexOf('=');
      if (eqIdx > 0) {
        const key = trimmed.slice(0, eqIdx).trim();
        let val = trimmed.slice(eqIdx + 1).trim();
        if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
          val = val.slice(1, -1);
        }
        if (!process.env[key]) {
          process.env[key] = val;
        }
      }
    });
  }
}

loadEnv();

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mehyoegjgteuxhjnzxfz.supabase.co';
const SUPABASE_ANON_KEY = 
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || 
  'sb_publishable_-s2_dYPXUGNBVCBEi_RyLw_h3ewUm4_';

const parsedUrl = new URL(SUPABASE_URL);
const HOSTNAME = parsedUrl.hostname;

const PING_INTERVAL_MS = 30 * 60 * 1000; // 30 minutes

const ENDPOINTS = [
  { name: 'GoTrue Auth Health', path: '/auth/v1/health' },
  { name: 'GoTrue Auth Settings', path: '/auth/v1/settings' },
  { name: 'Storage Buckets', path: '/storage/v1/bucket' },
  { name: 'PostgREST Schema Pulse', path: '/rest/v1/?apikey=' + SUPABASE_ANON_KEY }
];

function pingEndpoint(ep) {
  return new Promise((resolve) => {
    const options = {
      hostname: HOSTNAME,
      path: ep.path,
      method: 'GET',
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': 'Bearer ' + SUPABASE_ANON_KEY,
        'User-Agent': 'Zenvitra-Supabase-KeepAlive/1.0'
      },
      timeout: 15000
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          name: ep.name,
          path: ep.path,
          statusCode: res.statusCode,
          success: res.statusCode >= 200 && res.statusCode < 600,
          preview: data.substring(0, 80).replace(/\s+/g, ' ')
        });
      });
    });

    req.on('timeout', () => {
      req.destroy();
      resolve({ name: ep.name, path: ep.path, statusCode: 408, success: false, preview: 'Timeout' });
    });

    req.on('error', (err) => {
      resolve({ name: ep.name, path: ep.path, statusCode: 0, success: false, preview: err.message });
    });

    req.end();
  });
}

async function triggerActivityPulse() {
  const timestamp = new Date().toISOString();
  console.log('\n======================================================');
  console.log('[SUPABASE KEEPALIVE] Activity Pulse Triggered: ' + timestamp);
  console.log('Target Host: ' + HOSTNAME);
  console.log('======================================================');

  for (const ep of ENDPOINTS) {
    try {
      const res = await pingEndpoint(ep);
      const icon = res.statusCode >= 200 && res.statusCode < 400 ? '[OK]' : '[PULSE]';
      console.log(icon + ' [' + res.statusCode + '] ' + ep.name + ' (' + ep.path + ') -> ' + res.preview);
    } catch (err) {
      console.error('[ERR] ' + ep.name + ':', err.message);
    }
  }

  console.log('[SUPABASE KEEPALIVE] Next activity pulse scheduled in 30 minutes (' + new Date(Date.now() + PING_INTERVAL_MS).toLocaleTimeString() + ')\n');
}

const isDaemon = process.argv.includes('--daemon');

(async () => {
  await triggerActivityPulse();
  if (!isDaemon) {
    console.log('[SUPABASE KEEPALIVE] Single pulse complete. Exiting immediately (zero background processes).');
    process.exit(0);
  } else {
    console.log('[SUPABASE KEEPALIVE] Running in daemon mode (--daemon). Pinging every 30 minutes.');
    setInterval(triggerActivityPulse, PING_INTERVAL_MS);
  }
})();

process.on('SIGINT', () => {
  console.log('\n[SUPABASE KEEPALIVE] Terminating safely...');
  process.exit(0);
});
