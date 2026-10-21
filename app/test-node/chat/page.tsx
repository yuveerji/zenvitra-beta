'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageSquare, 
  Send, 
  Users, 
  Radio, 
  ShieldCheck, 
  Sparkles,
  Lock,
  User,
  Clock
} from 'lucide-react';
import { TestNodeProvider, useTestNode } from '@/context/TestNodeContext';
import { TestNodeShell } from '@/components/test-node/TestNodeShell';

function TestChatContent() {
  const { chatChannels, sendChatMessage, activePersona } = useTestNode();
  const [selectedChannelId, setSelectedChannelId] = useState(chatChannels[0].id);
  const [inputText, setInputText] = useState('');
  const [isTypingSimulated, setIsTypingSimulated] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeChannel = chatChannels.find((c) => c.id === selectedChannelId) || chatChannels[0];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeChannel.messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userText = inputText.trim();
    sendChatMessage(activeChannel.id, userText);
    setInputText('');

    // Trigger synthetic peer response after 1.8 seconds to showcase bidirectional comms
    setIsTypingSimulated(true);
    setTimeout(() => {
      setIsTypingSimulated(false);
      const simulatedReplies = [
        `The Delegation of Germany acknowledges ${activePersona.name}'s point. We agree with your proposed revision.`,
        `Received loud and clear on the secretariat wire. Forwarding directive to the rapporteur.`,
        `Chamber note: Please ensure all diplomatic chits are channeled through the page runner.`,
        `Cosponsorship agreed. We will sign on to working clause 3.`,
      ];
      const randomReply = simulatedReplies[Math.floor(Math.random() * simulatedReplies.length)];
      sendChatMessage(activeChannel.id, randomReply);
    }, 1800);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-blue-950/40 via-[#0a0d18] to-black border border-blue-500/30 space-y-2">
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 font-mono text-[10px] uppercase font-bold tracking-wider">
            ZEN.CHAT // SIMULATED COMMUNICATIONS
          </span>
          <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-[10px] font-mono font-bold">
            INTERNAL SANDBOX WIRE (NO REAL USERS CONTACTED)
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white uppercase font-display">
          Chamber Backchannels &amp; Secretariat Direct Wire
        </h1>
        <p className="text-xs text-neutral-400 font-sans">
          Test real-time messaging, committee bloc formation, and official broadcasts. Sending a message triggers simulated envoy responses to illustrate live multilateral communications.
        </p>
      </div>

      {/* Main Chat Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[600px] rounded-3xl bg-[#080d1c] border border-white/15 overflow-hidden">
        {/* Left: Channels Sidebar (4 Cols) */}
        <div className="lg:col-span-4 border-r border-white/10 p-4 space-y-3 flex flex-col justify-between bg-black/40">
          <div className="space-y-2">
            <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider font-bold px-2">
              SEEDED CHANNELS
            </span>
            {chatChannels.map((ch) => {
              const isSelected = ch.id === selectedChannelId;
              return (
                <button
                  key={ch.id}
                  type="button"
                  onClick={() => setSelectedChannelId(ch.id)}
                  className={`w-full text-left p-3 rounded-2xl transition cursor-pointer space-y-1 ${
                    isSelected
                      ? 'bg-blue-500/20 border border-blue-400 text-white'
                      : 'hover:bg-white/5 border border-transparent text-neutral-300'
                  }`}
                >
                  <div className="flex items-center justify-between font-mono text-xs font-bold">
                    <span className="truncate">{ch.name}</span>
                    {ch.messages.length > 0 && (
                      <span className="px-1.5 py-0.2 rounded bg-white/10 text-[9px] text-neutral-400">
                        {ch.messages.length}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-neutral-400 line-clamp-1 font-sans">
                    {ch.description}
                  </p>
                </button>
              );
            })}
          </div>

          <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/5 text-[10px] font-mono text-neutral-500">
            Posting as: <strong className="text-cyan-300">{activePersona.name} ({activePersona.role})</strong>
          </div>
        </div>

        {/* Right: Message Stream & Composer (8 Cols) */}
        <div className="lg:col-span-8 flex flex-col justify-between h-full bg-[#060a16]">
          {/* Active Channel Header */}
          <div className="p-4 border-b border-white/10 flex items-center justify-between font-mono text-xs">
            <div>
              <div className="font-bold text-white text-sm">{activeChannel.name}</div>
              <div className="text-[11px] text-neutral-400">{activeChannel.description}</div>
            </div>
            <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
              ● Simulated Active
            </span>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 p-5 overflow-y-auto space-y-3 text-xs">
            {activeChannel.messages.map((m) => {
              const isMe = m.senderName === activePersona.name;
              return (
                <div
                  key={m.id}
                  className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                >
                  <div className="flex items-center gap-1.5 text-[10px] font-mono text-neutral-400 mb-1 px-1">
                    <span className="font-bold text-neutral-200">{m.senderName}</span>
                    {m.isOfficial && (
                      <span className="px-1 rounded bg-purple-500/20 text-purple-300 font-bold text-[8px] uppercase">
                        Official
                      </span>
                    )}
                    <span>&bull;</span>
                    <span>{m.timestamp}</span>
                  </div>

                  <div
                    className={`p-3.5 rounded-2xl max-w-md font-sans text-xs leading-relaxed ${
                      isMe
                        ? 'bg-blue-600 text-white rounded-br-xs'
                        : 'bg-white/10 text-neutral-200 border border-white/10 rounded-bl-xs'
                    }`}
                  >
                    {m.content}
                  </div>
                </div>
              );
            })}

            {isTypingSimulated && (
              <div className="flex items-center gap-2 text-[10px] font-mono text-cyan-400 italic">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce" />
                <span>Simulated envoy is typing a response...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Composer */}
          <form onSubmit={handleSendMessage} className="p-4 border-t border-white/10 bg-black/40 flex items-center gap-3">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={`Message ${activeChannel.name} as ${activePersona.name}...`}
              className="flex-1 bg-[#111422] border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-blue-400 font-sans"
            />
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-blue-500 hover:bg-blue-400 text-white font-mono text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-lg shadow-blue-500/20"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function TestChatPage() {
  return (
    <TestNodeProvider>
      <TestNodeShell>
        <TestChatContent />
      </TestNodeShell>
    </TestNodeProvider>
  );
}
