'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  TEST_PERSONAS,
  TestNodePersona,
  TEST_CONFERENCE,
  TestConference,
  TEST_COMMITTEES,
  TestCommittee,
  TEST_DELEGATES,
  TestDelegate,
  TEST_MOTIONS,
  TestMotion,
  TEST_DOCUMENTS,
  TestDocument,
  TEST_TRANSACTIONS,
  TestTransaction,
  TEST_POSTS,
  TestPost,
  TEST_CHAT_CHANNELS,
  TestChatChannel,
  TEST_EB_APPLICATIONS,
  TestEbApplication,
} from '@/lib/test-node/testNodeData';

const SANDBOX_STORAGE_KEY = 'zenvitra_test_node_sandbox_state_v1';

interface TestNodeContextType {
  activePersona: TestNodePersona;
  switchPersona: (personaId: string) => void;
  conference: TestConference;
  committees: TestCommittee[];
  delegates: TestDelegate[];
  motions: TestMotion[];
  documents: TestDocument[];
  transactions: TestTransaction[];
  posts: TestPost[];
  chatChannels: TestChatChannel[];
  ebApplications: TestEbApplication[];
  // Actions
  castVote: (documentId: string, voteType: 'AYE' | 'NAY' | 'ABSTAIN') => void;
  raiseMotion: (committeeId: string, topic: string, totalMinutes: number, speakerSeconds: number) => void;
  submitDocument: (doc: { title: string; committee: string; category: TestDocument['category']; preambles: string[]; operatives: string[] }) => void;
  simulatePayment: (amount: number, delegateName: string, committee: string, paymentMode: TestTransaction['paymentMode']) => Promise<TestTransaction>;
  addPost: (content: string, tags?: string[]) => void;
  likePost: (postId: string) => void;
  votePoll: (postId: string, optionIndex: number) => void;
  sendChatMessage: (channelId: string, content: string) => void;
  updateEbApplicationStatus: (appId: string, status: TestEbApplication['status']) => void;
  resetSandbox: () => void;
}

const TestNodeContext = createContext<TestNodeContextType | undefined>(undefined);

export function TestNodeProvider({ children }: { children: ReactNode }) {
  const [activePersonaId, setActivePersonaId] = useState<string>(TEST_PERSONAS[0].id);
  const [conference, setConference] = useState<TestConference>(TEST_CONFERENCE);
  const [committees, setCommittees] = useState<TestCommittee[]>(TEST_COMMITTEES);
  const [delegates, setDelegates] = useState<TestDelegate[]>(TEST_DELEGATES);
  const [motions, setMotions] = useState<TestMotion[]>(TEST_MOTIONS);
  const [documents, setDocuments] = useState<TestDocument[]>(TEST_DOCUMENTS);
  const [transactions, setTransactions] = useState<TestTransaction[]>(TEST_TRANSACTIONS);
  const [posts, setPosts] = useState<TestPost[]>(TEST_POSTS);
  const [chatChannels, setChatChannels] = useState<TestChatChannel[]>(TEST_CHAT_CHANNELS);
  const [ebApplications, setEbApplications] = useState<TestEbApplication[]>(TEST_EB_APPLICATIONS);

  // Load from local storage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(SANDBOX_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.activePersonaId) setActivePersonaId(parsed.activePersonaId);
        if (parsed.conference) setConference(parsed.conference);
        if (parsed.committees) setCommittees(parsed.committees);
        if (parsed.delegates) setDelegates(parsed.delegates);
        if (parsed.motions) setMotions(parsed.motions);
        if (parsed.documents) setDocuments(parsed.documents);
        if (parsed.transactions) setTransactions(parsed.transactions);
        if (parsed.posts) setPosts(parsed.posts);
        if (parsed.chatChannels) setChatChannels(parsed.chatChannels);
        if (parsed.ebApplications) setEbApplications(parsed.ebApplications);
      }
    } catch (e) {
      console.warn('[TEST_NODE_STORAGE_LOAD_ERROR]', e);
    }
  }, []);

  // Save to local storage on mutation
  const persistState = (partialState: Record<string, any>) => {
    try {
      const current = localStorage.getItem(SANDBOX_STORAGE_KEY);
      const parsed = current ? JSON.parse(current) : {};
      const updated = { ...parsed, ...partialState };
      localStorage.setItem(SANDBOX_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn('[TEST_NODE_STORAGE_SAVE_ERROR]', e);
    }
  };

  const activePersona = TEST_PERSONAS.find((p) => p.id === activePersonaId) || TEST_PERSONAS[0];

  const switchPersona = (personaId: string) => {
    setActivePersonaId(personaId);
    persistState({ activePersonaId: personaId });
  };

  // Vote on a document (Aye / Nay / Abstain)
  const castVote = (documentId: string, voteType: 'AYE' | 'NAY' | 'ABSTAIN') => {
    setDocuments((prev) => {
      const updated = prev.map((doc) => {
        if (doc.id === documentId) {
          return {
            ...doc,
            ayeVotes: voteType === 'AYE' ? doc.ayeVotes + 1 : doc.ayeVotes,
            nayVotes: voteType === 'NAY' ? doc.nayVotes + 1 : doc.nayVotes,
            abstainVotes: voteType === 'ABSTAIN' ? doc.abstainVotes + 1 : doc.abstainVotes,
          };
        }
        return doc;
      });
      persistState({ documents: updated });
      return updated;
    });
  };

  // Raise a Moderated or Unmoderated Caucus Motion
  const raiseMotion = (committeeId: string, topic: string, totalMinutes: number, speakerSeconds: number) => {
    const newMotion: TestMotion = {
      id: `motion_${Date.now()}`,
      committeeId,
      proposedBy: activePersona.country || activePersona.name,
      type: speakerSeconds === 0 ? 'UNMODERATED_CAUCUS' : 'MODERATED_CAUCUS',
      topic,
      totalMinutes,
      speakerSeconds,
      status: 'ACTIVE',
      votesFor: 1,
      votesAgainst: 0,
    };
    setMotions((prev) => {
      const updated = [newMotion, ...prev];
      persistState({ motions: updated });
      return updated;
    });
  };

  // Submit Draft Working Paper or Resolution
  const submitDocument = (doc: {
    title: string;
    committee: string;
    category: TestDocument['category'];
    preambles: string[];
    operatives: string[];
  }) => {
    const newDoc: TestDocument = {
      id: `doc_${Date.now()}`,
      code: `${doc.committee.slice(0, 4).toUpperCase()} DRAFT/${new Date().getFullYear()}/${Math.floor(Math.random() * 90 + 10)}`,
      title: doc.title,
      committee: doc.committee,
      category: doc.category,
      sponsors: [activePersona.country || activePersona.name],
      signatories: ['United States', 'France', 'India'],
      status: 'INTRODUCED',
      ayeVotes: 1,
      nayVotes: 0,
      abstainVotes: 0,
      preambleClauses: doc.preambles,
      operativeClauses: doc.operatives,
    };
    setDocuments((prev) => {
      const updated = [newDoc, ...prev];
      persistState({ documents: updated });
      return updated;
    });
  };

  // Simulate Cashfree Mock Payment
  const simulatePayment = async (
    amount: number,
    delegateName: string,
    committee: string,
    paymentMode: TestTransaction['paymentMode']
  ): Promise<TestTransaction> => {
    // Artificial 800ms latency to simulate mock payment verification
    await new Promise((resolve) => setTimeout(resolve, 800));

    const newTxn: TestTransaction = {
      id: `txn_${Date.now()}`,
      orderId: `CF-MOCK-${Math.floor(100000 + Math.random() * 900000)}`,
      delegateName,
      delegateEmail: `${delegateName.toLowerCase().replace(/\s+/g, '.')}@sandbox.test`,
      committee,
      amount,
      status: 'SUCCESS',
      paymentMode,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' IST',
      utrNumber: `SIM-UTR-${Math.floor(1000000000 + Math.random() * 9000000000)}`,
    };

    setTransactions((prev) => {
      const updated = [newTxn, ...prev];
      persistState({ transactions: updated });
      return updated;
    });

    return newTxn;
  };

  // Post to Pulse Feed
  const addPost = (content: string, tags: string[] = ['#ApexMun2026', '#Sandbox']) => {
    const newPost: TestPost = {
      id: `post_${Date.now()}`,
      authorName: activePersona.name,
      authorHandle: activePersona.handle,
      authorAvatar: activePersona.avatar,
      authorBadge: `${activePersona.role} ${activePersona.country ? `(${activePersona.country})` : ''}`,
      content,
      timestamp: 'Just now',
      likes: 1,
      commentsCount: 0,
      tags,
    };
    setPosts((prev) => {
      const updated = [newPost, ...prev];
      persistState({ posts: updated });
      return updated;
    });
  };

  const likePost = (postId: string) => {
    setPosts((prev) => {
      const updated = prev.map((p) => (p.id === postId ? { ...p, likes: p.likes + 1 } : p));
      persistState({ posts: updated });
      return updated;
    });
  };

  const votePoll = (postId: string, optionIndex: number) => {
    setPosts((prev) => {
      const updated = prev.map((p) => {
        if (p.id === postId && p.poll) {
          const newOptions = p.poll.options.map((opt, i) =>
            i === optionIndex ? { ...opt, votes: opt.votes + 1 } : opt
          );
          return { ...p, poll: { ...p.poll, options: newOptions } };
        }
        return p;
      });
      persistState({ posts: updated });
      return updated;
    });
  };

  // Send message in sandbox channel
  const sendChatMessage = (channelId: string, content: string) => {
    const newMsg = {
      id: `m_${Date.now()}`,
      senderName: activePersona.name,
      senderHandle: activePersona.handle,
      senderRole: activePersona.role,
      content,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isOfficial: activePersona.role === 'SECRETARIAT' || activePersona.role === 'CHAIR',
    };

    setChatChannels((prev) => {
      const updated = prev.map((ch) => {
        if (ch.id === channelId) {
          return { ...ch, messages: [...ch.messages, newMsg] };
        }
        return ch;
      });
      persistState({ chatChannels: updated });
      return updated;
    });
  };

  const updateEbApplicationStatus = (appId: string, status: TestEbApplication['status']) => {
    setEbApplications((prev) => {
      const updated = prev.map((app) => (app.id === appId ? { ...app, status } : app));
      persistState({ ebApplications: updated });
      return updated;
    });
  };

  // Factory Reset
  const resetSandbox = () => {
    try {
      localStorage.removeItem(SANDBOX_STORAGE_KEY);
    } catch {}
    setActivePersonaId(TEST_PERSONAS[0].id);
    setConference(TEST_CONFERENCE);
    setCommittees(TEST_COMMITTEES);
    setDelegates(TEST_DELEGATES);
    setMotions(TEST_MOTIONS);
    setDocuments(TEST_DOCUMENTS);
    setTransactions(TEST_TRANSACTIONS);
    setPosts(TEST_POSTS);
    setChatChannels(TEST_CHAT_CHANNELS);
    setEbApplications(TEST_EB_APPLICATIONS);
  };

  return (
    <TestNodeContext.Provider
      value={{
        activePersona,
        switchPersona,
        conference,
        committees,
        delegates,
        motions,
        documents,
        transactions,
        posts,
        chatChannels,
        ebApplications,
        castVote,
        raiseMotion,
        submitDocument,
        simulatePayment,
        addPost,
        likePost,
        votePoll,
        sendChatMessage,
        updateEbApplicationStatus,
        resetSandbox,
      }}
    >
      {children}
    </TestNodeContext.Provider>
  );
}

export function useTestNode() {
  const context = useContext(TestNodeContext);
  if (!context) {
    throw new Error('useTestNode must be used within a TestNodeProvider');
  }
  return context;
}
