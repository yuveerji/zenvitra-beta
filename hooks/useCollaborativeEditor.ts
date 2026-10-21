'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { ZenCollabSession, CollaboratorPresence } from '@/lib/collab/ZenCollabSession';

export interface UseCollaborativeEditorOptions {
  docId: string;
  initialHtml: string;
  user: {
    userId?: string;
    username?: string;
    displayName?: string;
    role?: string;
    committee?: string;
  };
  onRemoteUpdate?: (html: string) => void;
}

export function useCollaborativeEditor({
  docId,
  initialHtml,
  user,
  onRemoteUpdate,
}: UseCollaborativeEditorOptions) {
  const [collaborators, setCollaborators] = useState<CollaboratorPresence[]>([]);
  const [connectionStatus, setConnectionStatus] = useState<'CONNECTING' | 'CONNECTED' | 'DISCONNECTED' | 'OFFLINE_BUFFERING'>('CONNECTING');
  const sessionRef = useRef<ZenCollabSession | null>(null);
  const onRemoteUpdateRef = useRef(onRemoteUpdate);
  onRemoteUpdateRef.current = onRemoteUpdate;

  useEffect(() => {
    if (!docId) return;

    const session = new ZenCollabSession(
      docId,
      {
        userId: user.userId,
        username: user.username,
        displayName: user.displayName,
        role: user.role,
        committee: user.committee,
      },
      {
        onContentChange: (html, isRemote) => {
          if (isRemote && onRemoteUpdateRef.current) {
            onRemoteUpdateRef.current(html);
          }
        },
        onPresenceChange: (activePeers) => {
          setCollaborators(activePeers);
        },
        onConnectionStatus: (status) => {
          setConnectionStatus(status);
        },
      }
    );

    // Seed initial content into Yjs if local document was empty
    if (initialHtml && !session.getContent()) {
      session.updateContent(initialHtml);
    }

    sessionRef.current = session;

    return () => {
      session.destroy();
      sessionRef.current = null;
    };
  }, [docId, user.userId, user.username, user.displayName, user.role, user.committee]);

  const sendLocalChange = useCallback((newHtml: string) => {
    sessionRef.current?.updateContent(newHtml);
  }, []);

  const sendCursorPosition = useCallback((index: number, selection?: { from: number; to: number } | null) => {
    sessionRef.current?.updateCursor(index, selection);
  }, []);

  return {
    collaborators,
    connectionStatus,
    sendLocalChange,
    sendCursorPosition,
    collabSession: sessionRef.current,
  };
}
