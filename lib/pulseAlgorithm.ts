/**
 * ZEN.PULSE SMART ALGORITHM ENGINE
 * 
 * Inspired by Instagram's multi-stage ranking & interleaving pipeline:
 * 1. Candidate Generation & Filtering
 * 2. Affinity & Follower Priority Scoring
 * 3. Freshness & Recency Boost (Guarantees new items appear up front / in the middle, not buried at the end)
 * 4. Engagement & Discussion Velocity Weighting
 * 5. Slot-Based Interleaving Matrix (Followings + Fresh Discovery + Trending)
 */

import { PulsePost } from '@/types/pulse';

export type FeedAlgorithmTab = 'foryou' | 'following' | 'latest' | 'trending' | 'politics' | 'media' | 'liked' | 'myposts';

export interface RankedPulsePost extends PulsePost {
  feedReason?: 'following' | 'fresh' | 'trending' | 'own' | 'foryou';
  rankScore?: number;
}

interface RankOptions {
  posts: PulsePost[];
  currentUserId?: string;
  currentUserUsername?: string;
  isFollowing: (username: string) => boolean;
  tab?: FeedAlgorithmTab;
}

/**
 * Calculates raw algorithmic score for a single post
 */
export function calculatePostScore(
  post: PulsePost,
  currentUserId?: string,
  currentUserUsername?: string,
  isFollowing?: (username: string) => boolean
): number {
  let score = 0;
  const now = Date.now();
  const createdTime = new Date(post.createdAt).getTime();
  const ageMs = Math.max(0, now - createdTime);
  const ageMinutes = ageMs / (1000 * 60);
  const ageHours = ageMinutes / 60;

  const isOwn = (currentUserId && post.authorId === currentUserId) || 
                (currentUserUsername && post.authorUsername.toLowerCase() === currentUserUsername.toLowerCase());
  const authorFollowing = isFollowing ? isFollowing(post.authorUsername) : false;

  // ─── 1. AFFINITY BOOST (Following & Self) ───
  if (isOwn) {
    // User's own posts get a strong boost if recent so they immediately see their dispatch
    score += ageHours < 12 ? 140 : 50;
  } else if (authorFollowing) {
    // People you follow get primary prominence (Instagram Core rule)
    score += 120;
  }

  // ─── 2. FRESHNESS / RECENCY BOOST (New items jump to upper-middle slots!) ───
  // User directive: "joh naya item usko pehle bich mei kahi daalo aakhri aakhri mei nhi"
  if (ageMinutes <= 15) {
    score += 220; // Massive boost for brand new dispatches
  } else if (ageMinutes <= 60) {
    score += 170;
  } else if (ageHours <= 3) {
    score += 120;
  } else if (ageHours <= 12) {
    score += 75;
  } else if (ageHours <= 24) {
    score += 40;
  } else if (ageHours <= 48) {
    score += 15;
  } else {
    // Smooth time decay for older posts
    score -= Math.min(60, (ageHours - 48) * 0.8);
  }

  // ─── 3. ENGAGEMENT VELOCITY (Likes, Comments, Reposts) ───
  const likesCount = (post.likes || 0) + (post.likedBy ? post.likedBy.length : 0);
  const repliesCount = post.replyCount || 0;
  const repostsCount = (post.reposts || 0) + (post.repostedBy ? post.repostedBy.length : 0);

  // Discussions and replies count more heavily than passive likes
  score += Math.min(80, likesCount * 4);
  score += Math.min(100, repliesCount * 8);
  score += Math.min(60, repostsCount * 6);

  // ─── 4. RICH MEDIA & CIVIC VALUE BONUS ───
  if (post.images && post.images.length > 0) score += 18;
  if (post.speechAudioUrl || post.speechVideoUrl) score += 25;
  if (post.isTreaty || post.postType === 'treaty') score += 25;
  if (post.tags && post.tags.length > 0) score += 8;

  return score;
}

/**
 * Modern Instagram-style smart feed ranker with slot interleaving.
 * Guarantees fresh new items are interspersed right in the top & middle (slot 1, 3, 5)
 * rather than pushed down to the end!
 */
export function rankPulseFeed({
  posts,
  currentUserId,
  currentUserUsername,
  isFollowing,
  tab = 'foryou'
}: RankOptions): RankedPulsePost[] {
  if (!posts || posts.length === 0) return [];

  const now = Date.now();

  // ─── TAB: LATEST (Pure Chronological) ───
  if (tab === 'latest') {
    return [...posts]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .map(p => ({ ...p, feedReason: 'fresh' as const }));
  }

  // ─── TAB: FOLLOWING (Followings + Self, sorted by freshness & score) ───
  if (tab === 'following') {
    const followingPosts = posts.filter(
      p => isFollowing(p.authorUsername) || 
           (currentUserUsername && p.authorUsername.toLowerCase() === currentUserUsername.toLowerCase()) ||
           (currentUserId && p.authorId === currentUserId)
    );

    return followingPosts
      .map(p => ({
        ...p,
        feedReason: ((p.authorId === currentUserId || p.authorUsername === currentUserUsername) ? 'own' : 'following') as 'own' | 'following',
        rankScore: calculatePostScore(p, currentUserId, currentUserUsername, isFollowing)
      }))
      .sort((a, b) => (b.rankScore || 0) - (a.rankScore || 0));
  }

  // ─── TAB: TRENDING (Highest engagement velocity) ───
  if (tab === 'trending') {
    return [...posts]
      .map(p => {
        const eng = (p.likes || 0) + (p.replyCount || 0) * 2 + (p.reposts || 0) * 1.5;
        return {
          ...p,
          feedReason: 'trending' as const,
          rankScore: eng
        };
      })
      .sort((a, b) => (b.rankScore || 0) - (a.rankScore || 0));
  }

  // ─── TAB: POLITICS & POLICY (Verified Civic & Political Wire) ───
  if (tab === 'politics') {
    const politicalTags = new Set([
      'politics', 'policy', 'governance', 'parliament', 'geopolitics', 
      'election', 'treaty', 'civic', 'constitution', 'sovereign', 'mun', 'law', 'diplomacy'
    ]);

    return posts
      .filter(p => {
        const hasSource = Boolean(p.sourceName || (p.citations && p.citations.length > 0));
        const isTreaty = Boolean(p.isTreaty || p.postType === 'treaty' || p.caucusTag);
        const matchesTag = (p.tags || []).some(t => politicalTags.has(t.toLowerCase()));
        const matchesContent = /\b(bill|act|parliament|lok sabha|rajya sabha|supreme court|treaty|resolution|amendment|senate|un|unsc|elections|governance|policy|minister|sovereign)\b/i.test(p.content);
        return hasSource || isTreaty || matchesTag || matchesContent;
      })
      .map(p => ({
        ...p,
        feedReason: (p.sourceName ? 'fresh' : 'trending') as 'fresh' | 'trending',
        rankScore: calculatePostScore(p, currentUserId, currentUserUsername, isFollowing) + (p.sourceName ? 50 : 20)
      }))
      .sort((a, b) => (b.rankScore || 0) - (a.rankScore || 0));
  }

  // ─── TAB: FOR YOU (Smart Instagram Algorithm with Slot Interleaving) ───
  // Step 1: Bucket posts into 3 distinct categories
  const followingBucket: RankedPulsePost[] = [];
  const freshDiscoveryBucket: RankedPulsePost[] = [];
  const trendingDiscoveryBucket: RankedPulsePost[] = [];

  const cleanUser = (currentUserUsername || '').toLowerCase();

  posts.forEach(p => {
    const isOwn = (currentUserId && p.authorId === currentUserId) || 
                  (cleanUser && p.authorUsername.toLowerCase() === cleanUser);
    const followsAuthor = isFollowing(p.authorUsername);
    const ageHours = (now - new Date(p.createdAt).getTime()) / (1000 * 60 * 60);
    const score = calculatePostScore(p, currentUserId, currentUserUsername, isFollowing);

    if (isOwn) {
      followingBucket.push({ ...p, feedReason: 'own', rankScore: score });
    } else if (followsAuthor) {
      followingBucket.push({ ...p, feedReason: 'following', rankScore: score });
    } else if (ageHours <= 24) {
      // Fresh new post from community (User wanted this in top/middle!)
      freshDiscoveryBucket.push({ ...p, feedReason: 'fresh', rankScore: score });
    } else {
      trendingDiscoveryBucket.push({ ...p, feedReason: 'foryou', rankScore: score });
    }
  });

  // Step 2: Sort internal buckets by score
  followingBucket.sort((a, b) => (b.rankScore || 0) - (a.rankScore || 0));
  freshDiscoveryBucket.sort((a, b) => (b.rankScore || 0) - (a.rankScore || 0));
  trendingDiscoveryBucket.sort((a, b) => (b.rankScore || 0) - (a.rankScore || 0));

  // Step 3: Slot Interleaving Pattern (Instagram Feed Architecture)
  // Pattern:
  // Slot 0: Following / Own post
  // Slot 1: Fresh Discovery item (Brand new post inserted right here in position 2!)
  // Slot 2: Following post
  // Slot 3: Trending Discovery
  // Slot 4: Fresh Discovery item (Interleaved right into middle!)
  // Slot 5: Following post
  // Slot 6: Trending Discovery
  const interleaved: RankedPulsePost[] = [];
  const seenIds = new Set<string>();

  const pushUnique = (post?: RankedPulsePost) => {
    if (post && !seenIds.has(post.id)) {
      seenIds.add(post.id);
      interleaved.push(post);
    }
  };

  let fIdx = 0;
  let freshIdx = 0;
  let trendIdx = 0;

  const totalPosts = posts.length;

  while (interleaved.length < totalPosts) {
    const prevCount = interleaved.length;

    // Pattern step 1: Following post
    if (fIdx < followingBucket.length) {
      pushUnique(followingBucket[fIdx++]);
    }

    // Pattern step 2: Fresh Discovery (NEW ITEM IN UPPER/MIDDLE!)
    if (freshIdx < freshDiscoveryBucket.length) {
      pushUnique(freshDiscoveryBucket[freshIdx++]);
    }

    // Pattern step 3: Following post
    if (fIdx < followingBucket.length) {
      pushUnique(followingBucket[fIdx++]);
    }

    // Pattern step 4: Trending Discovery
    if (trendIdx < trendingDiscoveryBucket.length) {
      pushUnique(trendingDiscoveryBucket[trendIdx++]);
    }

    // Pattern step 5: Another Fresh Discovery in the middle
    if (freshIdx < freshDiscoveryBucket.length) {
      pushUnique(freshDiscoveryBucket[freshIdx++]);
    }

    // Fallback: if all pools are exhausted or no new items were added
    if (interleaved.length === prevCount) {
      // Drain whichever bucket still has remaining items
      while (fIdx < followingBucket.length) pushUnique(followingBucket[fIdx++]);
      while (freshIdx < freshDiscoveryBucket.length) pushUnique(freshDiscoveryBucket[freshIdx++]);
      while (trendIdx < trendingDiscoveryBucket.length) pushUnique(trendingDiscoveryBucket[trendIdx++]);
      break;
    }
  }

  return interleaved;
}
