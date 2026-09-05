'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText,
  Send,
  X,
  Mail,
  Users,
  Crown,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Reply,
  Clock,
  ShieldCheck,
  MessageSquare
} from 'lucide-react';
import { useMun } from '@/context/MunContext';

interface DiplomaticChitsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface DiplomaticChit {
  id: string;
  senderCountry: string;
  senderFlag: string;
  senderHandle: string;
  recipient: string;
  recipientFlag?: string;
  type: 'Substantive Policy' | 'Bilateral Treaty' | 'Point to Dais' | 'Unmod Lobbying' | 'Amendment Proposal';
  content: string;
  timestamp: string;
  status: 'delivered' | 'replied' | 'pending';
}

export function DiplomaticChitsModal({ isOpen, onClose }: DiplomaticChitsModalProps) {
  const { userInvites, activeCommitteeId, getCommitteeById, committees } = useMun();
  const committee = getCommitteeById(activeCommitteeId) || committees[0];
  const userAcceptedInvite = userInvites.find(
    (i) => i.committeeId === activeCommitteeId && i.status === 'accepted'
  );

  const myCountry = userAcceptedInvite?.portfolio || 'France';
  const myFlag = userAcceptedInvite?.flagEmoji || '🇫🇷';

  const [activeTab, setActiveTab] = useState<'inbox' | 'compose' | 'sent'>('inbox');
  const [recipient, setRecipient] = useState<string>('United States');
  const [chitType, setChitType] = useState<DiplomaticChit['type']>('Bilateral Treaty');
  const [chitContent, setChitContent] = useState<string>('');
  const [sentSuccess, setSentSuccess] = useState<boolean>(false);
  const [chits, setChits] = useState<DiplomaticChit[]>([]);

  if (!isOpen) return null;

  const COUNTRY_OPTIONS = [
    { country: '👑 Dais Executive Board (Chair)', flag: '👑' },
    { country: 'United States', flag: '🇺🇸' },
    { country: 'United Kingdom', flag: '🇬🇧' },
    { country: 'China', flag: '🇨🇳' },
    { country: 'Russian Federation', flag: '🇷🇺' },
    { country: 'India', flag: '🇮🇳' },
    { country: 'Germany', flag: '🇩🇪' },
    { country: 'Japan', flag: '🇯🇵' },
    { country: 'Brazil', flag: '🇧🇷' },
    { country: 'South Africa', flag: '🇿🇦' },
    { country: 'United Arab Emirates', flag: '🇦🇪' }
  ];

  const handleSendChit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chitContent.trim()) return;

    const newChit: DiplomaticChit = {
      id: `chit_${Date.now()}`,
      senderCountry: myCountry,
      senderFlag: myFlag,
      senderHandle: 'you',
      recipient,
      type: chitType,
      content: chitContent.trim(),
      timestamp: 'Just now',
      status: 'delivered'
    };

    setChits([newChit, ...chits]);
    setChitContent('');
    setSentSuccess(true);
    setTimeout(() => {
      setSentSuccess(false);
      setActiveTab('sent');
    }, 1200);
  };

  const inboxChits = chits.filter((c) => c.recipient === myCountry || c.recipient === 'Dais Executive Board');
  const sentChits = chits.filter((c) => c.senderCountry === myCountry);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto flex flex-col justify-start sm:justify-center items-center p-3 sm:p-6 select-none">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/85 backdrop-blur-xl"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-2xl my-auto max-h-[92vh] bg-[#090a0f] border border-white/20 rounded-3xl shadow-2xl flex flex-col overflow-hidden z-10 text-white"
        >
          {/* Header */}
          <div className="p-5 sm:p-6 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-display font-bold text-lg text-white flex items-center gap-2">
                  <span>Diplomatic Chits &amp; Page Messenger</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold">
                    MUN Command
                  </span>
                </h2>
                <p className="text-xs text-neutral-400">
                  Pass structured diplomatic notes to delegations or submit inquiries to the Dais.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Nav Tabs */}
          <div className="px-6 py-3 border-b border-white/10 flex items-center gap-3 bg-white/[0.01]">
            <button
              type="button"
              onClick={() => setActiveTab('inbox')}
              className={`px-4 py-1.5 rounded-xl font-mono text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'inbox'
                  ? 'bg-amber-400 text-black shadow-md'
                  : 'bg-white/5 text-neutral-400 hover:text-white'
              }`}
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Inbox ({inboxChits.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('compose')}
              className={`px-4 py-1.5 rounded-xl font-mono text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'compose'
                  ? 'bg-amber-400 text-black shadow-md'
                  : 'bg-white/5 text-neutral-400 hover:text-white'
              }`}
            >
              <Send className="w-3.5 h-3.5" />
              <span>Compose Chit</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('sent')}
              className={`px-4 py-1.5 rounded-xl font-mono text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'sent'
                  ? 'bg-amber-400 text-black shadow-md'
                  : 'bg-white/5 text-neutral-400 hover:text-white'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Sent Chits ({sentChits.length})</span>
            </button>
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-7 max-h-[60vh]">
            {/* 1. INBOX */}
            {activeTab === 'inbox' && (
              <div className="space-y-3">
                {inboxChits.length === 0 ? (
                  <div className="p-12 text-center text-neutral-500 font-mono text-xs">
                    No chits received yet. Delegations will send you diplomatic notes during caucuses.
                  </div>
                ) : (
                  inboxChits.map((chit) => (
                    <div
                      key={chit.id}
                      className="p-4 sm:p-5 rounded-2xl bg-black/50 border border-white/10 space-y-3 hover:border-white/20 transition"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{chit.senderFlag}</span>
                          <span className="font-bold text-sm text-white">
                            From: {chit.senderCountry}
                          </span>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20">
                            {chit.type}
                          </span>
                        </div>
                        <span className="text-[10px] font-mono text-neutral-400">
                          {chit.timestamp}
                        </span>
                      </div>

                      <p className="text-xs sm:text-sm text-neutral-300 font-sans leading-relaxed bg-white/[0.02] p-3.5 rounded-xl border border-white/5">
                        "{chit.content}"
                      </p>

                      <div className="flex items-center justify-between pt-1 text-xs font-mono text-neutral-400">
                        <span className="flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                          <span>Delivered via Committee Page</span>
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            setRecipient(chit.senderCountry);
                            setActiveTab('compose');
                          }}
                          className="text-amber-400 hover:underline flex items-center gap-1 font-bold cursor-pointer"
                        >
                          <Reply className="w-3.5 h-3.5" />
                          <span>Reply via Page</span>
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* 2. COMPOSE */}
            {activeTab === 'compose' && (
              <form onSubmit={handleSendChit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-mono font-bold text-neutral-300 uppercase block">
                      To Delegation / Dais
                    </label>
                    <select
                      value={recipient}
                      onChange={(e) => setRecipient(e.target.value)}
                      className="w-full bg-neutral-900 border border-white/15 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none cursor-pointer"
                    >
                      {COUNTRY_OPTIONS.map((c) => (
                        <option key={c.country} value={c.country}>
                          {c.flag} {c.country}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-mono font-bold text-neutral-300 uppercase block">
                      Chit Classification
                    </label>
                    <select
                      value={chitType}
                      onChange={(e) => setChitType(e.target.value as any)}
                      className="w-full bg-neutral-900 border border-white/15 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none cursor-pointer"
                    >
                      <option value="Substantive Policy">Substantive Policy Dialogue</option>
                      <option value="Bilateral Treaty">Bilateral Treaty / Alliance</option>
                      <option value="Point to Dais">Point / Question to Dais Chair</option>
                      <option value="Unmod Lobbying">Unmoderated Caucus Lobbying</option>
                      <option value="Amendment Proposal">Resolution Amendment Proposal</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono font-bold text-neutral-300 uppercase block">
                    Diplomatic Message Content *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={chitContent}
                    onChange={(e) => setChitContent(e.target.value)}
                    placeholder="State your diplomatic proposition, inquiry, or caucus alliance terms clearly..."
                    className="w-full bg-black/60 border border-white/15 rounded-2xl p-3.5 text-xs sm:text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400 font-sans leading-relaxed resize-none"
                  />
                </div>

                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/10 flex items-center justify-between text-xs font-mono text-neutral-400">
                  <span>Sender: <strong>{myFlag} {myCountry}</strong></span>
                  <span>Dispatched via: Committee Page Messenger</span>
                </div>

                <div className="pt-2 flex justify-end gap-3">
                  <button
                    type="submit"
                    className="px-7 py-2.5 rounded-2xl bg-gradient-to-r from-amber-400 via-rose-500 to-purple-600 text-white font-display font-bold text-xs shadow-md hover:scale-105 transition cursor-pointer flex items-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>{sentSuccess ? 'Chit Dispatched!' : 'Dispatch Chit via Page'}</span>
                  </button>
                </div>
              </form>
            )}

            {/* 3. SENT */}
            {activeTab === 'sent' && (
              <div className="space-y-3">
                {sentChits.length === 0 ? (
                  <div className="p-12 text-center text-neutral-500 font-mono text-xs">
                    You haven't dispatched any chits yet. Use the "Compose Chit" tab to send a note.
                  </div>
                ) : (
                  sentChits.map((chit) => (
                    <div
                      key={chit.id}
                      className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-white">
                          To: {chit.recipient}
                        </span>
                        <span className="text-[10px] font-mono text-neutral-400">
                          {chit.timestamp}
                        </span>
                      </div>
                      <p className="text-xs text-neutral-300 font-sans bg-white/[0.02] p-3 rounded-xl">
                        "{chit.content}"
                      </p>
                      <div className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Dispatched to delegation</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
