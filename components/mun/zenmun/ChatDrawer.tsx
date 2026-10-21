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
  const [messages, setMessages] = useState<ChatMessage[]>([
    // Empty by default to display the canonical "Say hello to start this conversation" empty state from reference
  ]);

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
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fade-in select-none">
      <div className="w-full max-w-4xl h-[620px] bg-[#FAF9F5] rounded-3xl border border-[#D5D0C2] shadow-2xl flex overflow-hidden">
        
        {/* ─────────────────────────────────────────────────────────────
            LEFT COLUMN: Conversations & Delegation List (~300px)
        ───────────────────────────────────────────────────────────── */}
        <div className="w-80 bg-[#FAF9F5] border-r border-[#E2DDD0] flex flex-col shrink-0">
          
          {/* Header */}
          <div className="p-4 pb-3 flex items-center justify-between">
            <h2 className="text-xl font-black text-[#1C2E20] tracking-tight">Chat</h2>
            <button
              type="button"
              className="w-7 h-7 rounded-full bg-[#233C27] hover:bg-[#2e4d32] text-white flex items-center justify-center transition cursor-pointer"
              title="New Conversation"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Search Bar */}
          <div className="px-4 pb-3">
            <div className="relative">
              <Search className="w-4 h-4 text-[#8C887E] absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search"
                className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-white border border-[#DCD7C9] text-xs text-[#1A1D1A] placeholder-[#8C887E] focus:outline-none focus:ring-1 focus:ring-[#233C27]"
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
                  ? 'bg-[#EAE5D8]'
                  : 'hover:bg-[#F2EFE8]'
              }`}
            >
              <div className="w-10 h-10 rounded-full bg-[#E8DFB8] border border-[#D5C995] flex items-center justify-center shrink-0">
                <Megaphone className="w-5 h-5 text-[#8A7120] fill-[#8A7120]" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs font-black text-[#1C2E20]">Everyone</div>
                <div className="text-[11px] text-[#7A7870] truncate">Everyone in the room</div>
              </div>
            </button>

            {/* Section Divider */}
            <div className="px-3 pt-4 pb-1">
              <span className="text-[10px] font-black uppercase text-[#8C887E] tracking-wider">
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
                      ? 'bg-[#EAE5D8]'
                      : 'hover:bg-[#F2EFE8]'
                  }`}
                >
                  <img
                    src={`https://flagcdn.com/w80/${del.countryCode.toLowerCase()}.png`}
                    alt={del.name}
                    className="w-10 h-10 rounded-full object-cover border border-[#D5D0C2] shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-black text-[#1C2E20] truncate">{del.name}</div>
                    <div className="text-[11px] text-[#7A7870] truncate">{lastSnippet}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* ─────────────────────────────────────────────────────────────
            RIGHT COLUMN: Channel Header, Messages & Input Dock
        ───────────────────────────────────────────────────────────── */}
        <div className="flex-1 flex flex-col min-w-0 bg-[#FAF9F5]">
          
          {/* Channel Header */}
          <header className="px-5 py-3.5 border-b border-[#E2DDD0] flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5 min-w-0">
              {activeChannel === 'everyone' ? (
                <div className="w-8 h-8 rounded-full bg-[#E8DFB8] border border-[#D5C995] flex items-center justify-center shrink-0">
                  <Megaphone className="w-4 h-4 text-[#8A7120] fill-[#8A7120]" />
                </div>
              ) : (
                <img
                  src={`https://flagcdn.com/w80/${activeDelegate?.countryCode.toLowerCase()}.png`}
                  alt=""
                  className="w-8 h-8 rounded-full object-cover border border-[#D5D0C2] shrink-0"
                />
              )}

              <div className="flex items-center gap-2 truncate">
                <span className="text-sm font-black text-[#1C2E20] truncate">{activeTitle}</span>
                <span className="text-xs text-[#7A7870] hidden sm:inline">&bull;</span>
                <span className="text-xs text-[#7A7870] truncate hidden sm:inline">{activeSubtitle}</span>
                <Info className="w-3.5 h-3.5 text-[#8C887E] cursor-pointer shrink-0" />
              </div>
            </div>

            {/* Close Button */}
            <button
              type="button"
              onClick={() => setShowChatDrawer(false)}
              className="w-8 h-8 rounded-full bg-[#EFECE3] hover:bg-[#E3DFD3] text-[#4A4841] hover:text-[#1A1D1A] flex items-center justify-center transition cursor-pointer shrink-0"
              title="Close Chat"
            >
              <X className="w-4 h-4" />
            </button>
          </header>

          {/* Messages or Empty State */}
          <div className="flex-1 overflow-y-auto p-6 flex flex-col justify-center">
            {activeMessages.length === 0 ? (
              /* Canonical Gavelling Empty State */
              <div className="flex flex-col items-center justify-center text-center space-y-3 my-auto">
                {activeChannel === 'everyone' ? (
                  <div className="w-20 h-20 rounded-full bg-[#EFE9D2] border border-[#DED4B2] flex items-center justify-center shadow-xs">
                    <Megaphone className="w-10 h-10 text-[#8A7120] fill-[#8A7120]" />
                  </div>
                ) : (
                  <img
                    src={`https://flagcdn.com/w160/${activeDelegate?.countryCode.toLowerCase()}.png`}
                    alt=""
                    className="w-20 h-20 rounded-full object-cover border-2 border-[#D5D0C2] shadow-xs"
                  />
                )}
                <div className="space-y-1">
                  <h3 className="text-lg font-black text-[#1C2E20]">{activeTitle}</h3>
                  <p className="text-xs text-[#7A7870]">
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
                      <span className="text-[10px] font-bold text-[#7A7870]">{msg.sender}</span>
                      <span className="text-[9px] text-[#A8A49A]">{msg.time}</span>
                    </div>
                    <div
                      className={`max-w-md px-4 py-2 rounded-2xl text-xs font-medium leading-relaxed ${
                        msg.isChair
                          ? 'bg-[#233C27] text-white rounded-br-xs'
                          : 'bg-white text-[#1C2E20] border border-[#E0DCCE] rounded-bl-xs'
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
          <div className="p-4 border-t border-[#E2DDD0] bg-[#FAF9F5]">
            <form onSubmit={handleSend} className="flex items-center gap-2">
              <div className="flex-1 flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-white border border-[#DCD7C9] focus-within:border-[#233C27] focus-within:ring-1 focus-within:ring-[#233C27] transition">
                {/* Paperclip */}
                <button
                  type="button"
                  className="text-[#7A7870] hover:text-[#1C2E20] transition cursor-pointer p-0.5"
                  title="Attach file"
                >
                  <Paperclip className="w-4 h-4" />
                </button>

                {/* GIF badge button */}
                <button
                  type="button"
                  className="px-1.5 py-0.5 rounded-md bg-[#EFECE3] hover:bg-[#E5E0D0] text-[10px] font-black text-[#5C5A52] tracking-wider transition cursor-pointer"
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
                  className="flex-1 bg-transparent text-xs text-[#1A1D1A] placeholder-[#8C887E] focus:outline-none"
                />

                {/* Send button (Circle with up arrow) */}
                <button
                  type="submit"
                  disabled={!inputVal.trim()}
                  className={`w-7 h-7 rounded-full flex items-center justify-center transition cursor-pointer ${
                    inputVal.trim()
                      ? 'bg-[#233C27] hover:bg-[#2e4d32] text-white shadow-xs'
                      : 'bg-[#E5E0D0] text-[#A8A49A] cursor-not-allowed'
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
