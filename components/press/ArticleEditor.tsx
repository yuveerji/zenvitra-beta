'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  ArrowLeft,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Code,
  Link as LinkIcon,
  Image as ImageIcon,
  Minus,
  Eye,
  Edit3,
  Save,
  Send,
  X,
  Sparkles,
  Check,
  Clock,
  Upload,
  Wand2,
  Palette,
  Type,
  FileText,
  AlertCircle
} from 'lucide-react';
import { useZenPress } from '@/context/ZenPressPlatformContext';
import { PressCategory } from '@/types/press';
import { MediaStudioModal } from '@/components/creator/MediaStudioModal';

const CATEGORIES: PressCategory[] = [
  'MANIFESTO',
  'ARCHITECTURE',
  'UPDATES',
  'EDITORIAL',
  'COMMUNITY',
];

export function ArticleEditor() {
  const {
    editingArticle,
    createArticle,
    updateArticle,
    publishArticle,
    setActiveView,
    setEditingArticle,
  } = useZenPress();

  const isEditing = !!editingArticle;

  const [title, setTitle] = useState(editingArticle?.title || '');
  const [excerpt, setExcerpt] = useState(editingArticle?.excerpt || '');
  const [coverImage, setCoverImage] = useState(editingArticle?.coverImage || '');
  const [isCoverStudioOpen, setIsCoverStudioOpen] = useState(false);
  const [sourceName, setSourceName] = useState(editingArticle?.sourceName || '');
  const [sourceUrl, setSourceUrl] = useState(editingArticle?.sourceUrl || '');
  const [category, setCategory] = useState<PressCategory>(editingArticle?.category || 'EDITORIAL');
  const [tagsInput, setTagsInput] = useState(editingArticle?.tags.join(', ') || '');
  const [isOfficial, setIsOfficial] = useState(editingArticle?.isOfficial || false);
  const [isPreview, setIsPreview] = useState(false);
  const [autoSaved, setAutoSaved] = useState(false);
  const [showSourceError, setShowSourceError] = useState(false);

  const editorRef = useRef<HTMLDivElement>(null);
  const coverFileInputRef = useRef<HTMLInputElement>(null);
  const contentInitializedRef = useRef(false);

  const bodyImageInputRef = useRef<HTMLInputElement>(null);

  const handleCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (loadEvt) => {
        if (loadEvt.target?.result) {
          setCoverImage(loadEvt.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBodyImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (loadEvt) => {
        if (loadEvt.target?.result) {
          execCmd('insertImage', loadEvt.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Set initial content
  useEffect(() => {
    if (editorRef.current && !contentInitializedRef.current) {
      if (editingArticle?.content) {
        editorRef.current.innerHTML = editingArticle.content;
      }
      contentInitializedRef.current = true;
    }
  }, [editingArticle]);

  // Execute formatting command
  const execCmd = (command: string, value: string | undefined = undefined) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
  };

  // Get current HTML from editor
  const getContent = useCallback(() => {
    return editorRef.current?.innerHTML || '';
  }, []);

  // Compute word count & reading time
  const [wordCount, setWordCount] = useState(0);
  const [readTime, setReadTime] = useState(1);

  const updateStats = () => {
    const text = editorRef.current?.innerText || '';
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    setWordCount(words);
    setReadTime(Math.max(1, Math.ceil(words / 200)));
  };

  // Auto-save debounced
  useEffect(() => {
    const timer = setTimeout(() => {
      if (title.trim()) {
        setAutoSaved(true);
        setTimeout(() => setAutoSaved(false), 2000);
      }
    }, 3000);
    return () => clearTimeout(timer);
  }, [title, excerpt, tagsInput, sourceName, sourceUrl]);

  const isFormValid = title.trim() && sourceName.trim() && sourceUrl.trim();

  const buildArticleData = (status: 'draft' | 'published') => {
    const tags = tagsInput
      .split(',')
      .map((t: string) => t.trim())
      .filter(Boolean);
    return {
      title: title.trim(),
      content: getContent(),
      excerpt: excerpt.trim(),
      coverImage: coverImage.trim() || undefined,
      sourceName: sourceName.trim(),
      sourceUrl: sourceUrl.trim(),
      category,
      tags,
      isOfficial,
      status,
    };
  };

  const handleSaveDraft = () => {
    if (!title.trim()) return;
    if (!sourceName.trim() || !sourceUrl.trim()) {
      setShowSourceError(true);
      return;
    }
    setShowSourceError(false);
    const data = buildArticleData('draft');
    if (isEditing && editingArticle) {
      updateArticle(editingArticle.id, data);
    } else {
      createArticle(data);
    }
    setEditingArticle(null);
    setActiveView('my-articles');
  };

  const handlePublish = () => {
    if (!title.trim()) return;
    if (!sourceName.trim() || !sourceUrl.trim()) {
      setShowSourceError(true);
      return;
    }
    setShowSourceError(false);
    const data = buildArticleData('published');
    if (isEditing && editingArticle) {
      updateArticle(editingArticle.id, data);
      publishArticle(editingArticle.id);
    } else {
      const id = createArticle(data);
      publishArticle(id);
    }
    setEditingArticle(null);
    setActiveView('feed');
  };

  const handleClose = () => {
    setEditingArticle(null);
    setActiveView('feed');
  };

  return (
    <div className="max-w-4xl mx-auto font-sans pb-24 space-y-6">
      {/* Top Action Bar */}
      <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
        <button
          onClick={handleClose}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-xs font-mono text-neutral-300 hover:text-white hover:bg-white/10 transition cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Exit Editor</span>
        </button>

        <div className="flex items-center gap-2">
          {autoSaved && (
            <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
              <Check className="w-3 h-3" />
              Auto-saved
            </span>
          )}

          {/* Preview Toggle */}
          <button
            type="button"
            onClick={() => setIsPreview(!isPreview)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-mono transition cursor-pointer border ${
              isPreview
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                : 'bg-white/[0.04] text-neutral-300 border-white/10 hover:text-white hover:bg-white/10'
            }`}
          >
            {isPreview ? <Edit3 className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            <span>{isPreview ? 'Edit Mode' : 'Preview Mode'}</span>
          </button>

          {/* Save Draft */}
          <button
            type="button"
            onClick={handleSaveDraft}
            disabled={!title.trim()}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/[0.06] hover:bg-white/10 border border-white/15 text-white font-mono text-xs font-semibold transition disabled:opacity-40 cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Draft</span>
          </button>

          {/* Publish */}
          <button
            type="button"
            onClick={handlePublish}
            disabled={!isFormValid}
            className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-white hover:bg-neutral-200 text-black font-display font-bold text-xs uppercase tracking-wider transition disabled:opacity-40 cursor-pointer"
          >
            <Send className="w-3.5 h-3.5 fill-current" />
            <span>Publish Wire</span>
          </button>
        </div>
      </div>

      {/* Compulsory Source Validation Warning */}
      {showSourceError && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-mono flex items-center justify-between animate-in fade-in duration-200">
          <span>⚠️ Source Name &amp; Citation URL are <strong>COMPULSORY</strong> for all press dispatches.</span>
          <button type="button" onClick={() => setShowSourceError(false)} className="text-rose-400 hover:text-white">✕</button>
        </div>
      )}

      {/* Metadata Configuration Box */}
      <div className="rounded-3xl p-6 sm:p-8 card-luxury border border-white/10 space-y-5">
        {/* Title Input */}
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Dispatch Title..."
          className="w-full bg-transparent text-2xl sm:text-4xl font-display font-bold text-white placeholder:text-neutral-600 focus:outline-none leading-tight"
        />

        {/* Excerpt */}
        <input
          type="text"
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          placeholder="Sub-headline or brief synopsis of your argument..."
          className="w-full bg-transparent text-sm sm:text-base font-serif italic text-neutral-300 placeholder:text-neutral-600 focus:outline-none border-l-2 border-cyan-400 pl-3"
        />

        {/* COMPULSORY SOURCE ROW */}
        <div className="p-4 rounded-2xl bg-cyan-500/[0.04] border border-cyan-500/20 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              Verified Source &amp; Evidence Citation (COMPULSORY)
            </span>
            <span className="text-[10px] font-mono text-cyan-400/80 bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-500/30">
              Required for Verification
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="block text-[10px] font-mono font-semibold text-neutral-400">
                SOURCE / PUBLISHER NAME *
              </label>
              <input
                type="text"
                required
                value={sourceName}
                onChange={(e) => {
                  setSourceName(e.target.value);
                  if (showSourceError && e.target.value.trim() && sourceUrl.trim()) setShowSourceError(false);
                }}
                placeholder="e.g. UN Press Wire, Reuters, Government Gazette"
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/15 text-xs font-mono text-white placeholder:text-neutral-600 focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-[10px] font-mono font-semibold text-neutral-400">
                SOURCE / EVIDENCE URL *
              </label>
              <input
                type="url"
                required
                value={sourceUrl}
                onChange={(e) => {
                  setSourceUrl(e.target.value);
                  if (showSourceError && sourceName.trim() && e.target.value.trim()) setShowSourceError(false);
                }}
                placeholder="https://official-source.org/dispatch"
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/15 text-xs font-mono text-white placeholder:text-neutral-600 focus:outline-none focus:border-cyan-400"
              />
            </div>
          </div>
        </div>

        {/* Category + Cover Image + Tags Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-white/[0.06]">
          {/* Category */}
          <div className="space-y-1.5">
            <label className="block text-[10px] font-mono font-semibold text-neutral-400">CATEGORY</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as PressCategory)}
              className="w-full px-3 py-2 rounded-xl bg-[#080a10] border border-white/10 text-xs font-mono text-white focus:outline-none focus:border-cyan-500/50"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Cover Image Upload & Studio */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-[10px] font-mono font-semibold text-neutral-400">COVER IMAGE &amp; FX</label>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => coverFileInputRef.current?.click()}
                  className="px-2 py-0.5 rounded-lg bg-cyan-500/20 text-cyan-300 text-[10px] font-mono flex items-center gap-1 cursor-pointer"
                  title="Upload from computer"
                >
                  <Upload className="w-3 h-3" />
                  <span>Upload</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsCoverStudioOpen(true)}
                  className="px-2 py-0.5 rounded-lg bg-purple-500/20 text-purple-300 text-[10px] font-mono flex items-center gap-1 cursor-pointer"
                  title="Open visual filters & typography studio"
                >
                  <Wand2 className="w-3 h-3" />
                  <span>FX</span>
                </button>
              </div>
            </div>

            <input
              ref={coverFileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleCoverUpload}
            />

            <input
              type="text"
              value={coverImage}
              onChange={(e) => setCoverImage(e.target.value)}
              placeholder="Paste image URL or click Upload/FX..."
              className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-xs font-mono text-white placeholder:text-neutral-600 focus:outline-none focus:border-cyan-500/50"
            />
          </div>

          {/* Tags */}
          <div className="space-y-1.5">
            <label className="block text-[10px] font-mono font-semibold text-neutral-400">TAGS</label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="diplomacy, governance, youth"
              className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-xs font-mono text-white placeholder:text-neutral-600 focus:outline-none focus:border-cyan-500/50"
            />
          </div>
        </div>
      </div>

      {/* Editor Main Section */}
      <div className="rounded-3xl card-luxury border border-white/10 overflow-hidden shadow-2xl">
        {/* Floating / Docked Toolbar */}
        {!isPreview && (
          <div className="sticky top-0 z-20 p-2.5 bg-[#080a12]/95 backdrop-blur-xl border-b border-white/10 flex flex-wrap items-center gap-1">
            <button type="button" onClick={() => execCmd('bold')} className="p-2 rounded-xl hover:bg-white/10 text-neutral-300 hover:text-white" title="Bold"><Bold className="w-3.5 h-3.5" /></button>
            <button type="button" onClick={() => execCmd('italic')} className="p-2 rounded-xl hover:bg-white/10 text-neutral-300 hover:text-white" title="Italic"><Italic className="w-3.5 h-3.5" /></button>
            <button type="button" onClick={() => execCmd('underline')} className="p-2 rounded-xl hover:bg-white/10 text-neutral-300 hover:text-white" title="Underline"><Underline className="w-3.5 h-3.5" /></button>
            <button type="button" onClick={() => execCmd('strikeThrough')} className="p-2 rounded-xl hover:bg-white/10 text-neutral-300 hover:text-white" title="Strikethrough"><Strikethrough className="w-3.5 h-3.5" /></button>

            <div className="w-[1px] h-5 bg-white/10 mx-1" />

            <button type="button" onClick={() => execCmd('formatBlock', '<h1>')} className="p-2 rounded-xl hover:bg-white/10 text-neutral-300 hover:text-white font-bold text-xs" title="H1">H1</button>
            <button type="button" onClick={() => execCmd('formatBlock', '<h2>')} className="p-2 rounded-xl hover:bg-white/10 text-neutral-300 hover:text-white font-bold text-xs" title="H2">H2</button>
            <button type="button" onClick={() => execCmd('formatBlock', '<h3>')} className="p-2 rounded-xl hover:bg-white/10 text-neutral-300 hover:text-white font-bold text-xs" title="H3">H3</button>

            <div className="w-[1px] h-5 bg-white/10 mx-1" />

            <button type="button" onClick={() => execCmd('insertUnorderedList')} className="p-2 rounded-xl hover:bg-white/10 text-neutral-300 hover:text-white" title="Bullet List"><List className="w-3.5 h-3.5" /></button>
            <button type="button" onClick={() => execCmd('insertOrderedList')} className="p-2 rounded-xl hover:bg-white/10 text-neutral-300 hover:text-white" title="Numbered List"><ListOrdered className="w-3.5 h-3.5" /></button>
            <button type="button" onClick={() => execCmd('formatBlock', '<blockquote>')} className="p-2 rounded-xl hover:bg-white/10 text-neutral-300 hover:text-white" title="Quote"><Quote className="w-3.5 h-3.5" /></button>
            <button type="button" onClick={() => execCmd('formatBlock', '<pre>')} className="p-2 rounded-xl hover:bg-white/10 text-neutral-300 hover:text-white" title="Code Block"><Code className="w-3.5 h-3.5" /></button>
            <button type="button" onClick={() => execCmd('insertHorizontalRule')} className="p-2 rounded-xl hover:bg-white/10 text-neutral-300 hover:text-white" title="Divider"><Minus className="w-3.5 h-3.5" /></button>

            <div className="w-[1px] h-5 bg-white/10 mx-1" />

            {/* Custom Callout Box Inserters */}
            <button
              type="button"
              onClick={() => {
                const calloutHtml = `<div style="padding: 16px; border-radius: 16px; background: rgba(56, 189, 248, 0.08); border-left: 4px solid #38bdf8; margin: 16px 0;"><strong>💡 Key Policy Finding:</strong> Type policy detail here...</div><p><br></p>`;
                execCmd('insertHTML', calloutHtml);
              }}
              className="px-2.5 py-1 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-[10px] font-mono flex items-center gap-1 cursor-pointer"
              title="Insert Key Finding Box"
            >
              <Sparkles className="w-3 h-3" />
              <span>Callout</span>
            </button>

            <button
              type="button"
              onClick={() => {
                const alertHtml = `<div style="padding: 16px; border-radius: 16px; background: rgba(244, 63, 94, 0.08); border-left: 4px solid #f43f5e; margin: 16px 0;"><strong>🚨 Critical Evidence Note:</strong> Document citation and methodology...</div><p><br></p>`;
                execCmd('insertHTML', alertHtml);
              }}
              className="px-2.5 py-1 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[10px] font-mono flex items-center gap-1 cursor-pointer"
              title="Insert Evidence Note"
            >
              <AlertCircle className="w-3 h-3" />
              <span>Evidence</span>
            </button>

            <div className="w-[1px] h-5 bg-white/10 mx-1" />

            <button
              type="button"
              onClick={() => {
                const url = prompt('Enter URL:');
                if (url) execCmd('createLink', url);
              }}
              className="p-2 rounded-xl hover:bg-white/10 text-neutral-300 hover:text-white"
              title="Link"
            >
              <LinkIcon className="w-3.5 h-3.5" />
            </button>

            <input
              ref={bodyImageInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleBodyImageUpload}
            />

            <button
              type="button"
              onClick={() => {
                const choice = confirm('Click OK to upload an image from your device, or Cancel to paste an image URL.');
                if (choice) {
                  bodyImageInputRef.current?.click();
                } else {
                  const url = prompt('Enter image URL:');
                  if (url) execCmd('insertImage', url);
                }
              }}
              className="p-2 rounded-xl hover:bg-white/10 text-neutral-300 hover:text-white cursor-pointer"
              title="Insert Image (Upload File or Paste URL)"
            >
              <ImageIcon className="w-3.5 h-3.5" />
            </button>

            {/* Stats Right */}
            <div className="ml-auto flex items-center gap-3 text-[10px] font-mono text-neutral-400 pr-2">
              <span>{wordCount} words</span>
              <span>•</span>
              <span>{readTime} min read</span>
            </div>
          </div>
        )}

        {/* Content View */}
        <div className="p-6 sm:p-10 min-h-[420px]">
          {isPreview ? (
            <div
              className="zen-article-content text-base font-sans text-neutral-200 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: getContent() }}
            />
          ) : (
            <div
              ref={editorRef}
              contentEditable
              onInput={updateStats}
              data-placeholder="Begin drafting your dispatch, investigation, or manifesto..."
              className="zen-editor text-base font-sans text-neutral-200 leading-relaxed focus:outline-none min-h-[380px]"
            />
          )}
        </div>
      </div>

      {/* ─── COVER MEDIA FX STUDIO MODAL ─── */}
      <MediaStudioModal
        isOpen={isCoverStudioOpen}
        onClose={() => setIsCoverStudioOpen(false)}
        initialImage={coverImage || ''}
        onApply={(processedUrl) => {
          setCoverImage(processedUrl);
        }}
        aspectRatio="16:9"
      />
    </div>
  );
}
