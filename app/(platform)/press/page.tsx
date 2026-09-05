'use client';

import React from 'react';
import {
  Rss,
  FileText,
  Bookmark,
  PenLine,
  Sparkles
} from 'lucide-react';
import { useZenPress } from '@/context/ZenPressPlatformContext';
import { useAuth } from '@/context/AuthContext';
import { isFounder } from '@/lib/founderControl';
import { PressFeed } from '@/components/press/PressFeed';
import { ArticleReader } from '@/components/press/ArticleReader';
import { ArticleEditor } from '@/components/press/ArticleEditor';
import { FounderPressStudio } from '@/components/founder/FounderPressStudio';
import { BookmarksList } from '@/components/press/BookmarksList';
import { MyArticles } from '@/components/press/MyArticles';
import { PressView } from '@/types/press';
import { Crown } from 'lucide-react';

function PressNavBar() {
  const { activeView, setActiveView, setEditingArticleId, currentUserUsername } = useZenPress();
  const { user, profile } = useAuth();
  const effectiveUsername = (currentUserUsername || profile?.username || user?.email?.split('@')[0] || '').toLowerCase().replace(/^@/, '');
  const isFounderUser = isFounder(effectiveUsername, (profile?.role as any) || (profile as any)?.badge);

  const navItems: { view: PressView; label: string; icon: React.ReactNode }[] = [
    { view: 'feed', label: 'Wire Feed', icon: <Rss className="w-3.5 h-3.5" /> },
    { view: 'my-articles', label: 'Author Desk', icon: <FileText className="w-3.5 h-3.5" /> },
    { view: 'bookmarks', label: 'Saved', icon: <Bookmark className="w-3.5 h-3.5" /> },
  ];

  return (
    <div className="flex items-center justify-between gap-3 mb-6 pb-4 border-b border-white/[0.08]">
      <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-white/[0.03] border border-white/10 font-mono text-xs shadow-inner">
        {navItems.map((item) => (
          <button
            key={item.view}
            onClick={() => setActiveView(item.view)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl transition cursor-pointer font-semibold ${
              activeView === item.view ||
              (item.view === 'feed' && activeView === 'article')
                ? 'bg-white text-black shadow-md'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            {item.icon}
            <span>{item.label}</span>
          </button>
        ))}
      </div>

      <button
        onClick={() => {
          setEditingArticleId(null);
          setActiveView('editor');
        }}
        className={`flex items-center gap-2 px-5 py-2 rounded-xl font-mono text-xs font-bold transition cursor-pointer shadow-md ${
          isFounderUser
            ? 'bg-amber-400 hover:bg-amber-300 text-black shadow-[0_0_15px_rgba(251,191,36,0.3)]'
            : 'bg-white text-black hover:bg-neutral-200'
        }`}
      >
        {isFounderUser ? <Crown className="w-3.5 h-3.5 fill-black" /> : <PenLine className="w-3.5 h-3.5" />}
        <span className="hidden sm:inline">{isFounderUser ? 'Founder Press Studio' : 'Draft Dispatch'}</span>
      </button>
    </div>
  );
}

export default function PressPage() {
  const { activeView, currentUserUsername } = useZenPress();
  const { user, profile } = useAuth();
  const effectiveUsername = (currentUserUsername || profile?.username || user?.email?.split('@')[0] || '').toLowerCase().replace(/^@/, '');
  const isFounderUser = isFounder(effectiveUsername, (profile?.role as any) || (profile as any)?.badge);

  return (
    <div className="w-full">
      <PressNavBar />
      {activeView === 'feed' && <PressFeed />}
      {activeView === 'article' && <ArticleReader />}
      {activeView === 'editor' && (isFounderUser ? <FounderPressStudio /> : <ArticleEditor />)}
      {activeView === 'bookmarks' && <BookmarksList />}
      {activeView === 'my-articles' && <MyArticles />}
    </div>
  );
}