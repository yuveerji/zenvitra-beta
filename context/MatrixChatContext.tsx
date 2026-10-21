'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useZenChat } from '@/context/ZenChatPlatformContext';
import { 
  CommitteeMatrixRoom, 
  CreateMatrixRoomPayload, 
  UpdateMatrixRoomPayload 
} from '@/types/matrixChat';

interface MatrixChatContextType {
  rooms: CommitteeMatrixRoom[];
  loading: boolean;
  error: string | null;
  pendingCount: number;
  
  // Queries
  fetchRooms: (munId?: string, committeeId?: string, eventDate?: string) => Promise<void>;
  getRoom: (munId: string, committeeId: string, eventDate: string) => CommitteeMatrixRoom | undefined;
  
  // Actions
  connectMatrixRoom: (payload: Omit<CreateMatrixRoomPayload, 'requester'>) => Promise<{ success: boolean; room?: CommitteeMatrixRoom; error?: string; isDuplicate?: boolean }>;
  approveRoom: (roomId: string, notes?: string) => Promise<{ success: boolean; room?: CommitteeMatrixRoom; error?: string }>;
  rejectRoom: (roomId: string, reason?: string) => Promise<{ success: boolean; room?: CommitteeMatrixRoom; error?: string }>;
  reconfigureRoom: (payload: Omit<UpdateMatrixRoomPayload, 'actor' | 'action'>) => Promise<{ success: boolean; room?: CommitteeMatrixRoom; error?: string }>;
  disconnectRoom: (roomId: string) => Promise<{ success: boolean; error?: string }>;
  
  // ZEN.CHAT Bridge
  openInZenChat: (room: CommitteeMatrixRoom) => void;
}

const MatrixChatContext = createContext<MatrixChatContextType | undefined>(undefined);

export function MatrixChatProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user } = useAuth();
  const { conversations, createGroupChat, setActiveConversationId, sendMessage } = useZenChat();

  const [rooms, setRooms] = useState<CommitteeMatrixRoom[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const pendingCount = useMemo(() => {
    return rooms.filter(r => r.status === 'PENDING_APPROVAL').length;
  }, [rooms]);

  /**
   * Fetch rooms from backend API with optional filters
   */
  const fetchRooms = useCallback(async (munId?: string, committeeId?: string, eventDate?: string) => {
    try {
      setLoading(true);
      setError(null);
      const params = new URLSearchParams();
      if (munId) params.append('munId', munId);
      if (committeeId) params.append('committeeId', committeeId);
      if (eventDate) params.append('eventDate', eventDate);
      if (user?.role) params.append('userRole', user.role);
      if (user?.id) params.append('userId', user.id);

      const res = await fetch(`/api/matrix/rooms?${params.toString()}`, {
        cache: 'no-store'
      });
      const data = await res.json();

      if (data.success && Array.isArray(data.rooms)) {
        setRooms(data.rooms);
      } else {
        setError(data.error || 'Failed to fetch rooms');
      }
    } catch (err: any) {
      setError(err.message || 'Network error fetching Matrix rooms');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

  /**
   * Helper to retrieve room matching active MUN, Committee, and Date
   */
  const getRoom = useCallback((munId: string, committeeId: string, eventDate: string): CommitteeMatrixRoom | undefined => {
    const normDate = eventDate.slice(0, 10);
    return rooms.find(r => 
      r.munId.toLowerCase() === munId.toLowerCase() &&
      (r.committeeId.toLowerCase() === committeeId.toLowerCase() || r.committeeShort.toLowerCase() === committeeId.toLowerCase()) &&
      r.eventDate.slice(0, 10) === normDate &&
      r.status !== 'DISCONNECTED'
    );
  }, [rooms]);

  /**
   * Connect Matrix Room (Direct or Secretariat Discretion)
   */
  const connectMatrixRoom = useCallback(async (payload: Omit<CreateMatrixRoomPayload, 'requester'>) => {
    try {
      setLoading(true);
      setError(null);

      const requester = {
        id: user?.id || 'anon_user',
        name: user?.name || user?.username || 'Delegate',
        username: user?.username || 'delegate',
        role: user?.role || 'DELEGATE'
      };

      const res = await fetch('/api/matrix/rooms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...payload, requester })
      });

      const data = await res.json();

      if (data.success && data.room) {
        setRooms(prev => {
          const filtered = prev.filter(r => r.id !== data.room.id);
          return [data.room, ...filtered];
        });

        // If direct connect or approved, bridge into ZEN.CHAT
        if (data.room.status === 'ACTIVE') {
          syncToZenChat(data.room);
        }

        return { success: true, room: data.room };
      } else {
        return { 
          success: false, 
          error: data.error || 'Failed to connect Matrix room',
          isDuplicate: data.isDuplicate,
          room: data.room
        };
      }
    } catch (err: any) {
      return { success: false, error: err.message || 'Network error connecting Matrix room' };
    } finally {
      setLoading(false);
    }
  }, [user]);

  /**
   * Secretariat Action: Approve Room
   */
  const approveRoom = useCallback(async (roomId: string, notes?: string) => {
    try {
      setLoading(true);
      const actor = {
        id: user?.id || 'sec_user',
        name: user?.name || user?.username || 'Secretariat Officer',
        username: user?.username || 'secretariat',
        role: user?.role || 'SECRETARIAT',
        roles: (user as any)?.zenvitraRoles || ['SECRETARIAT']
      };

      const res = await fetch(`/api/matrix/rooms/${roomId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'APPROVE', actor, notes })
      });

      const data = await res.json();

      if (data.success && data.room) {
        setRooms(prev => prev.map(r => r.id === roomId ? data.room : r));
        syncToZenChat(data.room);
        return { success: true, room: data.room };
      } else {
        return { success: false, error: data.error || 'Failed to approve room' };
      }
    } catch (err: any) {
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, [user]);

  /**
   * Secretariat Action: Reject Room
   */
  const rejectRoom = useCallback(async (roomId: string, reason?: string) => {
    try {
      setLoading(true);
      const actor = {
        id: user?.id || 'sec_user',
        name: user?.name || user?.username || 'Secretariat Officer',
        username: user?.username || 'secretariat',
        role: user?.role || 'SECRETARIAT',
        roles: (user as any)?.zenvitraRoles || ['SECRETARIAT']
      };

      const res = await fetch(`/api/matrix/rooms/${roomId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'REJECT', actor, reason })
      });

      const data = await res.json();

      if (data.success && data.room) {
        setRooms(prev => prev.map(r => r.id === roomId ? data.room : r));
        return { success: true, room: data.room };
      } else {
        return { success: false, error: data.error || 'Failed to reject room' };
      }
    } catch (err: any) {
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, [user]);

  /**
   * Secretariat Action: Reconfigure Room
   */
  const reconfigureRoom = useCallback(async (payload: Omit<UpdateMatrixRoomPayload, 'actor' | 'action'>) => {
    try {
      setLoading(true);
      const actor = {
        id: user?.id || 'sec_user',
        name: user?.name || user?.username || 'Secretariat Officer',
        username: user?.username || 'secretariat',
        role: user?.role || 'SECRETARIAT',
        roles: (user as any)?.zenvitraRoles || ['SECRETARIAT']
      };

      const res = await fetch(`/api/matrix/rooms/${payload.roomId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'RECONFIGURE', actor, ...payload })
      });

      const data = await res.json();

      if (data.success && data.room) {
        setRooms(prev => prev.map(r => r.id === payload.roomId ? data.room : r));
        return { success: true, room: data.room };
      } else {
        return { success: false, error: data.error || 'Failed to reconfigure room' };
      }
    } catch (err: any) {
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, [user]);

  /**
   * Disconnect Room
   */
  const disconnectRoom = useCallback(async (roomId: string) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/matrix/rooms/${roomId}`, {
        method: 'DELETE',
        headers: {
          'x-user-id': user?.id || '',
          'x-user-name': user?.name || user?.username || '',
          'x-user-handle': user?.username || '',
          'x-user-role': user?.role || 'DELEGATE'
        }
      });
      const data = await res.json();
      if (data.success) {
        setRooms(prev => prev.filter(r => r.id !== roomId));
        return { success: true };
      }
      return { success: false, error: data.error };
    } catch (err: any) {
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, [user]);

  /**
   * Sync active Matrix room into ZEN.CHAT conversation store
   */
  const syncToZenChat = useCallback((room: CommitteeMatrixRoom) => {
    try {
      const existing = conversations.find(c => c.id === room.conversationId || c.handle === room.matrixRoomAlias);
      if (!existing) {
        const title = `${room.committeeShort} • ${room.munName}`;
        const desc = `Matrix Room: ${room.matrixRoomAlias} (${room.eventDate})`;
        
        createGroupChat(
          title,
          [
            {
              id: user?.id || 'delegate_self',
              name: user?.name || user?.username || 'Delegate',
              username: user?.username || 'delegate',
              role: user?.role || 'delegate',
              status: 'online'
            }
          ],
          desc
        );
      }
    } catch (err) {
      console.warn('[MATRIX-ZENCHAT-SYNC-WARN]', err);
    }
  }, [conversations, createGroupChat, user]);

  /**
   * Opens linked conversation directly in ZEN.CHAT
   */
  const openInZenChat = useCallback((room: CommitteeMatrixRoom) => {
    syncToZenChat(room);
    setActiveConversationId(room.conversationId);
    router.push(`/chat?preview=mesh&conversationId=${encodeURIComponent(room.conversationId)}`);
  }, [syncToZenChat, setActiveConversationId, router]);

  const value = useMemo(() => ({
    rooms,
    loading,
    error,
    pendingCount,
    fetchRooms,
    getRoom,
    connectMatrixRoom,
    approveRoom,
    rejectRoom,
    reconfigureRoom,
    disconnectRoom,
    openInZenChat
  }), [
    rooms,
    loading,
    error,
    pendingCount,
    fetchRooms,
    getRoom,
    connectMatrixRoom,
    approveRoom,
    rejectRoom,
    reconfigureRoom,
    disconnectRoom,
    openInZenChat
  ]);

  return (
    <MatrixChatContext.Provider value={value}>
      {children}
    </MatrixChatContext.Provider>
  );
}

export function useMatrixChat() {
  const context = useContext(MatrixChatContext);
  if (!context) {
    throw new Error('useMatrixChat must be used within a MatrixChatProvider');
  }
  return context;
}
