# Strict Data Integrity Rule: Zero Seeded / Fake Data for Real User Accounts

## Core Mandates
1. **Never Inject Seeded Accounts into Real Profiles**:
   - Real user accounts (e.g. `@yuveer`, `@yuveerji`, or newly signed-up/authenticated members) must ALWAYS initialize with ZERO fake followers, ZERO fake following, ZERO fake posts, ZERO fake reels/fluxes, and ZERO fake Model UN experiences.
   - When a user signs in, their profile, feed, dossier, and statistics must strictly reflect genuine user data.

2. **No Fake Followers or Auto-Populated Graphs**:
   - Do NOT pre-fill `followers` or `following` arrays with hardcoded handles or generated fake users.
   - Follower counts must only increment when actual follow actions are performed.

3. **Isolated Demo/Mock Accounts Only**:
   - Mock examples, if any, are strictly confined to dedicated demo mock environments and must NEVER pollute or attach themselves to authentic user IDs, localStorage user states, or real profile views.

4. **Clean Default State**:
   - All state providers (`ZenPulsePlatformContext`, `MunContext`, `ZenEventsPlatformContext`, `ZenPressPlatformContext`, `ZenPassContext`) must default to empty arrays `[]` or clean empty objects for real users.
