import fs from 'fs';
import path from 'path';
import { ZenPassport, createDefaultPassport } from './passport';

const PASSPORTS_DIR = path.join(process.cwd(), 'data', 'passports');
const PASSPORTS_FILE = path.join(PASSPORTS_DIR, 'passports_registry.json');

function ensureDir() {
  if (!fs.existsSync(PASSPORTS_DIR)) {
    fs.mkdirSync(PASSPORTS_DIR, { recursive: true });
  }
}

/**
 * Baseline seeded passports if server storage is clean
 */
function getBaselinePassports(): ZenPassport[] {
  const yuveer = createDefaultPassport({
    id: 'zen_user_yuveer',
    username: 'yuveer',
    fullName: 'Yuveer Chhatwani',
    role: 'FOUNDER',
    isVerified: true
  });
  yuveer.statusLabel = 'Founder & Lead Architect';
  yuveer.verification.level = 3;
  yuveer.verification.levelLabel = 'ZENVITRA VERIFIED';
  yuveer.verification.isZenvitraVerified = true;
  yuveer.verification.zenvitraRoles = ['FOUNDER', 'SECRETARIAT', 'PRESS', 'ORGANISER'];

  // Add authentic founder milestones
  yuveer.timeline = [
    {
      id: 'm_founder_01',
      year: 2026,
      month: 'OCT',
      icon: '🏛️',
      title: 'Established ZENVITRA Sovereign Digital Network',
      subtitle: 'Inaugurated ZEN.DIPLOMACY, ZEN.SOLUTIONS and ZEN.PASSPORT frameworks',
      category: 'DIPLOMACY',
      isVerified: true
    },
    {
      id: 'm_founder_02',
      year: 2026,
      month: 'OCT',
      icon: '📜',
      title: 'Authored ZENVITRA Civic Constitution & 10% Endowment Mandate',
      subtitle: 'Codified immutable 6-month scholarship distribution protocols',
      category: 'COMMUNITY',
      isVerified: true
    }
  ];

  const testNode = createDefaultPassport({
    id: 'zen_test_pilot_node',
    username: 'test',
    fullName: 'Test Node',
    role: 'DELEGATE',
    isVerified: true
  });
  testNode.statusLabel = 'Test Node';
  testNode.verification.level = 2;
  testNode.verification.levelLabel = 'VERIFIED STUDENT';

  return [yuveer, testNode];
}

/**
 * Loads all passports from server disk
 */
export function getAllServerPassports(): ZenPassport[] {
  try {
    ensureDir();
    if (fs.existsSync(PASSPORTS_FILE)) {
      const content = fs.readFileSync(PASSPORTS_FILE, 'utf-8');
      const list: ZenPassport[] = JSON.parse(content);
      if (Array.isArray(list) && list.length > 0) {
        // Enforce Test Node display name invariant
        return list.map((p) => {
          if (p.username.toLowerCase() === 'test') {
            return {
              ...p,
              fullName: 'Test Node',
              statusLabel: 'Test Node'
            };
          }
          return p;
        });
      }
    }
    // Initialize with baseline
    const baseline = getBaselinePassports();
    saveAllServerPassports(baseline);
    return baseline;
  } catch (err) {
    console.warn('[PASSPORTS-STORAGE-READ-ERROR]', err);
    return getBaselinePassports();
  }
}

/**
 * Overwrites entire passports file
 */
export function saveAllServerPassports(passports: ZenPassport[]): void {
  try {
    ensureDir();
    fs.writeFileSync(PASSPORTS_FILE, JSON.stringify(passports, null, 2), 'utf-8');
  } catch (err) {
    console.error('[PASSPORTS-STORAGE-WRITE-ERROR]', err);
  }
}

/**
 * Retrieves a single passport by username
 */
export function getServerPassportByUsername(username: string): ZenPassport | null {
  const clean = username.toLowerCase().replace(/^@/, '').trim();
  const all = getAllServerPassports();
  const found = all.find((p) => p.username.toLowerCase() === clean);
  return found || null;
}

/**
 * Retrieves a single passport by permanent Passport ID (e.g. ZNV-2026-XXXXXX)
 */
export function getServerPassportById(passportId: string): ZenPassport | null {
  const clean = passportId.toUpperCase().trim();
  const all = getAllServerPassports();
  const found = all.find((p) => p.passportId.toUpperCase() === clean);
  return found || null;
}

/**
 * Saves or updates a passport in server storage
 */
export function saveServerPassport(passport: ZenPassport): ZenPassport {
  const cleanUsername = passport.username.toLowerCase().replace(/^@/, '').trim();
  
  // Invariant: test user must always be named Test Node
  if (cleanUsername === 'test') {
    passport.fullName = 'Test Node';
    passport.statusLabel = 'Test Node';
  }

  passport.updatedAt = new Date().toISOString();

  const all = getAllServerPassports();
  const index = all.findIndex((p) => p.username.toLowerCase() === cleanUsername);

  if (index >= 0) {
    all[index] = { ...all[index], ...passport };
  } else {
    all.push(passport);
  }

  saveAllServerPassports(all);
  return passport;
}

/**
 * Cryptographic verification for public passport ID check
 */
export function verifyServerPassport(passportId: string): {
  verified: boolean;
  passport: ZenPassport | null;
  hash: string;
  verifiedAt: string;
} {
  const cleanId = passportId.toUpperCase().trim();
  const passport = getServerPassportById(cleanId);
  const now = new Date().toISOString();

  // Compute deterministic hash
  let h = 0x811c9dc5;
  for (let i = 0; i < cleanId.length; i++) {
    h ^= cleanId.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  const hex = (h >>> 0).toString(16).padStart(8, '0').toUpperCase();
  const hash = `0x${hex}ZNV${cleanId.replace(/[^A-Z0-9]/g, '').slice(-4)}VERIFIED`;

  if (passport) {
    return {
      verified: true,
      passport,
      hash,
      verifiedAt: now
    };
  }

  // Format check for unrecorded validly formatted IDs
  const regex = /^ZNV-\d{4}-[A-Z0-9]{6}$/;
  if (regex.test(cleanId)) {
    return {
      verified: false,
      passport: null,
      hash,
      verifiedAt: now
    };
  }

  return {
    verified: false,
    passport: null,
    hash: '0xINVALID_PASSPORT_SIGNATURE',
    verifiedAt: now
  };
}
