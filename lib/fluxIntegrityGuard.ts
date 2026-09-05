/**
 * ZENVITRA PLATFORM INTEGRITY & CIVIC FACT-CHECKING ENGINE
 * 
 * Strict Secular & Academic Policy Charter:
 * 1. Prohibits all religious devotional clickbait, prayer chains, scripture forwards, and proselytization across ALL traditions (Quran, Jesus/Bible, Hanuman/Gita, Waheguru, etc.).
 * 2. Intercepts fake political conspiracy theories, hate propaganda, and fabricated sensationalism.
 * 3. Enforces verified, legitimate institutional and academic source citations.
 */

export interface IntegrityCheckResult {
  passed: boolean;
  score: number; // 0 to 100
  status: 'VERIFIED' | 'REJECTED';
  violationType?: 'DEVOTIONAL_SPAM' | 'FAKE_POLITICAL_PROPAGANDA' | 'INVALID_SOURCE' | 'SENSATIONALIST_CLICKBAIT';
  reasons: string[];
  auditedAt: string;
}

// Comprehensive multi-tradition devotional & scripture forward terms (Platform strictly reserved for Youth Policy, Innovation, Action & Journalism)
const COMPREHENSIVE_DEVOTIONAL_TERMS = [
  // Islamic Devotional & Scripture Forwards
  'quran',
  'quranic verse',
  'surah',
  'allahu akbar',
  'subhanallah',
  'mashaallah',
  'alhamdulillah forward',
  'naat status',
  'naat sharif',
  'jumma mubarak',
  'deen status',
  'islamic status',
  'hadith forward',
  'dua status',
  'namaz status',
  'jannat status',
  'quran recitation reel',
  'share this dua',

  // Christian Devotional & Scripture Forwards
  'jesus',
  'jesus christ',
  'bible verse',
  'holy bible',
  'gospel status',
  'holy spirit',
  'praise the lord',
  'hallelujah',
  'christian status',
  'pastor sermon',
  'church blessing',
  'amen to receive',
  'type amen',
  'jesus loves you forward',
  'christ savior status',

  // Hindu Devotional & Scripture Forwards
  'hanuman',
  'hanuman ji',
  'bajrangbali',
  'jai shree ram',
  'shree ram',
  'radhe radhe',
  'shiva bhajan',
  'har har mahadev',
  'om namah',
  'krishna bhajan',
  'radha krishna status',
  'devotional status',
  'religious reel',
  'bhakti status',
  'bhajan status',
  'aarti status',
  'mandir darshan status',
  'ganesh aarti',
  'katha status',
  'astrology prediction',
  'kundli status',
  'rashifal today',

  // Sikh & Other Devotional Forwards
  'waheguru',
  'satnam waheguru',
  'gurbani status',
  'shabad status',
  'kirtan status',

  // Universal Devotional Clickbait & Chain Messages
  'god blessing',
  'god will bless you',
  'forward to 10',
  'forward to 5',
  'share to 10 people',
  'share to 20',
  'miracle if you like',
  'comment amen',
  'prayer chain',
  'swarg',
  'narak',
  'curse if you skip',
  'blessing if you share',
  'religious chain message'
];

// Sensationalist fake political / clickbait conspiracy trigger patterns
const SENSATIONALIST_POLITICAL_PATTERNS = [
  /\b(secret conspiracy exposed|shocking hidden truth|all politicians are corrupt|fake election stolen|secret deep state plot)\b/i,
  /\b(viral exposed leaked video|must watch before deleted|100% real no fake)\b/i,
  /\b(modi vs rahul secret audio|communal riot exposed|hate speech viral)\b/i,
  /\b(illuminati secret youth control|they dont want you to know this)\b/i,
  /\b(secret foreign conspiracy against nation|shocking truth of leaders)\b/i
];

// Disallowed placeholder / invalid source domains
const FAKE_SOURCE_DOMAINS = [
  'example.com',
  'example.org',
  'test.com',
  'fake.com',
  'null.com',
  'localhost',
  '127.0.0.1',
  'youtube.com/watch?v=fake',
  'instagram.com/reel/fake'
];

/**
 * Evaluates a FLUX dispatch for compliance with Zenvitra's Civic Research & Integrity Charter
 */
export function auditFluxDispatch(data: {
  caption: string;
  sourceName: string;
  sourceUrl: string;
  tags?: string[];
}): IntegrityCheckResult {
  const reasons: string[] = [];
  let score = 100;
  let violationType: IntegrityCheckResult['violationType'] = undefined;

  const textToScan = `${data.caption} ${data.sourceName} ${(data.tags || []).join(' ')}`.toLowerCase();

  // 1. Comprehensive Devotional / Religious Spam Check
  for (const term of COMPREHENSIVE_DEVOTIONAL_TERMS) {
    if (textToScan.includes(term.toLowerCase())) {
      score -= 85;
      violationType = 'DEVOTIONAL_SPAM';
      reasons.push(
        `Detected religious/devotional term or forward pattern ("${term}"). Zenvitra is strictly dedicated to Youth Policy, Civic Innovation, Journalism, and Grassroots Action.`
      );
      break;
    }
  }

  // 2. Sensationalist Political Fake / Conspiracy Check
  for (const pattern of SENSATIONALIST_POLITICAL_PATTERNS) {
    if (pattern.test(textToScan)) {
      score -= 60;
      if (!violationType) violationType = 'FAKE_POLITICAL_PROPAGANDA';
      reasons.push('Detected unverified sensationalist political claim or conspiracy framing without verified institutional proof.');
      break;
    }
  }

  // 3. Source Verification Check
  const trimmedUrl = data.sourceUrl.trim().toLowerCase();
  const trimmedSource = data.sourceName.trim();

  if (!trimmedSource || trimmedSource.length < 3) {
    score -= 50;
    if (!violationType) violationType = 'INVALID_SOURCE';
    reasons.push('Source entity name is missing or too short. A legitimate institution, news wire, or verified summit archive is required.');
  }

  try {
    const parsedUrl = new URL(trimmedUrl);
    
    const isFakeDomain = FAKE_SOURCE_DOMAINS.some((fake) => parsedUrl.hostname.includes(fake));
    if (isFakeDomain) {
      score -= 70;
      if (!violationType) violationType = 'INVALID_SOURCE';
      reasons.push(`Invalid placeholder or unverified source domain ("${parsedUrl.hostname}"). Please provide a legitimate citation link.`);
    }

    if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
      score -= 50;
      if (!violationType) violationType = 'INVALID_SOURCE';
      reasons.push('Source link must use a valid HTTP or HTTPS web protocol.');
    }
  } catch (_) {
    score -= 60;
    if (!violationType) violationType = 'INVALID_SOURCE';
    reasons.push('Source citation link is not a valid web URL.');
  }

  const passed = score >= 50 && reasons.length === 0;

  return {
    passed,
    score: Math.max(0, score),
    status: passed ? 'VERIFIED' : 'REJECTED',
    violationType: passed ? undefined : violationType || 'INVALID_SOURCE',
    reasons,
    auditedAt: new Date().toISOString(),
  };
}

/**
 * Evaluates a regular Post dispatch for secular and civic integrity
 */
export function auditPostDispatch(data: {
  content: string;
  location?: string;
  tags?: string[];
}): IntegrityCheckResult {
  const reasons: string[] = [];
  let score = 100;
  let violationType: IntegrityCheckResult['violationType'] = undefined;

  const textToScan = `${data.content} ${data.location || ''} ${(data.tags || []).join(' ')}`.toLowerCase();

  // Devotional / Religious Forward Check
  for (const term of COMPREHENSIVE_DEVOTIONAL_TERMS) {
    if (textToScan.includes(term.toLowerCase())) {
      score -= 85;
      violationType = 'DEVOTIONAL_SPAM';
      reasons.push(
        `Detected religious/devotional term or forward pattern ("${term}"). Zenvitra is dedicated to Ideas, Research, Civic Innovation, Journalism, Senses & Verifiable Sources.`
      );
      break;
    }
  }

  // Sensationalist Political Fake / Conspiracy Check
  for (const pattern of SENSATIONALIST_POLITICAL_PATTERNS) {
    if (pattern.test(textToScan)) {
      score -= 60;
      if (!violationType) violationType = 'FAKE_POLITICAL_PROPAGANDA';
      reasons.push('Detected unverified sensationalist political claim or conspiracy framing.');
      break;
    }
  }

  const passed = score >= 50 && reasons.length === 0;

  return {
    passed,
    score: Math.max(0, score),
    status: passed ? 'VERIFIED' : 'REJECTED',
    violationType: passed ? undefined : violationType || 'SENSATIONALIST_CLICKBAIT',
    reasons,
    auditedAt: new Date().toISOString(),
  };
}
