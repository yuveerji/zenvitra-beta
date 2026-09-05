import fs from 'fs';
import path from 'path';

export interface GlobalProtocolState {
  maintenanceMode: boolean;
  registrationsOpen: boolean;
  chatMeshEnabled: boolean;
  fluxReelsEnabled: boolean;
  assemblyOsEnabled: boolean;
  escrowMandateActive: boolean;
  zeroSurveillanceActive: boolean;
  readOnlyMode: boolean;
  updatedAt: string;
  updatedBy: string;
}

export interface AdminEnclaveInvite {
  id: string; // e.g. "INV-7842-AX91"
  adminName: string; // e.g. "Rahul (Lead Editor)"
  passcode: string; // uppercase secret code
  role: 'ADMIN' | 'MODERATOR' | 'ORGANIZER';
  singleUse: boolean; // if true, once claimed, cannot be used by anyone else!
  isClaimed: boolean;
  claimedAt?: string;
  claimedByDevice?: string; // user agent
  claimedDeviceId?: string; // unique client fingerprint
  createdAt: string;
  createdBy: string;
  active: boolean;
}

const DEFAULT_STATE: GlobalProtocolState = {
  maintenanceMode: false,
  registrationsOpen: true,
  chatMeshEnabled: true,
  fluxReelsEnabled: true,
  assemblyOsEnabled: true,
  escrowMandateActive: true,
  zeroSurveillanceActive: true,
  readOnlyMode: false,
  updatedAt: new Date().toISOString(),
  updatedBy: '@yuveer (Founder)',
};

const DEFAULT_INVITES: AdminEnclaveInvite[] = [
  {
    id: 'INV-MASTER-ADMIN-01',
    adminName: 'Lead Staff Administrator',
    passcode: 'ZEN-ADMIN-PASS-2026',
    role: 'ADMIN',
    singleUse: false,
    isClaimed: false,
    createdAt: new Date().toISOString(),
    createdBy: '@yuveer (Founder)',
    active: true,
  },
  {
    id: 'INV-OPERATOR-777',
    adminName: 'Technical Operations Chair',
    passcode: 'ZEN-OPERATOR-ACCESS-777',
    role: 'ADMIN',
    singleUse: false,
    isClaimed: false,
    createdAt: new Date().toISOString(),
    createdBy: '@yuveer (Founder)',
    active: true,
  }
];

// In-memory global state
let memoryState: GlobalProtocolState = { ...DEFAULT_STATE };
let memoryInvites: AdminEnclaveInvite[] = [...DEFAULT_INVITES];

// Persistent directory & files
const DATA_DIR = path.resolve(process.cwd(), '.zenvitra_data');
const STATE_FILE = path.resolve(DATA_DIR, 'protocols.json');
const INVITES_FILE = path.resolve(DATA_DIR, 'enclave_invites.json');

function ensureDataFiles() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    // Protocols
    if (fs.existsSync(STATE_FILE)) {
      const raw = fs.readFileSync(STATE_FILE, 'utf8');
      memoryState = { ...DEFAULT_STATE, ...JSON.parse(raw) };
    } else {
      fs.writeFileSync(STATE_FILE, JSON.stringify(memoryState, null, 2), 'utf8');
    }
    // Invites
    if (fs.existsSync(INVITES_FILE)) {
      const rawInvites = fs.readFileSync(INVITES_FILE, 'utf8');
      memoryInvites = JSON.parse(rawInvites);
    } else {
      fs.writeFileSync(INVITES_FILE, JSON.stringify(memoryInvites, null, 2), 'utf8');
    }
  } catch (err) {
    // Fallback to memory
  }
}

// Initialize on load
ensureDataFiles();

export function getGlobalServerProtocols(): GlobalProtocolState {
  try {
    if (fs.existsSync(STATE_FILE)) {
      const raw = fs.readFileSync(STATE_FILE, 'utf8');
      memoryState = { ...DEFAULT_STATE, ...JSON.parse(raw) };
    }
  } catch (_) {}
  return memoryState;
}

export function updateGlobalServerProtocols(partial: Partial<GlobalProtocolState>, operator: string = '@yuveer'): GlobalProtocolState {
  memoryState = {
    ...memoryState,
    ...partial,
    updatedAt: new Date().toISOString(),
    updatedBy: operator,
  };

  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(STATE_FILE, JSON.stringify(memoryState, null, 2), 'utf8');
  } catch (_) {}

  return memoryState;
}

/* ── Admin Enclave Invites Management ── */
export function getAllEnclaveInvites(): AdminEnclaveInvite[] {
  try {
    if (fs.existsSync(INVITES_FILE)) {
      const raw = fs.readFileSync(INVITES_FILE, 'utf8');
      memoryInvites = JSON.parse(raw);
    }
  } catch (_) {}
  return memoryInvites;
}

export function saveEnclaveInvitesToFile() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(INVITES_FILE, JSON.stringify(memoryInvites, null, 2), 'utf8');
  } catch (_) {}
}

export function createEnclaveInvite(
  adminName: string,
  passcode: string,
  role: 'ADMIN' | 'MODERATOR' | 'ORGANIZER' = 'ADMIN',
  singleUse: boolean = true
): AdminEnclaveInvite {
  const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  const id = `INV-${randomNum}-${randomSuffix}`;

  const newInvite: AdminEnclaveInvite = {
    id,
    adminName: adminName.trim(),
    passcode: passcode.trim().toUpperCase(),
    role,
    singleUse,
    isClaimed: false,
    createdAt: new Date().toISOString(),
    createdBy: '@yuveer (Founder)',
    active: true,
  };

  getAllEnclaveInvites();
  memoryInvites.unshift(newInvite);
  saveEnclaveInvitesToFile();
  return newInvite;
}

export function getEnclaveInviteById(id: string): AdminEnclaveInvite | null {
  const all = getAllEnclaveInvites();
  const cleanId = id.trim().toUpperCase();
  return all.find((inv) => inv.id.toUpperCase() === cleanId) || null;
}

export function claimEnclaveInvite(
  id: string,
  passcode: string,
  deviceId: string,
  userAgent: string = 'Browser'
): { success: boolean; invite?: AdminEnclaveInvite; error?: string } {
  const all = getAllEnclaveInvites();
  const cleanId = id.trim().toUpperCase();
  const cleanPasscode = passcode.trim().toUpperCase();

  const inviteIndex = all.findIndex((inv) => inv.id.toUpperCase() === cleanId);
  if (inviteIndex === -1) {
    return { success: false, error: 'Invalid Enclave Link: Invite ID does not exist.' };
  }

  const invite = all[inviteIndex];

  if (!invite.active) {
    return { success: false, error: 'This access link has been revoked by the Founder.' };
  }

  // Check passcode
  if (invite.passcode !== cleanPasscode) {
    return { success: false, error: 'Invalid Authorization Code for this access link.' };
  }

  // Single-use device check
  if (invite.singleUse && invite.isClaimed) {
    if (invite.claimedDeviceId && invite.claimedDeviceId !== deviceId) {
      return { 
        success: false, 
        error: '🚨 Access Denied: This exclusive access link has already been claimed on another device. Nobody else can use this link.' 
      };
    }
  }

  // Mark as claimed and bind to device
  invite.isClaimed = true;
  invite.claimedAt = new Date().toISOString();
  invite.claimedDeviceId = deviceId;
  invite.claimedByDevice = userAgent.slice(0, 100);

  all[inviteIndex] = invite;
  memoryInvites = all;
  saveEnclaveInvitesToFile();

  return { success: true, invite };
}

export function revokeEnclaveInvite(id: string): boolean {
  const all = getAllEnclaveInvites();
  const cleanId = id.trim().toUpperCase();
  const inviteIndex = all.findIndex((inv) => inv.id.toUpperCase() === cleanId);
  if (inviteIndex !== -1) {
    all[inviteIndex].active = false;
    memoryInvites = all;
    saveEnclaveInvitesToFile();
    return true;
  }
  return false;
}
