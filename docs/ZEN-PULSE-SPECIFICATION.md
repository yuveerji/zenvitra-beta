# ZEN.PULSE — Master Implementation Specification & Architecture Blueprint
**ZENVITRA Operating Ecosystem — The Connected Youth Social Layer**  
*Document Version: 1.0.0 • Architecture Phase: Canonical Foundation • Date: October 2026*

---

## 1. Executive Summary & Core Principle

**ZEN.PULSE** is the unified social networking and identity operating layer of ZENVITRA. Rather than treating social feeds, direct messages, debate forums, and event passports as disconnected standalone modules, ZEN.PULSE operates on one foundational invariant:

> **One Identity. Every Voice. One Connected Youth Network.**
> Every post, reaction, article, community debate, and verified credential connects back to the single canonical ZENVITRA account.

### Architectural Rules
1. **Canonical Content Model**: Every post published via `ZEN.POST` has a single, immutable canonical ID. Likes, comments, bookmarks, and views remain uniform across `ZEN.FLUX`, profile tabs, community rooms, and shared direct messages.
2. **Zero Seeded / Fake Data**: In strict accordance with `NO-SEED.md`, no fake bot accounts, fabricated metrics, or synthetic followers are permitted. If an account has zero followers, it displays a clean, honest empty state.
3. **Decoupled Popularity vs. Verified Achievement**: High follower counts represent social attention; verified badges represent vetted identity; passport stamps represent real-world event/MUN participation. These claims are tracked and audited separately.

---

## 2. The Master Ecosystem Map

```
                             ┌───────────────────────────────┐
                             │       SHARED ZEN CORE         │
                             │  Accounts · Auth · DB · APIs  │
                             └───────────────┬───────────────┘
                                             │
             ┌───────────────────────────────┴───────────────────────────────┐
             │                                                               │
    ┌────────▼────────┐                                             ┌────────▼────────┐
    │   ZEN.PROFILE   │                                             │  ZEN.PASSPORT   │
    │  Public Identity│                                             │Verifiable Proof │
    └────────┬────────┘                                             └────────┬────────┘
             │                                                               │
             └───────────────────────┬───────────────────────────────────────┘
                                     │
                   ┌─────────────────┴─────────────────┐
                   │   SHARED CONTENT & GRAPH LAYER    │
                   │ Posts · Follows · Reacts · Circles│
                   └─────────────────┬─────────────────┘
                                     │
         ┌───────────────────────────┼───────────────────────────┐
         │                           │                           │
┌────────▼────────┐         ┌────────▼────────┐         ┌────────▼────────┐
│    ZEN.POST     │         │    ZEN.FLUX     │         │   ZEN.CIRCLES   │
│Publishing Studio│         │Discovery & Feeds│         │Communities/Hubs │
└────────┬────────┘         └────────┬────────┘         └────────┬────────┘
         │                           │                           │
         └───────────────────────────┼───────────────────────────┘
                                     │
             ┌───────────────────────┴───────────────────────┐
             │                                               │
    ┌────────▼────────┐                             ┌────────▼────────┐
    │    ZEN.NOTIFY   │                             │   ZEN.SEARCH    │
    │Event Alerts Hub │                             │Ecosystem Search │
    └─────────────────┘                             └─────────────────┘
```

---

## 3. Data Architecture & Relational Schema

The canonical foundation is implemented in PostgreSQL / SQLite Prisma ORM (`prisma/schema.prisma`), enforcing strict database constraints, unique indexes, and referential integrity:

### 3.1 `PulseProfile` — Sovereign Identity
```prisma
model PulseProfile {
  id                      String    @id @default(cuid())
  userId                  String    @unique
  username                String    @unique
  displayName             String
  avatarUrl               String?
  bannerUrl               String?
  bio                     String?
  profileType             String    @default("PERSONAL") // PERSONAL, CREATOR, ORGANISATION, OFFICIAL, TEAM_MANAGED
  organisationName        String?
  website                 String?
  location                String?
  interestsJson           String?   // JSON array of strings
  isVerified              Boolean   @default(false)
  verifiedBadge           String?   // OFFICIAL_DELEGATE, SECRETARIAT, VERIFIED_ORGANISATION
  verificationDetailsJson String?
  followersCount          Int       @default(0)
  followingCount          Int       @default(0)
  postsCount              Int       @default(0)
  karmaScore              Int       @default(100)
  privacySettingsJson     String?
  createdAt               DateTime  @default(now())
  updatedAt               DateTime  @updatedAt
}
```

### 3.2 `PulseFollow` — Directed Social Graph
```prisma
model PulseFollow {
  id          String   @id @default(cuid())
  followerId  String
  followingId String
  createdAt   DateTime @default(now())

  @@unique([followerId, followingId])
}
```

### 3.3 `PulsePostRecord` — Canonical Publishing Record
```prisma
model PulsePostRecord {
  id                 String    @id @default(cuid())
  authorId           String
  authorUsername     String
  authorName         String
  authorAvatar       String?
  authorRole         String    @default("DELEGATE")
  postType           String    @default("STANDARD") // STANDARD, ARTICLE, POLL, ANNOUNCEMENT, THREAD
  title              String?
  content            String
  coverImage         String?
  mediaUrlsJson      String?   // JSON array
  mediaType          String?   // IMAGE, VIDEO, AUDIO, DOCUMENT
  topic              String?
  tagsJson           String?   // JSON array of hashtags
  communityId        String?
  communityName      String?
  audience           String    @default("PUBLIC") // PUBLIC, FOLLOWERS, COMMUNITY, DRAFT
  status             String    @default("PUBLISHED") // DRAFT, QUEUED, PUBLISHED, ARCHIVED
  isPinned           Boolean   @default(false)
  isAnnouncement     Boolean   @default(false)
  readingTimeMinutes Int       @default(1)
  citationsJson      String?   // JSON array of sources/citations
  pollDataJson       String?   // JSON poll configuration
  threadParentId     String?
  canonicalUrl       String?
  likesCount         Int       @default(0)
  repostsCount       Int       @default(0)
  commentsCount      Int       @default(0)
  viewsCount         Int       @default(0)
  bookmarksCount     Int       @default(0)
  publishedAt        DateTime  @default(now())
  createdAt          DateTime  @default(now())
  updatedAt          DateTime  @updatedAt
}
```

### 3.4 `PulseReaction` & `PulseBookmark` — Deduplicated Engagement
```prisma
model PulseReaction {
  id        String   @id @default(cuid())
  postId    String
  userId    String
  type      String   @default("LIKE") // LIKE, APPLAUD, DIPLOMATIC_AGREE, INSIGHTFUL
  createdAt DateTime @default(now())

  @@unique([postId, userId, type])
}

model PulseBookmark {
  id        String   @id @default(cuid())
  postId    String
  userId    String
  createdAt DateTime @default(now())

  @@unique([postId, userId])
}
```

### 3.5 `PulseCommunity` & `PulseCommunityMember` (`ZEN.CIRCLES`)
```prisma
model PulseCommunity {
  id            String    @id @default(cuid())
  slug          String    @unique
  name          String
  description   String
  avatarUrl     String?
  bannerUrl     String?
  type          String    @default("PUBLIC") // PUBLIC, PRIVATE, APPROVAL_BASED
  category      String    @default("GENERAL") // MUN, DIPLOMACY, DEBATE, YOUTH_CLUB, ACADEMIC
  ownerId       String
  ownerUsername String?
  membersCount  Int       @default(1)
  rulesJson     String?   // JSON array string
  linkedEventId String?
  isVerified    Boolean   @default(false)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}

model PulseCommunityMember {
  id          String   @id @default(cuid())
  communityId String
  userId      String
  role        String   @default("MEMBER") // OWNER, ADMIN, MODERATOR, MEMBER
  status      String   @default("ACTIVE") // ACTIVE, PENDING_APPROVAL, BANNED
  joinedAt    DateTime @default(now())

  @@unique([communityId, userId])
}
```

### 3.6 `PulseCredential` (`ZEN.PASSPORT`)
```prisma
model PulseCredential {
  id                 String    @id @default(cuid())
  userId             String
  userUsername       String
  title              String
  category           String    // MUN_PARTICIPATION, DELEGATE_AWARD, ORGANIZER_ROLE, PUBLISHED_ARTICLE
  issuerName         String
  issuerId           String?
  issuerSignature    String?
  credentialId       String    @unique // e.g. CRED-2026-UNSC-098
  proofUrl           String?
  issuedAt           DateTime  @default(now())
  verificationStatus String    @default("VERIFIED") // VERIFIED, CONTESTED, REVOKED
  isPublicOnPassport Boolean   @default(true)
  auditNotes         String?
}
```

---

## 4. Module Deep Dives

### 4.1 ZEN.FLUX — The Discovery Engine
*Endpoint: `GET /api/pulse/posts?feed={feed}`*
- **For You**: Content discovery weighted by relevant youth topics, followed accounts, and debate velocity, free from predatory ad trackers.
- **Following**: Strict chronological stream of dispatches authored by accounts the user explicitly follows (`db.pulseFollow`).
- **Trending**: Real-time velocity score derived from:
  $$\text{Score} = (\text{Likes} \times 1.5) + (\text{Comments} \times 2.5) + (\text{Reposts} \times 3.0) + \text{TagWeight}$$
- **Saved**: Private bookmarked articles and dispatches stored under `db.pulseBookmark`.
- **Topics**: Curated tags (`#Diplomacy`, `#ClimateCOP`, `#PolicyBill`, `#MUN`, `#StudentRights`).

### 4.2 ZEN.POST — The Publishing Studio
*Endpoint: `POST /api/pulse/posts`*
- **Standard Post**: Micro-dispatches with rich markdown, media carousel, mentions (`@username`), and hashtags (`#topic`).
- **Article**: Long-form journalistic essays with headline, cover banner, estimated reading time, citations, and permanent vanity URL.
- **Poll**: Democratic voting cards with tamper-resistant one-vote-per-node enforcement and countdown expiration.
- **Announcement**: Official broadcasts reserved for verified schools, conference secretariats, and platform founders.
- **Thread / Debate**: Multi-turn speech sequences linking arguments in linear chronological order.

### 4.3 ZEN.PROFILE — Sovereign Public Identity
*Endpoint: `GET /api/pulse/profile/[username]`*
- **Personal & Creator Profiles**: Custom bios, verified credential showcases, follower graphs, and published works.
- **Organisation & Official Profiles**: Designed for Model UN secretariats, schools, collegiate youth caucuses, and press desks.
- **Multi-Role Clearance**: Displays verified badges (`ORGANIZER_PRO`, `SECRETARIAT_CHAIR`, `DELEGATE`).

### 4.4 ZEN.PASSPORT — Verifiable Credentials
*Endpoint: `GET /api/pulse/credentials`*
- Connects verified MUN committee attendance, delegate awards, and policy authorship to an immutable cryptographic record.
- Every credential contains a unique `credentialId` (e.g. `CRED-UNSC-2026-042`) and signing authority signature.

### 4.5 ZEN.CIRCLES — Communities & Discussion
*Endpoint: `GET /api/pulse/communities`*
- Dedicated spaces for high school delegations, university debating societies, and regional Model UN conferences.
- Granular permissions: `OWNER`, `ADMIN`, `MODERATOR`, `MEMBER`.

### 4.6 ZEN.SEARCH — Unified Ecosystem Search
*Endpoint: `GET /api/pulse/search?q={query}`*
- Search across People (`db.pulseProfile`), Posts (`db.pulsePostRecord`), Communities (`db.pulseCommunity`), and Credentials (`db.pulseCredential`) in one query.

---

## 5. Master REST API Reference

| Endpoint | Method | Responsibility |
|---|---|---|
| `/api/pulse/posts` | `GET` | Query canonical posts by feed (`for_you`, `following`, `trending`, `saved`), topic, author |
| `/api/pulse/posts` | `POST` | Publish canonical dispatches, articles, polls, and announcements |
| `/api/pulse/posts/[id]` | `GET` | Fetch single canonical post with threaded comments and reaction counts |
| `/api/pulse/posts/[id]` | `PATCH` | Edit content, pin, or archive post |
| `/api/pulse/posts/[id]` | `DELETE` | Cascade-delete post, comments, reactions, and bookmarks |
| `/api/pulse/reactions` | `POST` | Toggle deduplicated reaction (`LIKE`, `APPLAUD`, etc.) |
| `/api/pulse/follow` | `POST` | Follow / unfollow with counter updates and notification triggers |
| `/api/pulse/profile/[username]` | `GET` | Retrieve user profile, stats, published posts, and credentials |
| `/api/pulse/profile/[username]` | `PATCH` | Update profile information, interests, and privacy settings |
| `/api/pulse/search` | `GET` | Query people, posts, communities, and credentials |
| `/api/pulse/notifications` | `GET` | Retrieve notification stream and unread badge count |
| `/api/pulse/notifications` | `PATCH` | Mark notification(s) as read |
| `/api/pulse/communities` | `GET` | List public communities and active memberships |
| `/api/pulse/communities` | `POST` | Create a new community space (`ZEN.CIRCLES`) |
| `/api/pulse/credentials` | `GET` | Fetch verified credentials by user or category |
| `/api/pulse/credentials` | `POST` | Issue a verified credential (Secretariat / Organizer) |

---

## 6. Definition of Done & Quality Checklist

- [x] **Canonical Single-Record Invariant**: One post created in `ZEN.POST` is indexed identically in `ZEN.FLUX`, Profile, Search, and Chat shares.
- [x] **Deduplicated Engagement**: Users cannot submit duplicate likes or follows; database constraints enforce `@@unique([postId, userId, type])`.
- [x] **Zero-Seed Conformance**: State initializes cleanly with no mock / fake sample users.
- [x] **Database Synchronization**: SQLite / PostgreSQL Prisma schema pushed and verified with `npx prisma db push`.
- [x] **TypeScript Type Safety**: Code compiles cleanly with `npx tsc --noEmit` with 0 errors.
