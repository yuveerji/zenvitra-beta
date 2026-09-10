'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Send, 
  MessageSquare, 
  Users, 
  Search, 
  Check, 
  Radio, 
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import { useZenChat } from '@/context/ZenChatPlatformContext';
import { PulsePost } from '@/types/pulse';

interface ShareToChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  post: PulsePost | null;
  onSuccess?: (msg: string) => void;
}

export function ShareToChatModal({
  isOpen,
  onClose,
  post,
  onSuccess,
}: ShareToChatModalProps) {
  const { conversations, sendNativeObjectMessage, setActiveConversationId } = useZenChat();
  const [search, setSearch] = useState('');
  const [selectedConvId, setSelectedConvId] = useState<string | null>(null);
  const [customMessage, setCustomMessage] = useState('');

  if (!post) return null;

  const filtered = conversations.filter((c) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return c.name.toLowerCase().includes(q) || (c.handle && c.handle.toLowerCase().includes(q));
  });

  const handleSend = () => {
    if (!selectedConvId) return;

    sendNativeObjectMessage(
      {
        type: 'pulse',
        id: post.id,
        title: post.content.slice(0, 100),
        subtitle: `By @${post.authorUsername} • ${post.likes || 0} signals`,
        badge: 'CIVIC PULSE',
        actionLabel: 'View in Pulse',
        actionUrl: `/pulse?post=${post.id}`,
        metadata: {
          postId: post.id,
          authorUsername: post.authorUsername,
        }
      },
      customMessage.trim() || 'Shared a civic signal from ZEN.PULSE',
      selectedConvId
    );

    setActiveConversationId(selectedConvId);
    onSuccess?.('Post transmitted to ZEN.CHAT');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="absolute inset-0" onClick={onClose} />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 8 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="relative w-full max-w-md rounded-3xl bg-[#0a0d14] border border-white/15 p-6 shadow-2xl space-y-5 font-sans z-10 text-neutral-200"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-xl bg-pink-500/20 text-pink-400 flex items-center justify-center">
                  <Radio className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-sm text-white">
                    Send to ZEN.CHAT
                  </h3>
                  <p className="font-mono text-[10px] text-neutral-400">
                    Forward civic post directly into a conversation
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Post Preview Snippet */}
            <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/10 space-y-1">
              <div className="flex items-center gap-1.5 text-[11px] font-mono text-neutral-400">
                <span className="font-semibold text-white">@{post.authorUsername}</span>
                <span>•</span>
                <span>Signal Post</span>
              </div>
              <p className="text-xs text-neutral-300 line-clamp-2 leading-relaxed">
                {post.content}
              </p>
            </div>

            {/* Recipient Search Bar */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search peers, groups, caucuses..."
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-500/50 font-sans"
              />
            </div>

            {/* Recipient List */}
            <div className="max-h-48 overflow-y-auto space-y-1 p-1">
              {filtered.length === 0 ? (
                <p className="text-center py-6 text-xs font-mono text-neutral-500">
                  No chat relays found.
                </p>
              ) : (
                filtered.map((c) => {
                  const isSelected = selectedConvId === c.id;
                  return (
                    <div
                      key={c.id}
                      onClick={() => setSelectedConvId(c.id)}
                      className={`flex items-center justify-between p-2.5 rounded-2xl cursor-pointer transition select-none ${
                        isSelected
                          ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-400/40 text-white'
                          : 'hover:bg-white/[0.04] text-neutral-300 border border-transparent'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center font-bold text-xs shrink-0">
                          {c.name.charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <h5 className="font-display font-semibold text-xs text-white truncate">
                            {c.name}
                          </h5>
                          <span className="font-mono text-[9px] text-neutral-400 block truncate">
                            {c.type === 'dm' ? `@${c.handle || c.name}` : c.type.toUpperCase()}
                          </span>
                        </div>
                      </div>

                      {isSelected && (
                        <div className="w-5 h-5 rounded-full bg-cyan-400 text-black flex items-center justify-center shrink-0">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>

            {/* Optional Note Message */}
            <input
              type="text"
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              placeholder="Add an optional comment..."
              className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-500/50"
            />

            {/* Transmit Button */}
            <button
              type="button"
              disabled={!selectedConvId}
              onClick={handleSend}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-violet-500 disabled:opacity-30 hover:opacity-90 text-black font-display font-bold text-xs uppercase tracking-wider transition flex items-center justify-center gap-2 cursor-pointer shadow-md"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Transmit to Chat</span>
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
