'use client';

import React from 'react';
import { 
  Plus, 
  Search, 
  MessageSquare, 
  Users, 
  Trash2,
  Zap,
  Pin,
  Sparkles,
  Radio,
  Volume2,
  CheckCheck,
  ShieldCheck,
  X
} from 'lucide-react';
import { useZenChat } from '@/context/ZenChatPlatformContext';

export function CleanConversationList() {
  const {
    conversations,
    activeConversationId,
    setActiveConversationId,
    activeFilter,
    setActiveFilter,
    searchQuery,
    setSearchQuery,
    setIsCreateModalOpen,
    deleteConversation,
    togglePinConversation,
    currentUser,
    activeCall
  } = useZenChat();

  const filteredConversations = conversations.filter((c) => {
    // Tab Filter
    if (activeFilter === 'dms' && c.type !== 'dm') return false;
    if (activeFilter === 'groups' && c.type !== 'group') return false;

    // Search Filter
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      c.handle?.toLowerCase().includes(q) ||
      c.lastMessage?.text.toLowerCase().includes(q)
    );
  });

  const pinnedConvs = filteredConversations.filter((c) => c.isPinned);
  const otherConvs = filteredConversations.filter((c) => !c.isPinned);

  return (
    <aside className="w-full md:w-80 h-full bg-[#050608] border-r border-white/10 flex flex-col justify-between shrink-0 select-none font-sans">
      {/* Top Header */}
      <div className="p-4 border-b border-white/10 space-y-3.5 shrink-0 bg-white/[0.01]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-400 to-violet-500 p-0.5 shadow-[0_0_15px_rgba(0,242,254,0.3)]">
              <div className="w-full h-full rounded-[10px] bg-[#06080c] flex items-center justify-center">
                <Zap className="w-4 h-4 text-cyan-400" />
              </div>
            </div>
            <div>
              <h2 className="font-display font-bold text-sm text-white tracking-wide flex items-center gap-1.5">
                ZEN.CHAT
                <span className="text-[8px] font-mono px-1.5 py-0.2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-full font-bold">
                  ENCRYPTED
                </span>
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsCreateModalOpen(true)}
            className="p-2 rounded-xl bg-white hover:bg-neutral-200 text-black transition shadow-[0_0_20px_rgba(255,255,255,0.2)] cursor-pointer"
            title="New Chat or Group"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search channels, direct relays..."
            className="w-full pl-9 pr-8 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-xs font-mono text-white placeholder:text-neutral-600 focus:outline-none focus:border-cyan-500/50"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filter Pills */}
        <div className="flex gap-1 p-0.5 rounded-xl bg-white/[0.03] border border-white/5 font-mono text-[11px]">
          {[
            { id: 'all', label: 'All' },
            { id: 'dms', label: 'Direct' },
            { id: 'groups', label: 'Channels' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id as 'all' | 'dms' | 'groups')}
              className={`flex-1 py-1.5 rounded-lg font-semibold transition cursor-pointer ${
                activeFilter === tab.id
                  ? 'bg-white/15 text-white shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Active Call Floating Mini Bar */}
      {activeCall.isActive && (
        <div className="mx-3 my-2 p-2.5 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 flex items-center justify-between text-emerald-400 font-mono text-xs animate-pulse">
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-emerald-400" />
            <span className="truncate max-w-[150px] font-bold">{activeCall.conversationName}</span>
          </div>
          <span className="text-[10px] bg-emerald-500/20 px-2 py-0.5 rounded-full">
            {Math.floor(activeCall.durationSeconds / 60)}:{(activeCall.durationSeconds % 60).toString().padStart(2, '0')}
          </span>
        </div>
      )}

      {/* Conversation Stream */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {filteredConversations.length === 0 ? (
          <div className="py-12 px-4 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center mx-auto">
              <MessageSquare className="w-6 h-6 text-neutral-600" />
            </div>
            <div>
              <p className="font-mono text-xs text-neutral-400">No conversations found</p>
              <p className="text-[10px] font-mono text-neutral-600 mt-0.5">Initialize a direct relay to connect.</p>
            </div>
            <button
              type="button"
              onClick={() => setIsCreateModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white font-mono text-xs font-semibold transition cursor-pointer"
            >
              Launch Chat
            </button>
          </div>
        ) : (
          <>
            {/* Pinned Section */}
            {pinnedConvs.length > 0 && (
              <div className="space-y-1 mb-2">
                <div className="px-2.5 py-1 flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-amber-400">
                  <Pin className="w-3 h-3 fill-amber-400" />
                  <span>Pinned Relays</span>
                </div>
                {pinnedConvs.map((conv) => (
                  <ConversationItem
                    key={conv.id}
                    conv={conv}
                    isActive={conv.id === activeConversationId}
                    onSelect={() => setActiveConversationId(conv.id)}
                    onDelete={() => deleteConversation(conv.id)}
                    onTogglePin={() => togglePinConversation(conv.id)}
                  />
                ))}
              </div>
            )}

            {/* General Conversations */}
            {otherConvs.map((conv) => (
              <ConversationItem
                key={conv.id}
                conv={conv}
                isActive={conv.id === activeConversationId}
                onSelect={() => setActiveConversationId(conv.id)}
                onDelete={() => deleteConversation(conv.id)}
                onTogglePin={() => togglePinConversation(conv.id)}
              />
            ))}
          </>
        )}
      </div>

      {/* User Status Footer */}
      <div className="p-3 border-t border-white/10 bg-white/[0.01] flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="relative">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-400 to-violet-500 p-0.5">
              <div className="w-full h-full rounded-[10px] bg-[#06080c] flex items-center justify-center font-display font-bold text-xs text-white uppercase">
                {currentUser.name?.[0]?.toUpperCase() || 'U'}
              </div>
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border border-black" />
          </div>

          <div className="min-w-0">
            <p className="font-mono text-xs font-semibold text-white truncate">{currentUser.name}</p>
            <p className="font-mono text-[10px] text-neutral-400 truncate">@{currentUser.username}</p>
          </div>
        </div>

        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-neutral-400">
          ZID ONLINE
        </span>
      </div>
    </aside>
  );
}

function ConversationItem({
  conv,
  isActive,
  onSelect,
  onDelete,
  onTogglePin
}: {
  conv: any;
  isActive: boolean;
  onSelect: () => void;
  onDelete: () => void;
  onTogglePin: () => void;
}) {
  const isGroup = conv.type === 'group';

  return (
    <div
      onClick={onSelect}
      className={`group relative p-2.5 rounded-2xl transition cursor-pointer flex items-center gap-3 border ${
        isActive
          ? 'bg-gradient-to-r from-white/15 to-white/5 border-white/20 text-white shadow-lg'
          : 'border-transparent hover:bg-white/[0.04] text-neutral-300'
      }`}
    >
      {/* Avatar */}
      <div className="relative shrink-0">
        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-display font-bold text-sm uppercase shadow-sm ${
          isGroup ? 'bg-violet-950/60 border border-violet-500/30 text-violet-300' : 'bg-white/10 border border-white/15 text-white'
        }`}>
          {isGroup ? <Users className="w-4 h-4" /> : (conv.name?.[0]?.toUpperCase() || 'U')}
        </div>
        {!isGroup && (
          <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#050608]" />
        )}
      </div>

      {/* Name and Last Message */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-1">
          <span className="font-mono text-xs font-semibold truncate text-white">
            {conv.name}
          </span>
          <span className="font-mono text-[10px] text-neutral-500 shrink-0">
            {conv.lastMessage?.timestamp || ''}
          </span>
        </div>

        <p className="font-sans text-xs text-neutral-400 truncate mt-0.5">
          {conv.lastMessage ? (
            <span>
              {conv.lastMessage.senderName === 'You' ? '' : `${conv.lastMessage.senderName.split(' ')[0]}: `}
              {conv.lastMessage.text}
            </span>
          ) : (
            <span className="italic text-neutral-600">No messages yet</span>
          )}
        </p>
      </div>

      {/* Action Hover Controls (Pin / Delete) */}
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition shrink-0" onClick={(e) => e.stopPropagation()}>
        <button
          onClick={onTogglePin}
          className={`p-1 rounded-lg transition ${
            conv.isPinned ? 'text-amber-400 bg-amber-500/10' : 'text-neutral-500 hover:text-white hover:bg-white/10'
          }`}
          title={conv.isPinned ? 'Unpin' : 'Pin'}
        >
          <Pin className={`w-3.5 h-3.5 ${conv.isPinned ? 'fill-amber-400' : ''}`} />
        </button>

        <button
          onClick={onDelete}
          className="p-1 rounded-lg text-neutral-500 hover:text-rose-400 hover:bg-rose-500/10 transition"
          title="Delete chat"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
