'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  Phone, 
  Video, 
  Send, 
  Smile, 
  Paperclip, 
  CheckCheck, 
  Users, 
  PhoneOff, 
  Mic, 
  MicOff, 
  Headphones, 
  ScreenShare, 
  Copy, 
  Check, 
  Trash2, 
  MessageSquare,
  FileText,
  X,
  Pin,
  Edit2,
  Search,
  Sparkles,
  ShieldCheck,
  Radio,
  Image as ImageIcon,
  MoreVertical
} from 'lucide-react';
import { useZenChat } from '@/context/ZenChatPlatformContext';
import { ChatMessage } from '@/types/chat';

const QUICK_EMOJIS = ['👍', '❤️', '🔥', '⚡', '👏', '😂'];
const EMOJI_PALETTE = ['👍', '❤️', '🔥', '⚡', '👏', '😂', '🎉', '🚀', '💡', '🛡️', '✨', '🤝', '💯', '🎯'];

export function CleanChatWindow() {
  const {
    activeConversation,
    messages,
    sendMessage,
    editMessage,
    pinMessage,
    addReaction,
    deleteMessage,
    activeCall,
    startCall,
    endCall,
    toggleCallMute,
    toggleCallDeafen,
    toggleCallScreenShare,
    deleteConversation,
    currentUser
  } = useZenChat();

  const [input, setInput] = useState('');
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editInput, setEditInput] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [chatSearchQuery, setChatSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [attachedFile, setAttachedFile] = useState<{ name: string; size: string; url?: string } | null>(null);
  const [replyingTo, setReplyingTo] = useState<ChatMessage | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length]);

  if (!activeConversation) {
    return (
      <div className="flex-1 h-full bg-[#030405] flex flex-col items-center justify-center p-8 text-center select-none font-sans">
        <div className="w-20 h-20 rounded-3xl bg-white/[0.03] border border-white/10 flex items-center justify-center mb-6 shadow-inner">
          <MessageSquare className="w-10 h-10 text-neutral-600" />
        </div>
        <h3 className="font-display font-bold text-xl text-white">Encrypted Relay Terminal</h3>
        <p className="font-mono text-xs text-neutral-500 max-w-sm mt-2 leading-relaxed">
          Select a sovereign peer or delegate channel from the sidebar to establish a cryptographic direct message relay.
        </p>
      </div>
    );
  }

  const handleSend = () => {
    if (!input.trim() && !attachedFile) return;

    const attachments = attachedFile ? [{
      type: 'file' as const,
      url: attachedFile.url || '#',
      name: attachedFile.name,
      size: attachedFile.size
    }] : undefined;

    const replyPayload = replyingTo ? {
      id: replyingTo.id,
      senderName: replyingTo.senderName,
      snippet: replyingTo.content.slice(0, 60)
    } : undefined;

    sendMessage(input, attachments, replyPayload);
    setInput('');
    setAttachedFile(null);
    setReplyingTo(null);
    setShowEmojiPicker(false);
  };

  const handleStartEdit = (msg: ChatMessage) => {
    setEditingMessageId(msg.id);
    setEditInput(msg.content);
  };

  const handleSaveEdit = () => {
    if (editingMessageId && editInput.trim()) {
      editMessage(editingMessageId, editInput);
      setEditingMessageId(null);
      setEditInput('');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAttachedFile({
        name: file.name,
        size: `${(file.size / 1024).toFixed(1)} KB`,
        url: URL.createObjectURL(file)
      });
    }
  };

  const copyText = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const pinnedMessages = messages.filter((m) => m.isPinned);
  const displayMessages = chatSearchQuery.trim()
    ? messages.filter((m) => m.content.toLowerCase().includes(chatSearchQuery.toLowerCase()))
    : messages;

  return (
    <div className="flex-1 h-full bg-[#030405] flex flex-col justify-between relative overflow-hidden font-sans">
      {/* Voice/Video Call HUD Overlay */}
      {activeCall.isActive && activeCall.conversationId === activeConversation.id && (
        <div className="absolute top-0 inset-x-0 z-30 bg-gradient-to-b from-[#080c14] to-[#04060a]/95 backdrop-blur-2xl border-b border-cyan-500/30 p-4 shadow-[0_0_50px_rgba(0,242,254,0.15)] flex flex-col sm:flex-row items-center justify-between gap-4 animate-in slide-in-from-top duration-300">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-11 h-11 rounded-2xl bg-cyan-950 border border-cyan-500/40 flex items-center justify-center font-display font-bold text-white shadow-inner">
                <Radio className="w-5 h-5 text-cyan-400 animate-pulse" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-black" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="font-display font-bold text-sm text-white">Live Voice Matrix</span>
                <span className="text-[10px] font-mono bg-cyan-500/10 text-cyan-400 px-2 py-0.5 rounded-full border border-cyan-500/30">
                  OPUS 320 KBPS
                </span>
              </div>
              <p className="text-xs font-mono text-neutral-400">
                Connected with {activeCall.conversationName} • {Math.floor(activeCall.durationSeconds / 60)}:{(activeCall.durationSeconds % 60).toString().padStart(2, '0')}
              </p>
            </div>
          </div>

          {/* Call Spectrum Simulator */}
          <div className="flex items-end gap-1 h-6 px-4">
            {[40, 75, 30, 90, 60, 100, 45, 80, 55, 95].map((h, i) => (
              <div
                key={i}
                className="w-1 rounded-full bg-gradient-to-t from-cyan-400 to-violet-500 animate-pulse"
                style={{ height: `${activeCall.isMuted ? 15 : h}%`, animationDelay: `${i * 100}ms` }}
              />
            ))}
          </div>

          {/* Call Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleCallMute}
              className={`p-2.5 rounded-xl transition cursor-pointer ${
                activeCall.isMuted ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : 'bg-white/10 text-white hover:bg-white/20'
              }`}
              title={activeCall.isMuted ? 'Unmute' : 'Mute'}
            >
              {activeCall.isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>

            <button
              onClick={toggleCallDeafen}
              className={`p-2.5 rounded-xl transition cursor-pointer ${
                activeCall.isDeafened ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'bg-white/10 text-white hover:bg-white/20'
              }`}
              title={activeCall.isDeafened ? 'Undeafen' : 'Deafen'}
            >
              <Headphones className="w-4 h-4" />
            </button>

            <button
              onClick={toggleCallScreenShare}
              className={`p-2.5 rounded-xl transition cursor-pointer ${
                activeCall.isScreenSharing ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' : 'bg-white/10 text-white hover:bg-white/20'
              }`}
              title="Share screen"
            >
              <ScreenShare className="w-4 h-4" />
            </button>

            <button
              onClick={endCall}
              className="p-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white transition shadow-lg cursor-pointer flex items-center gap-1.5 px-3 font-mono text-xs font-bold"
            >
              <PhoneOff className="w-4 h-4" />
              <span>Leave</span>
            </button>
          </div>
        </div>
      )}

      {/* Top Conversation Header */}
      <header className="p-4 border-b border-white/10 bg-[#050608]/90 backdrop-blur-xl flex items-center justify-between z-10 shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <div className="relative">
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-display font-bold text-sm uppercase shadow-sm ${
              activeConversation.type === 'group'
                ? 'bg-violet-950/60 border border-violet-500/30 text-violet-300'
                : 'bg-white/10 border border-white/15 text-white'
            }`}>
              {activeConversation.type === 'group' ? <Users className="w-5 h-5" /> : (activeConversation.name?.[0]?.toUpperCase() || 'U')}
            </div>
            {activeConversation.type === 'dm' && (
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-[#050608]" />
            )}
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="font-display font-bold text-base text-white truncate">
                {activeConversation.name}
              </h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                {activeConversation.type === 'group' ? 'CHANNEL' : 'PEER NODE'}
              </span>
            </div>
            <p className="font-mono text-xs text-neutral-400 truncate">
              {activeConversation.type === 'group'
                ? `${activeConversation.members.length} verified delegates in channel`
                : `@${activeConversation.handle || 'user'}`}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowSearch(!showSearch)}
            className={`p-2.5 rounded-xl transition cursor-pointer ${
              showSearch ? 'bg-cyan-500/20 text-cyan-400' : 'text-neutral-400 hover:text-white hover:bg-white/[0.05]'
            }`}
            title="Search in conversation"
          >
            <Search className="w-4 h-4" />
          </button>

          {!activeCall.isActive && (
            <>
              <button
                onClick={() => startCall(activeConversation.id, 'voice')}
                className="p-2.5 rounded-xl bg-white/[0.04] hover:bg-emerald-500/15 border border-white/10 hover:border-emerald-500/30 text-neutral-300 hover:text-emerald-400 transition cursor-pointer"
                title="Start Voice Relay"
              >
                <Phone className="w-4 h-4" />
              </button>

              <button
                onClick={() => startCall(activeConversation.id, 'video')}
                className="p-2.5 rounded-xl bg-white/[0.04] hover:bg-violet-500/15 border border-white/10 hover:border-violet-500/30 text-neutral-300 hover:text-violet-400 transition cursor-pointer"
                title="Start Video Session"
              >
                <Video className="w-4 h-4" />
              </button>
            </>
          )}

          <button
            onClick={() => deleteConversation(activeConversation.id)}
            className="p-2.5 rounded-xl text-neutral-400 hover:text-rose-400 hover:bg-rose-500/10 transition cursor-pointer"
            title="Delete conversation"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* In-Chat Search Bar */}
      {showSearch && (
        <div className="p-3 bg-white/[0.02] border-b border-white/10 flex items-center gap-2 px-6 animate-in slide-in-from-top-1">
          <Search className="w-4 h-4 text-cyan-400 shrink-0" />
          <input
            type="text"
            value={chatSearchQuery}
            onChange={(e) => setChatSearchQuery(e.target.value)}
            placeholder="Search messages in this channel..."
            className="flex-1 bg-transparent text-xs font-mono text-white placeholder:text-neutral-600 focus:outline-none"
            autoFocus
          />
          {chatSearchQuery && (
            <span className="text-[10px] font-mono text-cyan-400">
              {displayMessages.length} found
            </span>
          )}
          <button onClick={() => { setShowSearch(false); setChatSearchQuery(''); }} className="text-neutral-500 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Pinned Messages Bar */}
      {pinnedMessages.length > 0 && (
        <div className="p-2.5 px-6 bg-amber-950/20 border-b border-amber-500/20 flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-2 truncate">
            <Pin className="w-3.5 h-3.5 text-amber-400 fill-amber-400 shrink-0" />
            <span className="text-amber-300 font-bold shrink-0">PINNED:</span>
            <span className="text-neutral-300 truncate">{pinnedMessages[pinnedMessages.length - 1].content}</span>
          </div>
          <span className="text-[10px] text-amber-400/80 shrink-0">{pinnedMessages.length} pinned</span>
        </div>
      )}

      {/* Messages Stream */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
        {displayMessages.length === 0 ? (
          <div className="py-20 text-center space-y-3">
            <div className="w-14 h-14 rounded-3xl bg-white/[0.03] border border-white/10 flex items-center justify-center mx-auto">
              <ShieldCheck className="w-7 h-7 text-neutral-600" />
            </div>
            <div>
              <p className="font-mono text-xs font-bold text-white">End-to-End Cryptographic Ledger</p>
              <p className="text-[11px] font-mono text-neutral-500 mt-1 max-w-xs mx-auto">
                All dispatches in this channel are encrypted and stored in local sovereign memory.
              </p>
            </div>
          </div>
        ) : (
          displayMessages.map((msg) => {
            const isMe = msg.isSelf || msg.senderId === currentUser.id;
            const isEditing = editingMessageId === msg.id;

            return (
              <div
                key={msg.id}
                className={`group relative flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
              >
                {/* Reply To Reference Bubble */}
                {msg.replyTo && (
                  <div className={`text-[11px] font-mono text-neutral-400 mb-1 flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/[0.04] border border-white/5 max-w-sm truncate ${
                    isMe ? 'mr-2' : 'ml-2'
                  }`}>
                    <span className="text-cyan-400 font-semibold">{msg.replyTo.senderName}:</span>
                    <span className="truncate">{msg.replyTo.snippet}</span>
                  </div>
                )}

                <div className="flex items-start gap-2.5 max-w-[85%] sm:max-w-[75%]">
                  {!isMe && (
                    <div className="w-8 h-8 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center font-display font-bold text-xs text-white uppercase shrink-0 mt-0.5">
                      {msg.senderName?.[0]?.toUpperCase() || 'U'}
                    </div>
                  )}

                  <div className="space-y-1">
                    {/* Header Name on non-self messages */}
                    {!isMe && (
                      <div className="flex items-center gap-2 pl-1">
                        <span className="font-mono text-[11px] font-bold text-cyan-400">{msg.senderName}</span>
                        <span className="font-mono text-[9px] text-neutral-500">@{msg.senderUsername}</span>
                      </div>
                    )}

                    {/* Message Bubble */}
                    <div
                      className={`relative p-3.5 sm:p-4 rounded-3xl text-sm leading-relaxed ${
                        isMe
                          ? 'bg-gradient-to-br from-white/20 via-white/10 to-white/5 border border-white/25 text-white shadow-md'
                          : 'bg-[#0a0c12] border border-white/10 text-neutral-200 shadow-sm'
                      }`}
                    >
                      {/* Editing Mode */}
                      {isEditing ? (
                        <div className="space-y-2">
                          <textarea
                            value={editInput}
                            onChange={(e) => setEditInput(e.target.value)}
                            className="w-full bg-black/40 border border-white/20 rounded-xl p-2 text-xs font-mono text-white focus:outline-none"
                            rows={2}
                            autoFocus
                          />
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => setEditingMessageId(null)}
                              className="px-2.5 py-1 rounded-lg text-neutral-400 hover:text-white text-xs font-mono"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={handleSaveEdit}
                              className="px-3 py-1 rounded-lg bg-white text-black font-mono text-xs font-bold"
                            >
                              Save
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <p className="whitespace-pre-wrap break-words">{msg.content}</p>

                          {/* File / Image Attachment */}
                          {msg.attachments && msg.attachments.length > 0 && (
                            <div className="mt-2.5 space-y-1.5">
                              {msg.attachments.map((att, i) => (
                                <div
                                  key={i}
                                  className="flex items-center gap-2 p-2 rounded-xl bg-black/40 border border-white/10 text-xs font-mono"
                                >
                                  <FileText className="w-4 h-4 text-cyan-400 shrink-0" />
                                  <span className="truncate flex-1">{att.name}</span>
                                  {att.size && <span className="text-neutral-500 text-[10px]">{att.size}</span>}
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Timestamp + Edited + Status */}
                          <div className={`flex items-center gap-1.5 justify-end mt-1 text-[10px] font-mono ${
                            isMe ? 'text-neutral-300' : 'text-neutral-500'
                          }`}>
                            {msg.isEdited && <span className="italic">(edited)</span>}
                            <span>{msg.timestamp}</span>
                            {isMe && <CheckCheck className="w-3.5 h-3.5 text-cyan-300" />}
                          </div>
                        </>
                      )}
                    </div>

                    {/* Reactions Display */}
                    {msg.reactions && msg.reactions.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1 pl-1">
                        {msg.reactions.map((rxn, idx) => (
                          <button
                            key={idx}
                            onClick={() => addReaction(msg.id, rxn.emoji)}
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/[0.06] border border-white/10 text-xs hover:bg-white/15 transition cursor-pointer"
                          >
                            <span>{rxn.emoji}</span>
                            <span className="text-[10px] font-mono text-neutral-300">{rxn.count}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Hover Floating Action Bar */}
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 p-1 rounded-2xl bg-[#0a0d16] border border-white/15 shadow-xl mt-1">
                    {/* Quick Emojis */}
                    {QUICK_EMOJIS.slice(0, 3).map((em) => (
                      <button
                        key={em}
                        onClick={() => addReaction(msg.id, em)}
                        className="p-1 hover:scale-125 transition cursor-pointer text-xs"
                      >
                        {em}
                      </button>
                    ))}

                    <button
                      onClick={() => setReplyingTo(msg)}
                      className="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
                      title="Reply"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => pinMessage(msg.id)}
                      className={`p-1 rounded-lg transition cursor-pointer ${
                        msg.isPinned ? 'text-amber-400' : 'text-neutral-400 hover:text-amber-400'
                      }`}
                      title={msg.isPinned ? 'Unpin' : 'Pin'}
                    >
                      <Pin className={`w-3.5 h-3.5 ${msg.isPinned ? 'fill-amber-400' : ''}`} />
                    </button>

                    {isMe && (
                      <button
                        onClick={() => handleStartEdit(msg)}
                        className="p-1 rounded-lg text-neutral-400 hover:text-cyan-400 hover:bg-white/10 transition cursor-pointer"
                        title="Edit"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                    )}

                    <button
                      onClick={() => copyText(msg.id, msg.content)}
                      className="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
                      title="Copy text"
                    >
                      {copiedId === msg.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>

                    {isMe && (
                      <button
                        onClick={() => deleteMessage(msg.id)}
                        className="p-1 rounded-lg text-neutral-400 hover:text-rose-400 hover:bg-rose-500/10 transition cursor-pointer"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Reply Quote Banner Above Input */}
      {replyingTo && (
        <div className="p-3 bg-[#0a0d18] border-t border-cyan-500/30 flex items-center justify-between px-6">
          <div className="flex items-center gap-2 truncate text-xs font-mono">
            <MessageSquare className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span className="text-cyan-300 font-bold">Replying to {replyingTo.senderName}:</span>
            <span className="text-neutral-400 truncate max-w-md">{replyingTo.content}</span>
          </div>
          <button onClick={() => setReplyingTo(null)} className="text-neutral-500 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Attached File Banner */}
      {attachedFile && (
        <div className="p-3 bg-white/[0.04] border-t border-white/10 flex items-center justify-between px-6">
          <div className="flex items-center gap-2 text-xs font-mono text-white">
            <Paperclip className="w-3.5 h-3.5 text-cyan-400" />
            <span>{attachedFile.name}</span>
            <span className="text-neutral-500 text-[10px]">({attachedFile.size})</span>
          </div>
          <button onClick={() => setAttachedFile(null)} className="text-neutral-500 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Bottom Input Terminal */}
      <div className="p-4 border-t border-white/10 bg-[#050608]/90 backdrop-blur-xl shrink-0">
        <div className="relative flex items-center gap-2">
          {/* File Input */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
          />

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="p-3 rounded-2xl bg-white/[0.04] hover:bg-white/10 border border-white/10 text-neutral-400 hover:text-white transition cursor-pointer"
            title="Attach file"
          >
            <Paperclip className="w-4 h-4" />
          </button>

          {/* Emoji Picker Button */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="p-3 rounded-2xl bg-white/[0.04] hover:bg-white/10 border border-white/10 text-neutral-400 hover:text-amber-400 transition cursor-pointer"
              title="Add reaction"
            >
              <Smile className="w-4 h-4" />
            </button>

            {showEmojiPicker && (
              <div className="absolute bottom-14 left-0 p-3 rounded-2xl bg-[#0a0d16] border border-white/15 shadow-2xl grid grid-cols-7 gap-2 z-30">
                {EMOJI_PALETTE.map((em) => (
                  <button
                    key={em}
                    onClick={() => { setInput((prev) => prev + em); setShowEmojiPicker(false); }}
                    className="p-1.5 hover:scale-125 transition cursor-pointer text-base"
                  >
                    {em}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Text Input */}
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())}
            placeholder={`Message ${activeConversation.type === 'group' ? '#' + activeConversation.name : '@' + (activeConversation.handle || activeConversation.name)}...`}
            className="flex-1 px-4 py-3 rounded-2xl bg-white/[0.04] border border-white/10 text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:border-cyan-500/50"
          />

          {/* Send Button */}
          <button
            type="button"
            onClick={handleSend}
            disabled={!input.trim() && !attachedFile}
            className="p-3 px-5 rounded-2xl bg-white hover:bg-neutral-200 text-black font-mono text-xs font-bold transition shadow-[0_0_20px_rgba(255,255,255,0.2)] disabled:opacity-30 cursor-pointer flex items-center gap-1.5"
          >
            <span>Send</span>
            <Send className="w-3.5 h-3.5 fill-current" />
          </button>
        </div>
      </div>
    </div>
  );
}
