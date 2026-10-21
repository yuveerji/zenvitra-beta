<div align="center">

# 🏛️ ZENVITRA
### The Sovereign Operating System for Youth Diplomacy, Model Assemblies & Civic Governance

[![Next.js](https://img.shields.io/badge/Next.js-15.0-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![CRDT Engine](https://img.shields.io/badge/Yjs-CRDT_Realtime-orange?style=for-the-badge)](https://yjs.dev/)
[![WebRTC](https://img.shields.io/badge/WebRTC-SFU_Media-333333?style=for-the-badge&logo=webrtc)](https://webrtc.org/)
[![Cashfree Payments](https://img.shields.io/badge/Cashfree-PG_2025--01--01-green?style=for-the-badge)](https://cashfree.com/)

<p align="center">
  <b>One platform. Multiple universes. Zero seeded data. Enterprise-grade execution.</b>
</p>

---

</div>

## 🌐 Executive Overview

**ZENVITRA** is an enterprise-grade digital infrastructure designed to power high-prestige Model United Nations conferences, youth parliaments, university summits, and democratic multi-chamber governance. Engineered with an uncompromising cobalt-blue and silver deep-space design language, ZENVITRA replaces fragmented spreadsheets and ad-hoc video links with an integrated sovereign ecosystem.

---

## 🏛️ Core Architectural Pillars

### 1. 📜 ZEN.DOCS — Real-Time Collaborative Document Engine
- **CRDT-Powered Synthesis**: Built upon **Yjs Operational Transformation / Conflict-free Replicated Data Types (CRDTs)** for true concurrent editing across hundreds of delegates on a single Draft Resolution without race conditions.
- **Parliamentary Syntax Support**: Native structuring for preambulatory and operative clauses, friendly/unfriendly amendments, and multi-sponsor signatures.
- **Deterministic Synchronization**: BroadcastChannel client fallback with automated state persistence, versioned snapshotting, and vector clock resolution.
- **Export Pipeline**: One-click generation of formatted diplomatic resolutions in PDF, Clean Markdown, and Plaintext.

### 2. 🎙️ ZEN.CALL — Scalable Chamber Media Engine
- **SFU-Backed Architecture**: Selective Forwarding Unit (SFU) simulation with adaptive bandwidth negotiation across mobile (4G Jio) and gigabit desktop connections.
- **Bandwidth Profiles**: Dynamic renegotiation between `LOW` (180p, 15fps, 120kbps), `BALANCED` (360p, 24fps, 450kbps), `HIGH` (720p, 30fps, 1.2Mbps), and `ULTRA` (1080p, 30fps, 2.5Mbps).
- **Web Audio VAD**: Browser-native Voice Activity Detection (VAD) via `AudioContext` and `AnalyserNode` with smooth exponential decay meters and active-speaker prioritization.
- **Dais Moderation**: Real-time gavel sound synthesis, deterministic speaker queue management, mic overrides, and procedural caucus timers.

### 3. 🗳️ ZEN.VOTE — Multiversal Democratic Voting Engine
A configurable, platform-wide democratic infrastructure supporting 6 first-class voting modes:
- **Mode A (Individual Democracy)**: One verified delegate = one eligible ballot.
- **Mode B (Universe Representation)**: Sovereign voting weight exercised by recognized universe governors.
- **Mode C (Council / Faction Mandates)**: Caucus-internal voting and bloc representation.
- **Mode D (Ranked Choice / IRV)**: Instant-runoff algorithm computing multi-round preference transfers until an absolute majority emerges.
- **Mode E (Hybrid Double-Majority)**: Requiring simultaneous satisfaction of an individual popular threshold (e.g. 60%) and a universe council majority (e.g. 3 of 5).
- **Mode F (Configurable Consultations)**: Single-choice, approval, yes/no/abstain, and multi-select opinion scales.
- **Election Commissioner Dais**: An authority console for election officers to view, manage, and bulk-import delegates, assign mandate weights, and freeze voter roll snapshots under **Article II (Suffrage & Eligibility)**.
- **Cryptographic Verification**: SHA-256 ballot receipt hashing with independent tally certification by Returning Officers.

### 4. 🎟️ ZEN.PASS & PAYMENTS — Zero-Failure Transaction Pipeline
- **Cashfree PG Integration**: Native backend SDK and REST integration (`API Version 2025-01-01`) supporting UPI, Debit/Credit Cards, and Net Banking.
- **Idempotency & Re-entrancy Protection**: State machine preventing double-charges, expired link handling, and automatic transaction status reconciliation.
- **HMAC Webhook Signatures**: Raw body payload verification using `crypto.createHmac('sha256')` with timing-safe comparisons to eliminate forged payment confirmations.
- **Offline Holographic Gate Passes**: Tamper-proof admission tickets signed with HMAC-SHA256, verifiable at physical venue doors without requiring active internet connectivity.

### 5. 🛡️ Strict Clean State Policy (No Seeded Data Law)
- **Zero Seeded Accounts**: Real accounts initialize clean with 0 fake followers, 0 fake posts, and 0 artificial engagement.
- **Zero Seeded Conferences**: All event tiers, passes, and prices are 100% user- and organizer-configured.
- **Clean State Stores**: All platform contexts initialize with empty states until populated by authenticated, verified actions.

---

## 💻 Tech Stack

| Layer | Technologies |
|---|---|
| **Framework** | Next.js 15 (App Router, React Server Components, Server Actions) |
| **Language** | TypeScript 5.6 (Strict Mode, 100% type-checked) |
| **Styling** | Tailwind CSS 3.4, PostCSS, Lucide React Icons |
| **State & Store** | React Context Architecture, Custom Event Busses, IndexedDB / BroadcastChannel |
| **Realtime Collab** | Yjs CRDTs, Custom Presence & Awareness Providers |
| **Media & Audio** | WebRTC, Web Audio API (`AudioContext`, `AnalyserNode`), Dynamic Synthesizer |
| **Security & Crypto** | Node.js `crypto` (HMAC-SHA256, SHA-256), Secure Cookies |
| **Payments & KYC** | Cashfree PG (`cashfree-pg` SDK, Elements / Drop-in), Cashfree Secure ID |

---

## 📂 Repository Structure

```
zenvitra-beta/
├── app/
│   ├── (auth)/                  # Authentication (Login, Register, Callback)
│   ├── (platform)/              # Protected platform suites (Call, Chat, Events, Matrix)
│   ├── api/
│   │   ├── payments/cashfree/   # Order creation, verification, webhooks
│   │   ├── v1/vote/             # Multiversal voting, ballots, tallying, rolls
│   │   ├── verification/        # KYC verification endpoints
│   │   └── sheets/              # Google Sheets sync engine
│   ├── chamber/                 # Interactive diplomatic floor
│   ├── cv/                      # Diplomatic Curriculum Vitae portfolio
│   ├── mun/                     # MUN Conference Operating System
│   ├── passport/                # Delegate credentials and achievement log
│   └── vote/                    # ZEN.VOTE Multiversal Hub & Observatory
├── components/
│   ├── call/                    # SFU media engine, bandwidth bars, video grid
│   ├── docs/                    # Collaborative editor, bubble menus, formatting
│   ├── events/                  # Event creation, holographic passes, access gates
│   ├── payments/                # Cashfree checkout modals & receipt views
│   └── voting/                  # BallotRoom, CommissionerDais, ResultsObservatory
├── lib/
│   ├── call/                    # WebRTC SFU media engine & VAD audio processors
│   ├── collab/                  # Yjs CRDT session manager
│   ├── ticketCrypto.ts          # HMAC-SHA256 gate ticket generator & verifier
│   └── voting/                  # Ranked-choice, hybrid tally engine & registries
└── types/                       # Shared domain TypeScript definitions
```

---

## ⚡ Quickstart & Local Development

### Prerequisites
- **Node.js**: v18.17+ or v20+ recommended
- **Package Manager**: `npm` or `pnpm`

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yuveerji/zenvitra-beta.git
   cd zenvitra-beta
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env.local` file in the root directory:
   ```env
   # Offline Pass Security Secret
   TICKET_HMAC_SECRET="your_secure_random_hmac_secret_key"

   # App Base URL
   NEXT_PUBLIC_APP_URL="http://localhost:3000"
   ```

4. **Verify TypeScript Compilation**:
   ```bash
   npx tsc --noEmit
   ```

5. **Start the Development Server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Testing & Verification

```bash
# Type check all routes, components, and libraries
npx tsc --noEmit

# Production build test
npm run build
```

---

## 📜 Governance & License

All architectural rights, constitutional definitions, and platform designs are governed by the **Zenvitra Multiversal Charter**.

Designed and developed with precision by the **ZENVITRA Engineering Team**.
