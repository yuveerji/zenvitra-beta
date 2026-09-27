# NO-SEED.md

## ZENVITRA — No Seeded Examples Rule

**Status:** Mandatory  
**Scope:** Entire ZENVITRA platform  
**Applies to:** Development, staging, production, APIs, databases, UI, dashboards, leaderboards, profiles, events, passports and all user-facing modules.

---

## 1. Core Rule

> **NEVER SEED FAKE, SAMPLE, DEMO, PLACEHOLDER OR FICTIONAL USER DATA INTO THE APPLICATION.**

The application must never create artificial users or activity merely to make the platform appear populated.

This includes, but is not limited to:

* Fake users
* Fake names
* Fake usernames
* Fake profile pictures
* Fake followers
* Fake posts
* Fake comments
* Fake likes
* Fake events
* Fake registrations
* Fake MUN delegates
* Fake Secretariat members
* Fake Executive Board members
* Fake awards
* Fake certificates
* Fake passport records
* Fake leaderboard positions
* Fake ZEN.POINTS
* Fake articles
* Fake contributors
* Fake institution statistics
* Fake analytics
* Fake notifications
* Fake messages
* Fake transactions

---

## 2. Empty State > Fake State

If there is no real data, the interface MUST display an appropriate empty state.

### Example

Instead of:

> #1 Aarav Sharma — 1,240 points

when no real users exist,

display:

> **No rankings yet.**  
> Rankings will appear when verified activity begins.

The platform should look empty rather than misleading.

---

## 3. No Hardcoded User Data

Do not hardcode realistic-looking users inside components.

### ❌ Forbidden

```tsx
const leaderboard = [
  {
    name: "Aarav Sharma",
    username: "@aarav",
    points: 1240
  }
]
```

### ✅ Required

```tsx
const { data: leaderboard } = await getLeaderboard()
```

If the API returns no records:

```tsx
<EmptyState
  title="No rankings yet"
  description="Verified activity will appear here."
/>
```

---

## 4. No Fake Database Seeds

Database seed files must NOT contain fictional production-style users.

### Forbidden

```text
prisma/seed.ts
fixtures/users.ts
mock/users.json
demo-data.json
```

must not contain realistic fake ZENVITRA members that could accidentally enter a deployed database.

---

## 5. Development Testing

When developers need test data, use one of the following:

### Option A — Explicit Test Environment

Test data may exist only in an isolated development/test database.

Every record MUST be clearly marked:

```text
environment = development
is_test = true
```

Test data must never be copied into production.

### Option B — Automated Test Fixtures

Use clearly synthetic identifiers:

```text
test-user-001
test-user-002
```

and never realistic identities.

---

## 6. Production Database

Production data MUST originate from actual platform actions.

Examples:

```text
Real signup
      ↓
Real user
      ↓
Real activity
      ↓
Verification
      ↓
Database record
      ↓
Leaderboard / Passport
```

There must be no shortcut such as:

```text
Database seed
      ↓
Fake user
      ↓
Fake activity
      ↓
Fake leaderboard
```

---

## 7. ZEN.LEADERBOARD

ZEN.LEADERBOARD must contain **only verified, real activity**.

If there are zero eligible users:

```text
ZEN.LEADERBOARD

No rankings yet.

Be among the first to contribute.
```

Do not create artificial rankings to demonstrate the interface.

---

## 8. ZEN.PASSPORT

ZEN.PASSPORT must represent an actual ZENVITRA account.

Do not create example passports such as:

```text
John Doe
@johndoe
ZNV-2026-0001
```

for production.

A passport should exist only after the corresponding account exists.

---

## 9. Events

An event page must not display fake registrations.

### ❌

```text
347 delegates registered
```

if 347 real registrations do not exist.

### ✅

```text
127 delegates registered
```

only when the database contains 127 eligible registrations.

If there are no registrations:

```text
Registrations are now open.
```

---

## 10. Awards & Certificates

Awards and certificates must only be generated from verified event records.

```text
Attendance
      ↓
Participation
      ↓
Organiser verification
      ↓
Award decision
      ↓
Certificate
      ↓
ZEN.PASSPORT
```

No developer, designer or seed script may create fictional awards for users.

---

## 11. Analytics

Analytics must represent actual events.

Never display:

* Fake visitor counts
* Fake registrations
* Fake engagement
* Fake article views
* Fake event attendance
* Fake revenue
* Fake conversion rates

If there is insufficient data:

> **Not enough data yet.**

---

## 12. UI Demonstrations

Designers and developers may need to demonstrate a completed interface.

Use one of these approaches:

### Preferred

Build the UI against an empty/loading state.

### For internal development

Use clearly marked test fixtures:

```text
TEST USER
test-user-001
TEST DATA
```

### Never

Use realistic fictional users that could be mistaken for actual ZENVITRA members.

---

## 13. Demo Mode

If a future demo mode is required, it MUST be explicitly separated from production.

Example:

```text
NEXT_PUBLIC_DEMO_MODE=true
```

Demo mode must:

* Be disabled in production by default.
* Clearly identify simulated data.
* Never write simulated data into the production database.
* Never mix simulated and real rankings.
* Never expose demo records as real ZENVITRA members.

---

## 14. API Rule

APIs must return actual database records.

Do not implement fallback responses containing fake users.

### ❌

```ts
return users.length
  ? users
  : fakeLeaderboardUsers;
```

### ✅

```ts
return users;
```

An empty array is a valid response:

```json
[]
```

The frontend handles the empty state.

---

## 15. No Fake Social Proof

Never fabricate:

* "10,000+ students"
* "500+ delegates"
* "1,000+ members"
* "98% satisfaction"
* "50+ schools"
* "10,000 views"

unless the number is supported by actual platform data or a separately verified source.

---

## 16. Code Review Requirement

Any pull request introducing:

* seed data
* fixtures
* mocks
* demo records
* fallback users
* hardcoded statistics

must be reviewed for accidental production exposure.

Before merging, ask:

> **Can any of this data appear to a real user in production?**

If yes, remove it or isolate it behind a development/test-only mechanism.

---

## 17. Final Principle

**ZENVITRA must never pretend to have a community that it does not yet have.**

A quiet platform is acceptable.

An empty leaderboard is acceptable.

Zero registrations is acceptable.

A "no activity yet" screen is acceptable.

**Fake activity is not.**

---

## Enforcement

This document is a platform-level engineering rule.

All future ZENVITRA modules — including modules created after this document — inherit this rule automatically.

**NO-SEED means NO FAKE DATA IN PRODUCTION.**
