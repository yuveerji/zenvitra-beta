# ZENVITRA PLATFORM — SUPABASE KEEPALIVE & ACTIVITY SERVICE DOCUMENTATION

This document provides the full, step-by-step audit record of how the automated 30-minute Supabase keepalive activity service and startup trigger were investigated, designed, implemented, and verified to prevent the Supabase project (`mehyoegjgteuxhjnzxfz.supabase.co`) from pausing due to free-tier inactivity.

---

## 1. Problem Statement
Supabase free-tier projects automatically pause after one week of inactivity (no queries, auth calls, or API traffic). In order to maintain continuous uptime and ensure the database, authentication, and storage stay warm:
1. Activity must be dispatched to Supabase on an ongoing schedule (every 30 minutes).
2. Activity must also be sent whenever the website on localhost (or production) starts/loads.

---

## 2. Full Audit & Investigation Log

### Step 1: Environment & Credential Discovery
- **Action**: Checked `.env` and codebase for active Supabase credentials.
- **Found Configuration**:
  - `NEXT_PUBLIC_SUPABASE_URL`: `https://mehyoegjgteuxhjnzxfz.supabase.co`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: `sb_publishable_-s2_dYPXUGNBVCBEi_RyLw_h3ewUm4_`
  - `lib/supabase.ts` exports a standardized `createClient(supabaseUrl, supabaseAnonKey)` instance.

### Step 2: Supabase Endpoint Connectivity & Health Testing
- **Action**: Executed direct test requests against all primary Supabase service layers:
  1. **GoTrue Auth Health** (`/auth/v1/health`):
     - Returned `HTTP 200` with payload: `{"version":"v2.196.0","name":"GoTrue","description":"GoTrue is a user registration and authentication API"}`
  2. **GoTrue Auth Settings** (`/auth/v1/settings`):
     - Returned `HTTP 200` with active authentication provider configurations.
  3. **Storage Gateway** (`/storage/v1/bucket`):
     - Returned `HTTP 200` with `[]`.
  4. **PostgREST Database Query** (`/rest/v1/profiles?limit=1`):
     - Hit live PostgreSQL instance via PostgREST gateway.

---

## 3. Architecture & Implementation

### A. Server Lifecycle Keepalive (`instrumentation.ts`)
A native Next.js server instrumentation hook that:
- **Tied to Server Running**: Executes whenever the Next.js process (`next dev` on `localhost:3000` or `next start` on `zenvitra.xyz`) is running.
- **Immediate Server Startup Pulse**: Immediately sends activity to Supabase 3 seconds after the web server boots.
- **30-Minute Interval**: Dispatches an activity pulse every 30 minutes for as long as the server is running.
- **Zero Dangling Processes**: When the server stops, the interval stops cleanly with it. No external daemons or background scripts required.

### B. Client-Bound 30-Minute Keepalive (`components/providers/AppProviders.tsx`)
- **Active Site Trigger**: Runs when `localhost:3000` or `zenvitra.xyz` is open in the user's browser.
- **Immediate Startup**: Fires 1 second after page hydration to wake up and warm Supabase immediately upon opening the website.
- **30-Minute Interval**: Fires every 30 minutes in the background of the browser session.
- **Automatic Teardown**: When the browser or website tab is closed, all timers are cleared cleanly.

### C. Single-Shot CLI Tool (`scripts/supabase_keepalive.js`)
- Runs once, hits all 4 Supabase endpoints, and immediately exits (`process.exit(0)`).
- Never stays running in the background.

### D. Internal API Route (`app/api/supabase-pulse/route.ts`)
- Accessible at `GET /api/supabase-pulse`.
- Can be invoked by external webhooks, cron services (cron-job.org, Vercel Cron), or client browsers.
- Returns JSON status and latency/response details for each checked Supabase subsystem.

### E. NPM One-Click Pulse Command
- Added script to `package.json`:
  ```bash
  npm run supabase:keepalive
  ```
  Runs a single pass and terminates immediately.

---

## 4. Verification & Testing Results

| Test Item | Command / Action | Result |
| :--- | :--- | :--- |
| **Daemon Execution** | `node scripts/supabase_keepalive.js --once` | `HTTP 200` on Auth & Storage, PostgREST pinged, Exit code 0 |
| **Windows Task Scheduler** | `schtasks /run /tn "ZenvitraSupabaseKeepAlive"` | Task State: `Ready`, Last Result: `0` |
| **Next.js API Route** | `GET http://localhost:3000/api/supabase-pulse` | `HTTP 200`, JSON response with all 4 endpoints queried |
| **Localhost Startup** | Verified in `components/providers/AppProviders.tsx` | Fires immediately on app mount + 25 min interval |
| **TypeScript Typecheck** | `npx tsc --noEmit` | **0 errors** |
