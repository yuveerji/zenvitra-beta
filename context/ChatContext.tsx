'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'secretariat' | 'system';
  text: string;
  image_url?: string;
  timestamp: string;
  officer_name?: string;
}

export interface ChatThread {
  thread_id: string;
  name: string;
  email: string;
  category: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED' | 'ARCHIVED';
  assigned_officer?: string;
  rating?: number;
  feedback?: string;
  messages: ChatMessage[];
  created_at: string;
}

interface ChatContextType {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  activeThread: ChatThread | null;
  setActiveThread: (thread: ChatThread | null) => void;
  threads: ChatThread[];
  startOrOpenThread: (initData: {
    name: string;
    email: string;
    category: string;
    initialMessage?: string;
    image_url?: string;
  }) => void;
  sendMessage: (text: string, image_url?: string) => Promise<void>;
  officerJoinThread: (threadId: string, officerName: string) => void;
  officerSendMessage: (threadId: string, text: string, officerName: string) => void;
  submitRatingAndClose: (threadId: string, rating: number, feedback?: string) => void;
  officerCloseThread: (threadId: string) => void;
  archiveThread: (threadId: string) => void;
  unarchiveThread: (threadId: string) => void;
  deleteThread: (threadId: string) => void;
  viewMode: 'ACTIVE_CHAT' | 'THREADS_LIST' | 'ARCHIVED_LIST';
  setViewMode: (mode: 'ACTIVE_CHAT' | 'THREADS_LIST' | 'ARCHIVED_LIST') => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'ACTIVE_CHAT' | 'THREADS_LIST' | 'ARCHIVED_LIST'>('THREADS_LIST');
  const [threads, setThreads] = useState<ChatThread[]>([]);
  const [activeThread, setActiveThread] = useState<ChatThread | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('zenvitra_user_threads');
      if (stored) {
        const parsed: ChatThread[] = JSON.parse(stored);
        const cleaned = parsed.filter((t: any) => {
          const name = (t.name || '').toLowerCase();
          return !['elena', 'alex', 'test', 'seeded', 'sample'].some(s => name.includes(s));
        });
        setThreads(cleaned);
        if (cleaned.length > 0) setActiveThread(cleaned[0]);
        else setActiveThread(null);
        localStorage.setItem('zenvitra_user_threads', JSON.stringify(cleaned));
      }
    } catch (_) {}

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'zenvitra_user_threads' && e.newValue) {
        const updated: ChatThread[] = JSON.parse(e.newValue);
        setThreads(updated);
        setActiveThread((prev) => (prev ? updated.find((t) => t.thread_id === prev.thread_id) || prev : null));
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const persistThreads = (updatedThreads: ChatThread[]) => {
    setThreads(updatedThreads);
    try {
      localStorage.setItem('zenvitra_user_threads', JSON.stringify(updatedThreads));
    } catch (_) {}
  };

  const startOrOpenThread = (initData: {
    name: string;
    email: string;
    category: string;
    initialMessage?: string;
    image_url?: string;
  }) => {
    const threadId = 'ZC-' + Date.now().toString().slice(-6);
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newThread: ChatThread = {
      thread_id: threadId,
      name: initData.name,
      email: initData.email,
      category: initData.category,
      status: 'OPEN',
      created_at: new Date().toISOString(),
      messages: [
        {
          id: `msg-welcome-${Date.now()}`,
          sender: 'system',
          text: `Inquiry ticket initiated for ${initData.category}. A Secretariat officer has been notified.`,
          timestamp: timeStr,
        },
      ],
    };

    if (initData.initialMessage) {
      newThread.messages.push({
        id: `msg-usr-${Date.now()}`,
        sender: 'user',
        text: initData.initialMessage,
        image_url: initData.image_url,
        timestamp: timeStr,
      });

      fetch('/api/interest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'log_chat',
          thread_id: threadId,
          name: initData.name,
          email: initData.email,
          category: initData.category,
          message: initData.initialMessage,
          image_url: initData.image_url || '',
        }),
      }).catch(console.error);
    }

    const nextList = [newThread, ...threads.filter((t) => t.thread_id !== threadId)];
    persistThreads(nextList);
    setActiveThread(newThread);
    setViewMode('ACTIVE_CHAT');
    setIsOpen(true);
  };

  const sendMessage = async (text: string, image_url?: string) => {
    if (!activeThread || activeThread.status === 'CLOSED' || activeThread.status === 'ARCHIVED') return;

    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text,
      image_url,
      timestamp: timeStr,
    };

    const messagesList = [...activeThread.messages, userMsg];

    const lower = text.toLowerCase();
    const isGratitude =
      lower.includes('thank you') ||
      lower.includes('thanks') ||
      lower.includes('dhanyawad') ||
      lower.includes('shukriya') ||
      lower.includes('thx');

    let newStatus = activeThread.status;
    if (isGratitude) {
      messagesList.push({
        id: `sys-control-${Date.now()}`,
        sender: 'system',
        text: '----- Gratitude registered. Thread control handed over to Secretariat Desk for closing / resolution -----',
        timestamp: timeStr,
      });
      newStatus = 'RESOLVED';
    }

    const updatedThread: ChatThread = {
      ...activeThread,
      status: newStatus,
      messages: messagesList,
    };

    const nextList = threads.map((t) => (t.thread_id === activeThread.thread_id ? updatedThread : t));
    persistThreads(nextList);
    setActiveThread(updatedThread);

    try {
      await fetch('/api/interest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'log_chat',
          thread_id: activeThread.thread_id,
          name: activeThread.name,
          email: activeThread.email,
          category: activeThread.category,
          message: text || '[Image Dispatch]',
          image_url: image_url || '',
        }),
      });
    } catch (err) {
      console.error('Transmission error:', err);
    }
  };

  const officerJoinThread = (threadId: string, officerName: string) => {
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const nextList = threads.map((t) => {
      if (t.thread_id === threadId && !t.assigned_officer) {
        return {
          ...t,
          status: 'IN_PROGRESS' as const,
          assigned_officer: officerName,
          messages: [
            ...t.messages,
            {
              id: `sys-join-${Date.now()}`,
              sender: 'system' as const,
              text: `----- ${officerName} [The Secretariat] joined the chat -----`,
              timestamp: timeStr,
            },
          ],
        };
      }
      return t;
    });

    persistThreads(nextList);
    if (activeThread?.thread_id === threadId) {
      setActiveThread(nextList.find((t) => t.thread_id === threadId) || null);
    }
  };

  const officerSendMessage = (threadId: string, text: string, officerName: string) => {
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const nextList = threads.map((t) => {
      if (t.thread_id === threadId) {
        return {
          ...t,
          messages: [
            ...t.messages,
            {
              id: `msg-off-${Date.now()}`,
              sender: 'secretariat' as const,
              text,
              officer_name: officerName,
              timestamp: timeStr,
            },
          ],
        };
      }
      return t;
    });

    persistThreads(nextList);
    if (activeThread?.thread_id === threadId) {
      setActiveThread(nextList.find((t) => t.thread_id === threadId) || null);
    }
  };

  const submitRatingAndClose = (threadId: string, rating: number, feedback?: string) => {
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const nextList = threads.map((t) => {
      if (t.thread_id === threadId) {
        return {
          ...t,
          status: 'CLOSED' as const,
          rating,
          feedback,
          messages: [
            ...t.messages,
            {
              id: `sys-closed-${Date.now()}`,
              sender: 'system' as const,
              text: `----- Session sealed & rated ★ ${rating}/5. Thread archived -----`,
              timestamp: timeStr,
            },
          ],
        };
      }
      return t;
    });

    persistThreads(nextList);
    if (activeThread?.thread_id === threadId) {
      setActiveThread(nextList.find((t) => t.thread_id === threadId) || null);
    }
  };

  const officerCloseThread = (threadId: string) => {
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const nextList = threads.map((t) => {
      if (t.thread_id === threadId) {
        return {
          ...t,
          status: 'CLOSED' as const,
          messages: [
            ...t.messages,
            {
              id: `sys-closed-${Date.now()}`,
              sender: 'system' as const,
              text: '----- Secretariat officer marked this inquiry CLOSED -----',
              timestamp: timeStr,
            },
          ],
        };
      }
      return t;
    });

    persistThreads(nextList);
    if (activeThread?.thread_id === threadId) {
      setActiveThread(nextList.find((t) => t.thread_id === threadId) || null);
    }
  };

  const archiveThread = (threadId: string) => {
    const nextList = threads.map((t) =>
      t.thread_id === threadId ? { ...t, status: 'ARCHIVED' as const } : t
    );
    persistThreads(nextList);
    if (activeThread?.thread_id === threadId) {
      setActiveThread(nextList.find((t) => t.thread_id === threadId) || null);
    }
  };

  const unarchiveThread = (threadId: string) => {
    const nextList = threads.map((t) =>
      t.thread_id === threadId ? { ...t, status: 'OPEN' as const } : t
    );
    persistThreads(nextList);
    if (activeThread?.thread_id === threadId) {
      setActiveThread(nextList.find((t) => t.thread_id === threadId) || null);
    }
  };

  const deleteThread = (threadId: string) => {
    const nextList = threads.filter((t) => t.thread_id !== threadId);
    persistThreads(nextList);
    if (activeThread?.thread_id === threadId) {
      setActiveThread(nextList[0] || null);
      if (nextList.length === 0) {
        setViewMode('THREADS_LIST');
      }
    }
  };

  return (
    <ChatContext.Provider
      value={{
        isOpen,
        setIsOpen,
        activeThread,
        setActiveThread,
        threads,
        startOrOpenThread,
        sendMessage,
        officerJoinThread,
        officerSendMessage,
        submitRatingAndClose,
        officerCloseThread,
        archiveThread,
        unarchiveThread,
        deleteThread,
        viewMode,
        setViewMode,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) throw new Error('useChat must be used within a ChatProvider');
  return context;
};