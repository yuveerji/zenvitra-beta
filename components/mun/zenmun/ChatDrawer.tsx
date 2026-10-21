'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Search,
  Plus,
  Paperclip,
  ArrowUp,
  Megaphone,
  Info,
} from 'lucide-react';
import { useZenMun } from '@/context/ZenMunContext';

interface ChatMessage {
  id: string;
  sender: string;
  text: string;
  time: string;
  channel: string;
  isChair?: boolean;
}

export function ChatDrawer() {
  const { session, showChatDrawer, setShowChatDrawer } = useZenMun();

  const [activeChannel, setActiveChannel] = useState<'everyone' | string>('everyone');
  const [searchQuery, setSearchQuery] = useState('');
  const [inputVal, setInputVal] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, activeChannel]);

  if (!showChatDrawer) return null;

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputVal.trim()) return;

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: session.chairName || 'Dais',
      text: inputVal.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      channel: activeChannel,
      isChair: true,
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputVal('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSend();
    }
  };

  // Filtered delegations based on search
  const filteredRoster = session.roster.filter((d) =>
    d.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Active channel messages
  const activeMessages = messages.filter((m) => m.channel === activeChannel);

  // Active header label
  const activeDelegate = session.roster.find((d) => d.id === activeChannel);
  const activeTitle = activeChannel === 'everyone' ? 'Everyone' : activeDelegate?.name || 'Delegate';
  const activeSubtitle =
    activeChannel === 'everyone'
      ? 'Everyone in the room'
      : `Direct message with ${activeDelegate?.name || 'delegate'}`;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fade-in select-none">
      <div className="w-full max-w-4xl h-[620px] bg-[#090d16] rounded-3xl border border-white/15 shadow-2xl flex overflow-hidden">
        
        {/* ─────────────────────────────────────────────────────────────
            LEFT COLUMN: Conversations & Delegation List (~300px)
        ───────────────────────────────────────────────────────────── */}
        <div className="w-80 bg-[#070a12]/95 border-r border-white/10 flex flex-col shrink-0">
          
          {/* Header */}
          <div className="p-4 pb-3 flex items-center justify-between">
            <h2 className="text-xl font-black text-white tracking-tight">Chat</h2>
            <button
              type="button"
              className="w-7 h-7 rounded-full bg-cyan-500 hover:bg-cyan-400 text-black flex items-center justify-center transition cursor-pointer shadow-xs"
              title="New Conversation"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Search Bar */}
          <div className="px-4 pb-3">
            <div className="relative">
              <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search"
                className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-400"
              />
            </div>
          </div>

          {/* Channels & Conversations Scroll Area */}
          <div className="flex-1 overflow-y-auto px-2 space-y-1">
            
            {/* Everyone Channel */}
            <button
              type="button"
              onClick={() => setActiveChannel('everyone')}
              className={`w-full p-2.5 rounded-2xl flex items-center gap-3 transition cursor-pointer text-left ${
                activeChannel === 'everyone'
                  ? 'bg-cyan-500/15 border border-cyan-500/30'
                  : 'hover:bg-white/5'
              }`}
            >
              <div className="w-10 h-10 rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center justify-center shrink-0">
                <Megaphone className="w-5 h-5 text-amber-400 fill-amber-400" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs font-black text-white">Everyone</div>
                <div className="text-[11px] text-neutral-400 truncate">Everyone in the room</div>
              </div>
            </button>

            {/* Section Divider */}
            <div className="px-3 pt-4 pb-1">
              <span className="text-[10px] font-black uppercase text-neutral-400 tracking-wider">
                Start a conversation
              </span>
            </div>

            {/* Roster Delegations */}
            {filteredRoster.map((del) => {
              const isSelected = activeChannel === del.id;
              const delMessages = messages.filter((m) => m.channel === del.id);
              const lastSnippet = delMessages.length > 0
                ? delMessages[delMessages.length - 1].text
                : 'No messages yet';

              return (
                <button
                  key={del.id}
                  type="button"
                  onClick={() => setActiveChannel(del.id)}
                  className={`w-full p-2.5 rounded-2xl flex items-center gap-3 transition cursor-pointer text-left ${
                    isSelected
                      ? 'bg-cyan-500/15 border border-cyan-500/30'
                      : 'hover:bg-white/5'
                  }`}
                >
                  <img
                    src={`https://flagcdn.com/w80/${del.countryCode.toLowerCase()}.png`}
                    alt={del.name}
                    className="w-10 h-10 rounded-full object-cover border border-white/20 shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-black text-white truncate">{del.name}</div>
                    <div className="text-[11px] text-neutral-400 truncate">{lastSnippet}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* ─────────────────────────────────────────────────────────────
            RIGHT COLUMN: Channel Header, Messages & Input Dock
        ───────────────────────────────────────────────────────────── */}
        <div className="flex-1 flex flex-col min-w-0 bg-[#090d16]">
          
          {/* Channel Header */}
          <header className="px-5 py-3.5 border-b border-white/10 flex items-center justify-between shrink-0 bg-[#0a0f1d]">
            <div className="flex items-center gap-2.5 min-w-0">
              {activeChannel === 'everyone' ? (
                <div className="w-8 h-8 rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center justify-center shrink-0">
                  <Megaphone className="w-4 h-4 text-amber-400 fill-amber-400" />
                </div>
              ) : (
                <img
                  src={`https://flagcdn.com/w80/${activeDelegate?.countryCode.toLowerCase()}.png`}
                  alt=""
                  className="w-8 h-8 rounded-full object-cover border border-white/20 shrink-0"
                />
              )}

              <div className="flex items-center gap-2 truncate">
                <span className="text-sm font-black text-white truncate">{activeTitle}</span>
                <span className="text-xs text-neutral-500 hidden sm:inline">•</span>
                <span className="text-xs text-neutral-400 truncate hidden sm:inline">{activeSubtitle}</span>
                <Info className="w-3.5 h-3.5 text-neutral-400 cursor-pointer shrink-0" />
              </div>
            </div>

            {/* Close Button */}
            <button
              type="button"
              onClick={() => setShowChatDrawer(false)}
              className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white flex items-center justify-center transition cursor-pointer shrink-0 border border-white/10"
              title="Close Chat"
            >
              <X className="w-4 h-4" />
            </button>
          </header>

          {/* Messages or Empty State */}
          <div className="flex-1 overflow-y-auto p-6 flex flex-col justify-center">
            {activeMessages.length === 0 ? (
              /* Canonical Empty State */
              <div className="flex flex-col items-center justify-center text-center space-y-3 my-auto">
                {activeChannel === 'everyone' ? (
                  <div className="w-20 h-20 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shadow-xs">
                    <Megaphone className="w-10 h-10 text-amber-400 fill-amber-400" />
                  </div>
                ) : (
                  <img
                    src={`https://flagcdn.com/w160/${activeDelegate?.countryCode.toLowerCase()}.png`}
                    alt=""
                    className="w-20 h-20 rounded-full object-cover border-2 border-white/20 shadow-xs"
                  />
                )}
                <div className="space-y-1">
                  <h3 className="text-lg font-black text-white">{activeTitle}</h3>
                  <p className="text-xs text-neutral-400">
                    Say hello to start this conversation
                  </p>
                </div>
              </div>
            ) : (
              /* Messages List */
              <div className="space-y-3.5 my-auto justify-end flex flex-col">
                {activeMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${msg.isChair ? 'items-end' : 'items-start'}`}
                  >
                    <div className="flex items-center gap-2 mb-1 px-1">
                      <span className="text-[10px] font-bold text-neutral-400">{msg.sender}</span>
                      <span className="text-[9px] text-neutral-500">{msg.time}</span>
                    </div>
                    <div
                      className={`max-w-md px-4 py-2 rounded-2xl text-xs font-medium leading-relaxed ${
                        msg.isChair
                          ? 'bg-cyan-500 text-black font-semibold rounded-br-xs shadow-md'
                          : 'bg-white/10 text-white border border-white/10 rounded-bl-xs'
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* Bottom Input Dock */}
          <div className="p-4 border-t border-white/10 bg-[#0a0f1d]">
            <form onSubmit={handleSend} className="flex items-center gap-2">
              <div className="flex-1 flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-white/5 border border-white/10 focus-within:border-cyan-400 transition">
                {/* Paperclip */}
                <button
                  type="button"
                  className="text-neutral-400 hover:text-white transition cursor-pointer p-0.5"
                  title="Attach file"
                >
                  <Paperclip className="w-4 h-4" />
                </button>

                {/* GIF badge button */}
                <button
                  type="button"
                  className="px-1.5 py-0.5 rounded-md bg-white/10 hover:bg-white/20 text-[10px] font-black text-neutral-300 tracking-wider transition cursor-pointer"
                >
                  GIF
                </button>

                {/* Text input */}
                <input
                  type="text"
                  value={inputVal}
                  onChange={(e) => setInputVal(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Message..."
                  className="flex-1 bg-transparent text-xs text-white placeholder-neutral-500 focus:outline-none"
                />

                {/* Send button */}
                <button
                  type="submit"
                  disabled={!inputVal.trim()}
                  className={`w-7 h-7 rounded-full flex items-center justify-center transition cursor-pointer ${
                    inputVal.trim()
                      ? 'bg-cyan-500 hover:bg-cyan-400 text-black shadow-md'
                      : 'bg-white/10 text-neutral-500 cursor-not-allowed'
                  }`}
                  title="Send message"
                >
                  <ArrowUp className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>

        </div>

      </div>
    </div>
  );
}

export default ChatDrawer;
