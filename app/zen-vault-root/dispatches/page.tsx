'use client';

import React, { useState } from 'react';
import { Feather, CheckCircle2 } from 'lucide-react';

export default function SovereignDispatchesPage() {
  const [title, setTitle] = useState('');
  const [tag, setTag] = useState('MANIFESTO');
  const [content, setContent] = useState('');
  const [dispatched, setDispatched] = useState(false);

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) return;
    setDispatched(true);
    setTimeout(() => {
      setTitle('');
      setContent('');
      setDispatched(false);
    }, 2000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 font-mono text-[10px] mb-2">
            <Feather className="w-3 h-3" />
            <span>PRESS VAULT CURATION</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-mono text-white tracking-wide uppercase">
            Publish Sovereign Dispatch
          </h1>
          <p className="text-xs text-neutral-400 font-mono mt-1">
            Deploy immutable editorial essays and network decrees to Zenvitra Press.
          </p>
        </div>
      </div>

      {/* Editor Form */}
      <div className="p-8 rounded-3xl border border-white/10 bg-[#06070a]/90 backdrop-blur-xl space-y-6">
        {dispatched ? (
          <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-mono text-xs flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5" />
            <span>Dispatch successfully hashed and published to Zenvitra Press archive.</span>
          </div>
        ) : (
          <form onSubmit={handlePublish} className="space-y-4 font-mono text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2 space-y-1.5">
                <label className="text-neutral-400">Dispatch Headline</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. The Architecture of Cryptographic Sovereignty"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/10 focus:border-white/40 focus:outline-none text-white text-xs placeholder:text-neutral-600"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-neutral-400">Classification Tag</label>
                <select
                  value={tag}
                  onChange={(e) => setTag(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-[#06070a] border border-white/10 focus:border-white/40 focus:outline-none text-white text-xs"
                >
                  <option value="MANIFESTO">MANIFESTO</option>
                  <option value="PROTOCOL_UPDATE">PROTOCOL UPDATE</option>
                  <option value="CIVIC_GRANT">CIVIC GRANT</option>
                  <option value="DIPLOMATIC_CABLE">DIPLOMATIC CABLE</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-neutral-400">Content (Markdown Supported)</label>
              <textarea
                required
                rows={10}
                placeholder="Write your sovereign dispatch in full Markdown syntax..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full p-4 rounded-xl bg-white/[0.03] border border-white/10 focus:border-white/40 focus:outline-none text-white text-xs placeholder:text-neutral-600 leading-relaxed font-mono"
              />
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-rose-500 hover:bg-rose-400 text-white font-bold transition flex items-center gap-2 cursor-pointer shadow-lg shadow-rose-500/20"
              >
                <span>Deploy to Live Press Archive &rarr;</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
