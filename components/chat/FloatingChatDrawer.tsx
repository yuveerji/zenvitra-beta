'use client';

import React, { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { 
  MessageSquare, 
  X, 
  Minus, 
  Maximize2, 
  Send, 
  Phone, 
  Video, 
  ShieldCheck, 
  Sparkles, 
  Image as ImageIcon, 
  Search, 
  ArrowLeft,
  Clock,
  Lock,
  Radio,
  Plus,
  Mic,
  Users,
  Building2,
  Zap,
  Globe2,
  ChevronRight,
  CheckCheck,
  Paperclip,
  Smile,
  ShieldAlert
} from 'lucide-react';
import { useZenChat } from '@/context/ZenChatPlatformContext';
import { motion, AnimatePresence } from 'framer-motion';

export function FloatingChatDrawer() {
  const pathname = usePathname();
  const router = useRouter();

  const {
    conversations,
    activeConversationId,
    activeConversation,
    activeMessages,
    setActiveConversationId,
    sendMessage,
    createDirectChat,
    createGroupChat,
    startCall,
  } = useZenChat();

  const [isOpen, setIsOpen] = useState(false);
  const [isExpandingToFull, setIsExpandingToFull] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'direct' | 'groups'>('all');
  const [inputText, setInputText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selfDestructMinutes, setSelfDestructMinutes] = useState<number | null>(null);
  const [showNewChatInput, setShowNewChatInput] = useState(false);
  const [newChatHandle, setNewChatHandle] = useState('');
  const [isRecordingVoice, setIsRecordingVoice] = useState(false);

  // When on full /chat page, hide the floating bottom drawer popup
  if (pathname === '/chat' || pathname?.startsWith('/chat')) {
    return null;
  }

  const handleExpandToFullScreen = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsExpandingToFull(true);
    setTimeout(() => {
      router.push('/chat');
    }, 250);
  };

  const totalUnread = conversations.reduce((acc, c) => acc + (c.unreadCount || 0), 0);

  const filteredConversations = conversations.filter((c) => {
    if (activeTab === 'direct' && c.type === 'group') return false;
    if (activeTab === 'groups' && c.type !== 'group') return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        c.name.toLowerCase().includes(q) ||
        (c.lastMessage?.text || '').toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    sendMessage(inputText.trim());
    setInputText('');
  };

  const handleStartDirectChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChatHandle.trim()) return;
    const handle = newChatHandle.trim().replace(/^@/, '');
    createDirectChat(handle, `@${handle}`);
    setNewChatHandle('');
    setShowNewChatInput(false);
  };

  const quickActionChips = [
    'Affirmative 🫡',
    'Drafting Resolution ✍️',
    'In Assembly Session 🏛️',
    'Point of Order 🙋',
  ];

  return (
    <div className="fixed bottom-20 right-4 sm:bottom-6 sm:right-6 z-50 font-sans selection:bg-white/20 select-none">
      <AnimatePresence mode="wait">
        {!isOpen ? (
          /* ─── COLLAPSED FLOATING TRIGGER ─── */
          <motion.button
            key="collapsed-pill"
            initial={{ scale: 0.9, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 10 }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setIsOpen(true)}
            className="flex items-center rounded-full bg-[#07080b]/95 border border-white/20 text-white shadow-[0_12px_40px_rgba(0,0,0,0.85)] backdrop-blur-2xl hover:border-white/40 transition-all cursor-pointer group"
          >
            {/* Mobile View: High-Visibility Message Icon Bubble (Elevated above bottom bar) */}
            <div className="sm:hidden p-3 relative flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-amber-400 group-hover:scale-110 transition-transform" />
              {totalUnread > 0 ? (
                <span className="absolute -top-1 -right-1 px-1.5 py-0.5 rounded-full bg-rose-500 text-white font-bold text-[9px] shadow-sm">
                  {totalUnread}
                </span>
              ) : (
                <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_6px_#34d399]" />
              )}
            </div>

            {/* Desktop View: Sleek Message Icon + ZEN.CHAT */}
            <div className="hidden sm:flex items-center gap-2.5 px-4 py-2.5">
              <div className="p-1.5 rounded-full bg-white/10 text-amber-400 group-hover:bg-white/15 transition-colors">
                <MessageSquare className="w-4 h-4 text-amber-400" />
              </div>
              <span className="font-bold text-xs tracking-tight text-white group-hover:text-zinc-200 font-mono">
                ZEN.CHAT
              </span>
              {totalUnread > 0 ? (
                <span className="px-1.5 py-0.5 rounded-full bg-rose-500 text-white font-bold text-[10px] shadow-sm">
                  {totalUnread}
                </span>
              ) : (
                <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_6px_#34d399] animate-pulse" />
              )}
            </div>
          </motion.button>
        ) : (
          /* ─── EXPANDED HIGH-DETAIL POPUP DRAWER (380px x 520px) ─── */
          <motion.div
            key="expanded-drawer"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={
              isExpandingToFull
                ? {
                    opacity: 0,
                    scale: 1.15,
                    y: -40,
                    filter: 'blur(8px)',
                    transition: { duration: 0.25, ease: [0.16, 1, 0.3, 1] }
                  }
                : {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    filter: 'blur(0px)',
                    transition: { type: 'spring', stiffness: 420, damping: 28 }
                  }
            }
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="w-[calc(100vw-2rem)] sm:w-[380px] max-w-[380px] max-h-[calc(100dvh-7rem)] h-[460px] sm:h-[520px] rounded-3xl bg-[#07080b]/98 border border-white/15 shadow-[0_20px_70px_rgba(0,0,0,0.95)] backdrop-blur-3xl flex flex-col overflow-hidden text-white font-sans"
          >
            {/* ── TOP CONTROL BAR ── */}
            <div className="p-3 px-4 border-b border-zinc-800/80 bg-black/60 flex items-center justify-between">
              <div className="flex items-center gap-2">
                {activeConversationId ? (
                  <button
                    onClick={() => setActiveConversationId(null)}
                    className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-900 transition cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                ) : (
                  <div className="p-1 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400">
                    <MessageSquare className="w-3.5 h-3.5" />
                  </div>
                )}
                <div className="text-left">
                  <span className="font-bold text-xs tracking-tight text-white block">
                    {activeConversation ? activeConversation.name : 'ZEN.CHAT'}
                  </span>
                  <span className="text-[9px] text-zinc-400 font-mono block">
                    {activeConversation ? 'Direct Channel' : 'Decentralized Sovereign Mesh'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                {!activeConversationId && (
                  <button
                    onClick={() => setShowNewChatInput(!showNewChatInput)}
                    className={`p-1.5 rounded-lg border text-xs transition cursor-pointer flex items-center gap-1 ${
                      showNewChatInput ? 'bg-purple-500/20 border-purple-500/40 text-purple-300' : 'border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-900'
                    }`}
                    title="Start New Direct Chat"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span className="text-[10px] font-semibold hidden sm:inline">New</span>
                  </button>
                )}

                {activeConversationId && (
                  <button
                    onClick={() => startCall(activeConversationId, 'voice')}
                    className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-900 transition cursor-pointer"
                    title="Start Encrypted Voice Call"
                  >
                    <Phone className="w-3.5 h-3.5 text-emerald-400" />
                  </button>
                )}

                {/* Fullscreen Expand */}
                <button
                  type="button"
                  onClick={handleExpandToFullScreen}
                  className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-900 transition cursor-pointer group"
                  title="Expand to Fullscreen ZenChat Hub"
                >
                  <Maximize2 className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                </button>

                {/* Minimize */}
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-900 transition cursor-pointer"
                  title="Minimize"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* ── MAIN BODY ── */}
            {!activeConversationId ? (
              /* ── 1. TRANSMISSIONS LIST & SOVEREIGN DIRECTORY ── */
              <div className="flex-1 flex flex-col overflow-hidden">
                
                {/* Search & Tabs */}
                <div className="p-3 border-b border-zinc-800/60 space-y-2 bg-black/40">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search transmissions or delegates..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white text-xs placeholder-zinc-500 focus:outline-none focus:border-purple-500 transition"
                    />
                  </div>

                  <div className="grid grid-cols-3 p-0.5 rounded-lg bg-black border border-zinc-800 text-[11px] font-semibold text-center">
                    {(['all', 'direct', 'groups'] as const).map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`py-1 rounded-md transition cursor-pointer capitalize ${
                          activeTab === tab ? 'bg-zinc-900 text-white shadow-sm' : 'text-zinc-500 hover:text-white'
                        }`}
                      >
                        {tab === 'all' ? 'All Channels' : tab === 'direct' ? 'Direct DMs' : 'Committees'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* New Chat Prompt Form if toggled */}
                {showNewChatInput && (
                  <form onSubmit={handleStartDirectChat} className="p-3 bg-purple-950/20 border-b border-purple-500/20 space-y-2 animate-in fade-in duration-150">
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        autoFocus
                        placeholder="Enter username (e.g. yuveer or delegate_name)"
                        value={newChatHandle}
                        onChange={(e) => setNewChatHandle(e.target.value)}
                        className="flex-1 px-3 py-1.5 rounded-xl bg-black border border-purple-500/40 text-white text-xs placeholder-zinc-500 focus:outline-none focus:border-purple-400"
                      />
                      <button
                        type="submit"
                        disabled={!newChatHandle.trim()}
                        className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition disabled:opacity-40 cursor-pointer shadow-sm"
                      >
                        Chat
                      </button>
                    </div>
                  </form>
                )}

                {/* Scrollable Conversation List or Network Hub */}
                <div className="flex-1 overflow-y-auto p-2 space-y-2 text-left">
                  {/* If user has active conversations, show them */}
                  {filteredConversations.length > 0 && (
                    <div className="space-y-1">
                      <div className="px-2 py-1 text-[10px] font-mono text-zinc-500 uppercase tracking-wider font-bold">
                        Active Transmissions
                      </div>
                      {filteredConversations.map((c) => (
                        <div
                          key={c.id}
                          onClick={() => setActiveConversationId(c.id)}
                          className="p-2.5 rounded-2xl hover:bg-zinc-900/80 border border-transparent hover:border-white/5 transition flex items-center gap-3 cursor-pointer group"
                        >
                          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-400 via-rose-500 to-fuchsia-600 p-[1.5px] shrink-0 relative">
                            <div className="w-full h-full rounded-full bg-black flex items-center justify-center font-bold text-xs text-white uppercase">
                              {c.name[0] || 'U'}
                            </div>
                            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-[#10b981] border-2 border-black" />
                          </div>

                          <div className="flex-1 min-w-0 text-left">
                            <div className="flex items-center justify-between">
                              <h4 className="font-bold text-xs text-white truncate group-hover:text-purple-300 transition-colors">
                                {c.name}
                              </h4>
                              <span className="text-[10px] text-zinc-500 font-mono">{c.lastMessage?.timestamp || 'Now'}</span>
                            </div>
                            <p className="text-[11px] text-zinc-400 truncate mt-0.5 font-light">
                              {c.lastMessage?.text || 'Encrypted transmission established.'}
                            </p>
                          </div>

                          {c.unreadCount > 0 && (
                            <span className="px-1.5 py-0.5 rounded-full bg-rose-500 text-white font-bold text-[10px]">
                              {c.unreadCount}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Empty State when no conversations exist */}
                  {filteredConversations.length === 0 && (
                    <div className="py-12 px-4 text-center space-y-3">
                      <div className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-zinc-400">
                        <MessageSquare className="w-5 h-5" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs font-bold text-white">No Transmissions Yet</p>
                        <p className="text-[11px] text-zinc-400 max-w-[220px] mx-auto">
                          Click <span className="text-purple-300 font-semibold">&ldquo;+ New&rdquo;</span> above to start a secure direct transmission with any delegate.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Telemetry Security Card */}
                  <div className="p-3 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-cyan-500/10 to-transparent border border-emerald-500/20 text-[10px] text-zinc-400 flex items-center gap-2.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Transmissions are verified via sovereign zero-knowledge cryptographic ratchets.</span>
                  </div>
                </div>
              </div>
            ) : (
              /* ── 2. ACTIVE MESSAGE THREAD ── */
              <div className="flex-1 flex flex-col justify-between overflow-hidden">
                {/* Security Badge & Self-Destruct Timer */}
                <div className="px-3.5 py-1.5 bg-zinc-950/95 border-b border-zinc-800/80 flex items-center justify-between text-[10px] text-zinc-400">
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="font-mono text-emerald-300">E2EE Verified</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setSelfDestructMinutes(selfDestructMinutes ? null : 5)}
                      className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-mono transition cursor-pointer ${
                        selfDestructMinutes
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                          : 'bg-zinc-900 text-zinc-400 hover:text-white'
                      }`}
                    >
                      <Clock className="w-3 h-3" />
                      <span>{selfDestructMinutes ? `${selfDestructMinutes}m Timer` : 'Timer: Off'}</span>
                    </button>
                  </div>
                </div>

                {/* Quick Action Chips */}
                <div className="px-3 py-1.5 border-b border-zinc-800/40 flex items-center gap-1.5 overflow-x-auto no-scrollbar bg-black/30">
                  {quickActionChips.map((chip, idx) => (
                    <button
                      key={idx}
                      onClick={() => sendMessage(chip)}
                      className="px-2.5 py-1 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-[10px] text-zinc-300 font-medium whitespace-nowrap transition cursor-pointer"
                    >
                      {chip}
                    </button>
                  ))}
                </div>

                {/* Messages Stream */}
                <div className="flex-1 overflow-y-auto p-3 space-y-3 text-xs">
                  {activeMessages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-10 text-center space-y-2">
                      <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                        <Lock className="w-5 h-5" />
                      </div>
                      <h5 className="font-bold text-xs text-white">End-to-End Encrypted Session</h5>
                      <p className="text-[11px] text-zinc-400 max-w-[240px]">
                        No one outside of this chat can read or listen to transmissions. Send a message below.
                      </p>
                    </div>
                  ) : (
                    activeMessages.map((msg) => {
                      const isMe = msg.senderUsername === 'you' || msg.senderName.includes('You');
                      return (
                        <div
                          key={msg.id}
                          className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} space-y-0.5`}
                        >
                          {!isMe && (
                            <span className="text-[10px] text-zinc-500 font-mono px-1">
                              {msg.senderName}
                            </span>
                          )}
                          <div
                            className={`max-w-[82%] p-3 rounded-2xl shadow-sm text-left ${
                              isMe
                                ? 'bg-gradient-to-tr from-purple-600 to-indigo-600 text-white rounded-br-sm'
                                : 'bg-zinc-900/90 text-white border border-zinc-800 rounded-bl-sm'
                            }`}
                          >
                            <p className="text-xs leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                          </div>
                          <div className="flex items-center gap-1 text-[9px] text-zinc-500 px-1 font-mono">
                            <span>{msg.timestamp}</span>
                            {isMe && <CheckCheck className="w-3 h-3 text-cyan-400" />}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Input Composer */}
                <form onSubmit={handleSend} className="p-2.5 border-t border-zinc-800 bg-black/60 space-y-2">
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setIsRecordingVoice(!isRecordingVoice)}
                      className={`p-2 rounded-xl border text-xs transition cursor-pointer ${
                        isRecordingVoice ? 'bg-rose-500/20 border-rose-500/40 text-rose-300 animate-pulse' : 'border-zinc-800 text-zinc-400 hover:text-white'
                      }`}
                      title="Voice Note"
                    >
                      <Mic className="w-4 h-4" />
                    </button>

                    <input
                      type="text"
                      placeholder="Type encrypted message..."
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      className="flex-1 px-3.5 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white text-xs placeholder-zinc-500 focus:outline-none focus:border-purple-500 transition"
                    />

                    <button
                      type="submit"
                      disabled={!inputText.trim()}
                      className="p-2 px-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold transition disabled:opacity-40 cursor-pointer shadow-[0_0_15px_rgba(168,85,247,0.3)] flex items-center justify-center"
                    >
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </form>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default FloatingChatDrawer;
