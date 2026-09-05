'use client';

import React, { useState } from 'react';
import {
  FileText,
  Pencil,
  Trash2,
  Send,
  Clock,
  Eye,
  Plus,
  Sparkles,
  ArrowUp
} from 'lucide-react';
import { useZenPress } from '@/context/ZenPressPlatformContext';

export function MyArticles() {
  const {
    myDrafts,
    myPublished,
    deleteArticle,
    publishArticle,
    setActiveView,
    setEditingArticleId,
    setActiveArticleId,
  } = useZenPress();

  const [tab, setTab] = useState<'published' | 'drafts'>('published');

  const items = tab === 'published' ? myPublished : myDrafts;

  const handleEdit = (id: string) => {
    setEditingArticleId(id);
    setActiveView('editor');
  };

  const handleView = (id: string) => {
    setActiveArticleId(id);
    setActiveView('article');
  };

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });

  return (
    <div className="max-w-4xl mx-auto space-y-6 font-sans pb-16">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center shadow-md">
            <FileText className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <h2 className="font-display font-bold text-xl text-white">Author Desk</h2>
            <p className="font-mono text-xs text-neutral-400">
              {myPublished.length} published · {myDrafts.length} draft{myDrafts.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            setEditingArticleId(null);
            setActiveView('editor');
          }}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-white hover:bg-neutral-200 text-black font-display font-bold text-xs uppercase tracking-wider transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Dispatch</span>
        </button>
      </div>

      {/* Tab Switcher */}
      <div className="flex p-1 rounded-2xl bg-white/[0.03] border border-white/10 font-mono text-xs max-w-md">
        <button
          type="button"
          onClick={() => setTab('published')}
          className={`flex-1 py-2 rounded-xl transition cursor-pointer font-semibold ${
            tab === 'published'
              ? 'bg-white text-black shadow-md'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          Published Dispatches ({myPublished.length})
        </button>
        <button
          type="button"
          onClick={() => setTab('drafts')}
          className={`flex-1 py-2 rounded-xl transition cursor-pointer font-semibold ${
            tab === 'drafts'
              ? 'bg-white text-black shadow-md'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          Working Drafts ({myDrafts.length})
        </button>
      </div>

      {/* List */}
      {items.length === 0 ? (
        <div className="rounded-3xl p-16 text-center card-luxury border border-white/[0.08] space-y-4">
          <div className="w-16 h-16 rounded-3xl bg-white/[0.04] border border-white/10 flex items-center justify-center mx-auto shadow-inner">
            <FileText className="w-8 h-8 text-neutral-500" />
          </div>
          <div>
            <h3 className="font-display font-bold text-lg text-white">
              {tab === 'published' ? 'No published dispatches' : 'No working drafts'}
            </h3>
            <p className="text-xs font-mono text-neutral-400 max-w-sm mx-auto mt-1">
              {tab === 'published'
                ? 'Draft and publish your first article to share your analysis with the network.'
                : 'Start a new dispatch and save your thoughts as a draft.'}
            </p>
          </div>
          <button
            onClick={() => {
              setEditingArticleId(null);
              setActiveView('editor');
            }}
            className="px-5 py-2.5 rounded-2xl bg-white hover:bg-neutral-200 text-black font-display font-bold text-xs uppercase tracking-wider transition shadow-lg cursor-pointer"
          >
            Open Editor Desk
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((article) => (
            <div
              key={article.id}
              className="group flex flex-col sm:flex-row sm:items-center justify-between p-5 rounded-3xl card-luxury border border-white/[0.08] hover:border-white/20 transition gap-4"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="px-2 py-0.5 rounded-full bg-white/[0.06] text-[10px] font-mono text-cyan-300 font-semibold uppercase">
                    {article.category}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-mono uppercase font-bold ${
                      article.status === 'published'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                        : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                    }`}
                  >
                    {article.status}
                  </span>
                </div>
                <h3 className="text-base font-display font-bold text-white truncate">
                  {article.title || 'Untitled Dispatch'}
                </h3>
                <div className="flex items-center gap-3 mt-1.5 text-xs font-mono text-neutral-400">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-neutral-500" />
                    {formatDate(article.updatedAt)}
                  </span>
                  <span>·</span>
                  <span>{article.readingTimeMinutes} min read</span>
                  {article.status === 'published' && (
                    <>
                      <span>·</span>
                      <span className="text-emerald-400 flex items-center gap-1">
                        <ArrowUp className="w-3.5 h-3.5" />
                        {article.upvotes} upvotes
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 shrink-0">
                {article.status === 'published' && (
                  <button
                    onClick={() => handleView(article.id)}
                    className="p-2.5 rounded-xl bg-white/[0.04] hover:bg-white/10 text-neutral-300 hover:text-white transition cursor-pointer"
                    title="View Dispatch"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={() => handleEdit(article.id)}
                  className="p-2.5 rounded-xl bg-white/[0.04] hover:bg-cyan-500/15 border border-white/10 text-neutral-300 hover:text-cyan-300 transition cursor-pointer flex items-center gap-1.5 font-mono text-xs"
                  title="Edit"
                >
                  <Pencil className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>
                {article.status === 'draft' && (
                  <button
                    onClick={() => publishArticle(article.id)}
                    className="p-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/25 transition cursor-pointer flex items-center gap-1.5 font-mono text-xs font-bold"
                    title="Publish Wire"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Publish</span>
                  </button>
                )}
                <button
                  onClick={() => deleteArticle(article.id)}
                  className="p-2.5 rounded-xl bg-white/[0.04] hover:bg-rose-500/15 text-neutral-400 hover:text-rose-400 transition cursor-pointer"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
