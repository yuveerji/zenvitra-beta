---
name: no-seeded-data
description: Enforces strict data integrity across ZENVITRA. NO SEEDED DATA NO SEEDED ACCOUNTS ALLOWED. All profiles, feeds, events, passes, and social graphs must initialize completely clean with zero mock or fake accounts.
---

# NO SEEDED DATA NO SEEDED ACCOUNTS ALLOWED

## Sovereign Principle & Iron Law

Under **NO circumstances** may any seeded data, hardcoded mock accounts, simulated user profiles, or artificial social graphs be introduced or attached to real user profiles, database records, state providers, or UI presentations in ZENVITRA.

---

## 1. Absolute Prohibition on Seeded Accounts
* **Zero Fake Users**: Never pre-populate user tables, localStorage, or state stores with fake accounts (e.g. `@yuveer`, `@delegate_one`, demo bots, fake delegates).
* **Authentic Social Graphs**: Followers, following, and friend lists must start at empty (`[]`) and only change through explicit, intentional user interactions.
* **No Artificial Metrics**: Follower counts, like counters, view counts, and engagement scores must NEVER be padded with seeded numbers or default offsets.

---

## 2. Absolute Prohibition on Seeded Event & Conference Data
* **Zero Hardcoded Passes**: Conference listing modals, ticket checkouts, and pass management must NEVER include seeded prices (e.g., hardcoded `1199`), hardcoded tier packages, or default dummy passes. All pass tiers must be 100% organizer-configured.
* **Zero Dummy Registrations / Attendees**: Registration lists, check-in rosters, and country matrices must reflect only genuine registrations stored in the database.
* **Zero Artificial Receipts**: Payment records, Cashfree order IDs, and QR gate passes must only be minted upon real transactions or genuine organizer registrations.

---

## 3. Clean State Default Rule
* All React Contexts, Zustand stores, and state managers:
  - `ZenPulsePlatformContext`
  - `MunContext`
  - `ZenEventsPlatformContext`
  - `ZenPressPlatformContext`
  - `AuthContext`
* Must initialize with clean empty states (`[]`, `null`, `0`) for every newly created or real user.
* No fallback mock data may bleed into production or active development views.

---

## 4. Verification Check Before Delivery
Before any feature or code is deployed or delivered:
1. Verify no arrays are initialized with hardcoded dummy items.
2. Verify pass tiers and configurations are empty or completely user-provided.
3. Verify profiles render actual user state without seeded placeholders.
