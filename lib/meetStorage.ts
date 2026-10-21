import { ZenMeetRoom } from '@/types/meet';

const STORAGE_KEY = 'zenvitra_meet_rooms_v2';

export function generateMeetingCode(type: string = 'ZEN'): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let p1 = '';
  let p2 = '';
  for (let i = 0; i < 4; i++) {
    p1 += chars.charAt(Math.floor(Math.random() * chars.length));
    p2 += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `ZEN-${p1}-${p2}`;
}

export function getStoredRooms(): ZenMeetRoom[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.error('Error loading rooms from storage', e);
    return [];
  }
}

export function saveStoredRoom(room: ZenMeetRoom): void {
  if (typeof window === 'undefined') return;
  try {
    const current = getStoredRooms();
    const existingIdx = current.findIndex(r => r.id === room.id || r.roomCode === room.roomCode);
    let updated: ZenMeetRoom[];
    if (existingIdx >= 0) {
      updated = [...current];
      updated[existingIdx] = room;
    } else {
      updated = [room, ...current];
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event('zenvitra_rooms_updated'));
  } catch (e) {
    console.error('Error saving room to storage', e);
  }
}

export function deleteStoredRoom(roomId: string): void {
  if (typeof window === 'undefined') return;
  try {
    const current = getStoredRooms();
    const updated = current.filter(r => r.id !== roomId && r.roomCode !== roomId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event('zenvitra_rooms_updated'));
  } catch (e) {
    console.error('Error deleting room from storage', e);
  }
}

export function getRoomByIdOrCode(codeOrId: string): ZenMeetRoom | null {
  const rooms = getStoredRooms();
  const normalized = codeOrId.trim().toUpperCase();
  return rooms.find(r => 
    r.id.toUpperCase() === normalized || 
    r.roomCode.toUpperCase() === normalized
  ) || null;
}
