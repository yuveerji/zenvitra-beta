'use client';

import React, { useState } from 'react';
import { 
  X, 
  UserPlus, 
  Users, 
  ArrowRight, 
  Hash, 
  AtSign
} from 'lucide-react';
import { useZenChat } from '@/context/ZenChatPlatformContext';

export function CreateChatModal() {
  const { 
    isCreateModalOpen, 
    setIsCreateModalOpen, 
    createDirectMessage, 
    createGroup 
  } = useZenChat();

  const [tab, setTab] = useState<'dm' | 'group'>('dm');
  
  // DM State
  const [handle, setHandle] = useState('');
  const [contactName, setContactName] = useState('');

  // Group State
  const [groupName, setGroupName] = useState('');
  const [groupTopic, setGroupTopic] = useState('');
  const [memberTags, setMemberTags] = useState('');

  if (!isCreateModalOpen) return null;

  const handleCreateDm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!handle.trim()) return;
    createDirectMessage(handle.trim(), contactName.trim() || undefined);
    setHandle('');
    setContactName('');
  };

  const handleCreateGroup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!groupName.trim()) return;
    const members = memberTags
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    createGroup(groupName.trim(), groupTopic.trim() || undefined, members);
    setGroupName('');
    setGroupTopic('');
    setMemberTags('');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md p-3 sm:p-6 flex flex-col justify-start sm:justify-center items-center select-none font-sans">
      <div className="relative w-full max-w-md rounded-3xl bg-[#08090d] border border-white/15 p-6 sm:p-8 space-y-6 shadow-2xl my-auto max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="space-y-0.5">
            <h3 className="font-display font-medium text-xl text-white">
              {tab === 'dm' ? 'New Direct Message' : 'Create Group Channel'}
            </h3>
            <p className="font-mono text-[11px] text-neutral-400">
              {tab === 'dm' ? 'Start a 1-to-1 encrypted conversation' : 'Assemble a team or delegation channel'}
            </p>
          </div>
          <button
            onClick={() => setIsCreateModalOpen(false)}
            className="p-1.5 rounded-xl text-neutral-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex p-1 rounded-2xl bg-white/[0.03] border border-white/5 font-mono text-xs">
          <button
            type="button"
            onClick={() => setTab('dm')}
            className={`flex-1 py-2 rounded-xl transition flex items-center justify-center gap-2 ${
              tab === 'dm'
                ? 'bg-white text-black font-bold shadow-md'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Direct Message</span>
          </button>
          <button
            type="button"
            onClick={() => setTab('group')}
            className={`flex-1 py-2 rounded-xl transition flex items-center justify-center gap-2 ${
              tab === 'group'
                ? 'bg-white text-black font-bold shadow-md'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Group Channel</span>
          </button>
        </div>

        {/* Form Body */}
        {tab === 'dm' ? (
          <form onSubmit={handleCreateDm} className="space-y-4">
            <div className="space-y-1.5">
              <label className="font-mono text-[11px] text-neutral-300 block">
                Username or Handle:
              </label>
              <div className="relative">
                <AtSign className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
                <input
                  type="text"
                  placeholder="e.g. aarav.dev or aditi.sharma"
                  value={handle}
                  onChange={(e) => setHandle(e.target.value)}
                  required
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-xs font-mono text-white placeholder:text-neutral-600 focus:border-white/40 focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="font-mono text-[11px] text-neutral-300 block">
                Display Name (Optional):
              </label>
              <input
                type="text"
                placeholder="e.g. Aarav Singhania"
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-xs font-mono text-white placeholder:text-neutral-600 focus:border-white/40 focus:outline-none"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={!handle.trim()}
                className="w-full py-3 rounded-2xl bg-white text-black font-mono text-xs font-bold hover:bg-neutral-200 transition flex items-center justify-center gap-2 cursor-pointer shadow-lg disabled:opacity-50"
              >
                <span>Start Conversation</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleCreateGroup} className="space-y-4">
            <div className="space-y-1.5">
              <label className="font-mono text-[11px] text-neutral-300 block">
                Group Name:
              </label>
              <div className="relative">
                <Hash className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
                <input
                  type="text"
                  placeholder="e.g. Youth Diplomacy Steering Committee"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  required
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-xs font-mono text-white placeholder:text-neutral-600 focus:border-white/40 focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="font-mono text-[11px] text-neutral-300 block">
                Topic / Purpose (Optional):
              </label>
              <input
                type="text"
                placeholder="e.g. Drafting resolutions and country matrices"
                value={groupTopic}
                onChange={(e) => setGroupTopic(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-xs font-mono text-white placeholder:text-neutral-600 focus:border-white/40 focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-mono text-[11px] text-neutral-300 block">
                Add Members (Comma separated):
              </label>
              <input
                type="text"
                placeholder="e.g. Aditi Sharma, Kabir Mehta"
                value={memberTags}
                onChange={(e) => setMemberTags(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-xs font-mono text-white placeholder:text-neutral-600 focus:border-white/40 focus:outline-none"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={!groupName.trim()}
                className="w-full py-3 rounded-2xl bg-white text-black font-mono text-xs font-bold hover:bg-neutral-200 transition flex items-center justify-center gap-2 cursor-pointer shadow-lg disabled:opacity-50"
              >
                <span>Create Group Channel</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
