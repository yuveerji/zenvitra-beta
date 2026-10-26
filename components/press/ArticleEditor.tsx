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
  AlertCircle,
  Plus,
  Trash2,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useZenPress } from '@/context/ZenPressPlatformContext';
import { PressCategory } from '@/types/press';
import { MediaStudioModal } from '@/components/creator/MediaStudioModal';
import { DesktopModeAdvisory } from '@/components/common/DesktopModeAdvisory';
import { PressDraftPreviewModal } from './PressDraftPreviewModal';

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
    currentUserName,
    currentUserUsername,
  } = useZenPress();

  const isEditing = !!editingArticle;

  const [title, setTitle] = useState(editingArticle?.title || '');
  const [excerpt, setExcerpt] = useState(editingArticle?.excerpt || '');
  const [coverImage, setCoverImage] = useState(editingArticle?.coverImage || '');
  const [galleryImages, setGalleryImages] = useState<string[]>(
    editingArticle?.images && editingArticle.images.length > 0
      ? editingArticle.images
      : (editingArticle?.coverImage ? [editingArticle.coverImage] : [])
  );
  const [showFinalDraftModal, setShowFinalDraftModal] = useState(false);
  const multiFileInputRef = useRef<HTMLInputElement>(null);

  const moveGalleryImage = (fromIdx: number, toIdx: number) => {
    if (toIdx < 0 || toIdx >= galleryImages.length) return;
    setGalleryImages((prev) => {
      const copy = [...prev];
      const [moved] = copy.splice(fromIdx, 1);
      copy.splice(toIdx, 0, moved);
      if (toIdx === 0 || fromIdx === 0) {
        setCoverImage(copy[0] || '');
      }
      return copy;
    });
  };

  const removeGalleryImage = (idx: number) => {
    setGalleryImages((prev) => {
      const next = prev.filter((_, i) => i !== idx);
      setCoverImage(next[0] || '');
      return next;
    });
  };

  const handleMultiPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    Array.from(files).forEach((file) => {
      if (!file.type.startsWith('image/')) return;
      const reader = new FileReader();
      reader.onload = (loadEvt) => {
        if (loadEvt.target?.result) {
          const url = loadEvt.target.result as string;
          setGalleryImages((prev) => {
            const next = [...prev, url];
            if (!coverImage) setCoverImage(url);
            return next;
          });
        }
      };
      reader.readAsDataURL(file);
    });
  };
  const [isCoverStudioOpen, setIsCoverStudioOpen] = useState(false);
  const [sourceName, setSourceName] = useState(editingArticle?.sourceName || '');
  const [sourceUrl, setSourceUrl] = useState(editingArticle?.sourceUrl || '');
  const [sources, setSources] = useState<{ id: string; name: string; url: string; label: string; domain?: string }[]>(
    editingArticle?.sources && editingArticle.sources.length > 0
      ? editingArticle.sources
      : [
          {
            id: 'src_1',
            name: editingArticle?.sourceName || '',
            url: editingArticle?.sourceUrl || '',
            label: 'Source #1'
          }
        ]
  );

  const handleAddSource = () => {
    setSources((prev) => [
      ...prev,
      {
        id: `src_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        name: '',
        url: '',
        label: `Source #${prev.length + 1}`
      }
    ]);
  };

  const handleUpdateSource = (id: string, field: 'name' | 'url', val: string) => {
    setSources((prev) => {
      const updated = prev.map((s) => s.id === id ? { ...s, [field]: val } : s);
      if (updated[0]) {
        if (field === 'name') setSourceName(updated[0].name);
        if (field === 'url') setSourceUrl(updated[0].url);
      }
      return updated;
    });
    if (showSourceError && val.trim()) {
      setShowSourceError(false);
    }
  };

  const handleRemoveSource = (id: string) => {
    setSources((prev) => {
      if (prev.length <= 1) {
        const reset = [{ id: `src_${Date.now()}`, name: '', url: '', label: 'Source #1' }];
        setSourceName('');
        setSourceUrl('');
        return reset;
      }
      const filtered = prev.filter((s) => s.id !== id);
      if (filtered[0]) {
        setSourceName(filtered[0].name);
        setSourceUrl(filtered[0].url);
      }
      return filtered;
    });
  };
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
  const savedRangeRef = useRef<Range | null>(null);

  const saveSelection = () => {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      savedRangeRef.current = sel.getRangeAt(0).cloneRange();
    }
  };

  const insertInlineFigure = (url: string, caption?: string) => {
    editorRef.current?.focus();
    const sel = window.getSelection();
    if (savedRangeRef.current && sel) {
      sel.removeAllRanges();
      sel.addRange(savedRangeRef.current);
    }

    const safeCaption = caption ? caption.trim() : '';
    const figureHtml = `<figure class="zen-inline-image my-6 text-center select-none" contenteditable="false"><img src="${url}" alt="${safeCaption}" class="max-w-full rounded-2xl mx-auto border border-white/15 shadow-xl object-cover" style="max-height: 520px;" />${safeCaption ? `<figcaption class="text-xs font-mono text-neutral-400 mt-2 text-center">${safeCaption}</figcaption>` : ''}</figure><p><br></p>`;

    document.execCommand('insertHTML', false, figureHtml);
    updateStats();
  };

  const handleCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (loadEvt) => {
        if (loadEvt.target?.result) {
          const url = loadEvt.target.result as string;
          setCoverImage(url);
          setGalleryImages((prev) => (prev.includes(url) ? prev : [url, ...prev]));
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
          const cleanName = file.name.replace(/\.[^/.]+$/, '');
          insertInlineFigure(loadEvt.target.result as string, cleanName);
        }
      };
      reader.readAsDataURL(file);
    }
    e.target.value = '';
  };

  const handleInsertImageUrl = () => {
    saveSelection();
    const url = prompt('Enter image URL to insert between paragraphs:');
    if (!url || !url.trim()) return;
    const caption = prompt('Optional image caption:');
    insertInlineFigure(url.trim(), caption || undefined);
  };

  const handleEditorPaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    const items = e.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.startsWith('image/')) {
        e.preventDefault();
        const file = items[i].getAsFile();
        if (file) {
          const reader = new FileReader();
          reader.onload = (loadEvt) => {
            if (loadEvt.target?.result) {
              insertInlineFigure(loadEvt.target.result as string, 'Pasted Figure');
            }
          };
          reader.readAsDataURL(file);
        }
        return;
      }
    }
  };

  const handleEditorDrop = (e: React.DragEvent<HTMLDivElement>) => {
    const files = e.dataTransfer.files;
    if (files && files.length > 0 && files[0].type.startsWith('image/')) {
      e.preventDefault();
      const file = files[0];
      const reader = new FileReader();
      reader.onload = (loadEvt) => {
        if (loadEvt.target?.result) {
          const cleanName = file.name.replace(/\.[^/.]+$/, '');
          insertInlineFigure(loadEvt.target.result as string, cleanName);
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
  }, [title, excerpt, tagsInput, sourceName, sourceUrl, sources]);

  const validSources = sources
    .map((s) => ({ ...s, name: s.name.trim(), url: s.url.trim() }))
    .filter((s) => s.name || s.url);
  const primarySource = validSources[0] || { name: sourceName.trim(), url: sourceUrl.trim() };
  const isFormValid = Boolean(title.trim() && primarySource.name && primarySource.url);

  const buildArticleData = (status: 'draft' | 'published') => {
    const tags = tagsInput
      .split(',')
      .map((t: string) => t.trim())
      .filter(Boolean);
    return {
      title: title.trim(),
      content: getContent(),
      excerpt: excerpt.trim(),
      coverImage: galleryImages[0] || coverImage.trim() || undefined,
      images: galleryImages.length > 0 ? galleryImages : (coverImage.trim() ? [coverImage.trim()] : undefined),
      sourceName: primarySource.name || sourceName.trim() || 'Zenvitra Sovereign Wire',
      sourceUrl: primarySource.url || sourceUrl.trim() || '/press',
      sources: validSources.length > 0 ? validSources : undefined,
      category,
      tags,
      isOfficial,
      status,
    };
  };

  const handleSaveDraft = () => {
    if (!title.trim()) return;
    const hasValidSource = sources.some((s) => s.name.trim() && s.url.trim()) || (sourceName.trim() && sourceUrl.trim());
    if (!hasValidSource) {
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
    const hasValidSource = sources.some((s) => s.name.trim() && s.url.trim()) || (sourceName.trim() && sourceUrl.trim());
    if (!hasValidSource) {
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
      <DesktopModeAdvisory studioName="Press Article Editor" storageKey="zen_press_editor" />
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

          {/* Check Final Draft Button */}
          <button
            type="button"
            onClick={() => {
              if (!title.trim()) {
                alert('Please enter a dispatch title first.');
                return;
              }
              const hasValidSource = sources.some((s) => s.name.trim() && s.url.trim()) || (sourceName.trim() && sourceUrl.trim());
              if (!hasValidSource) {
                setShowSourceError(true);
                return;
              }
              setShowFinalDraftModal(true);
            }}
            disabled={!title.trim()}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-purple-500/40 bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 font-mono text-xs font-semibold transition cursor-pointer disabled:opacity-40"
            title="Review your rearranged photos, typography, citations, and layout"
          >
            <Eye className="w-3.5 h-3.5 text-purple-400" />
            <span>Check Final Draft</span>
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

        {/* COMPULSORY SOURCES ROW (MULTIPLE SOURCES SUPPORT) */}
        <div className="p-4 rounded-2xl bg-cyan-500/[0.04] border border-cyan-500/20 space-y-3.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              Verified Sources &amp; Evidence Citations ({sources.filter(s => s.name.trim() || s.url.trim()).length} Active)
            </span>
            <span className="text-[10px] font-mono text-cyan-400/80 bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-500/30">
              Compulsory Verification
            </span>
          </div>

          {/* List of Dynamic Sources */}
          <div className="space-y-3">
            {sources.map((src, idx) => (
              <div 
                key={src.id}
                className="p-3.5 rounded-xl bg-black/40 border border-white/10 space-y-2.5 relative group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold text-cyan-400 flex items-center gap-1.5">
                    <span className="w-4 h-4 rounded-full bg-cyan-500/20 flex items-center justify-center text-[9px]">
                      {idx + 1}
                    </span>
                    <span>Citation Source #{idx + 1} {idx === 0 && <span className="text-neutral-500 font-normal">(Primary)</span>}</span>
                  </span>
                  {sources.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveSource(src.id)}
                      className="text-neutral-500 hover:text-rose-400 p-1 rounded-md transition cursor-pointer"
                      title="Remove this citation source"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="block text-[10px] font-mono font-semibold text-neutral-400">
                      SOURCE / PUBLISHER NAME {idx === 0 ? '*' : '(OPTIONAL)'}
                    </label>
                    <input
                      type="text"
                      required={idx === 0}
                      value={src.name}
                      onChange={(e) => handleUpdateSource(src.id, 'name', e.target.value)}
                      placeholder="e.g. UN Press Wire, Reuters, Government Gazette"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/15 text-xs font-mono text-white placeholder:text-neutral-600 focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[10px] font-mono font-semibold text-neutral-400">
                      SOURCE / EVIDENCE URL {idx === 0 ? '*' : '(OPTIONAL)'}
                    </label>
                    <input
                      type="url"
                      required={idx === 0}
                      value={src.url}
                      onChange={(e) => handleUpdateSource(src.id, 'url', e.target.value)}
                      placeholder="https://official-source.org/dispatch"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/15 text-xs font-mono text-white placeholder:text-neutral-600 focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* + Add Another Source Citation Button */}
          <button
            type="button"
            onClick={handleAddSource}
            className="w-full py-2.5 px-4 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 hover:border-cyan-500/50 text-cyan-300 font-mono text-xs flex items-center justify-center gap-2 transition cursor-pointer group"
          >
            <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-200" />
            <span className="font-semibold">+ Add Another Source Citation</span>
          </button>
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

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => coverFileInputRef.current?.click()}
                className="flex-1 py-2 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-white transition cursor-pointer flex items-center justify-center gap-2"
              >
                <Upload className="w-3.5 h-3.5 text-cyan-400" />
                <span>{coverImage ? 'Change Cover' : 'Upload Cover'}</span>
              </button>
              <button
                type="button"
                onClick={() => multiFileInputRef.current?.click()}
                className="px-3 py-2 rounded-xl bg-purple-500/15 hover:bg-purple-500/25 border border-purple-500/30 text-purple-300 text-xs font-mono transition cursor-pointer flex items-center gap-1.5"
                title="Add multiple photos to article gallery"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Photos</span>
              </button>
              <input
                ref={multiFileInputRef}
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                onChange={handleMultiPhotoUpload}
              />
            </div>
          </div>

        {/* MULTI-PHOTO GALLERY & REORDERING STRIP */}
        {galleryImages.length > 0 && (
          <div className="col-span-full pt-3 pb-1 border-t border-white/[0.06] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold text-neutral-300 uppercase tracking-wider flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5 text-purple-400" />
                <span>Article Photo Gallery &amp; Sequence ({galleryImages.length} Photos)</span>
                <span className="text-neutral-500 font-normal">Use arrows to rearrange</span>
              </span>
              <button
                type="button"
                onClick={() => multiFileInputRef.current?.click()}
                className="text-[10px] font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3 h-3" />
                <span>Add More Photos</span>
              </button>
            </div>

            <div className="flex items-center gap-3 overflow-x-auto pb-2 pt-1 no-scrollbar">
              {galleryImages.map((img, idx) => (
                <div
                  key={idx}
                  className="relative group shrink-0 w-28 h-20 rounded-xl overflow-hidden border border-white/20 bg-black/60 shadow-md"
                >
                  <img src={img} alt={`Photo ${idx + 1}`} className="w-full h-full object-cover" />
                  
                  {/* Badge */}
                  <div className="absolute top-1 left-1 px-1.5 py-0.5 rounded bg-black/80 border border-white/20 text-[9px] font-mono font-bold text-white flex items-center gap-0.5">
                    {idx === 0 ? <span className="text-amber-400 font-bold">#1 Cover</span> : <span>#{idx + 1}</span>}
                  </div>

                  {/* Rearrange & Remove Overlay Controls */}
                  <div className="absolute inset-x-0 bottom-0 p-1 bg-gradient-to-t from-black/95 via-black/80 to-transparent flex items-center justify-between gap-1">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => moveGalleryImage(idx, idx - 1)}
                      className="p-1 rounded bg-white/10 hover:bg-cyan-500/40 text-white disabled:opacity-20 cursor-pointer disabled:cursor-not-allowed transition"
                      title="Move photo left"
                    >
                      <ChevronLeft className="w-3 h-3" />
                    </button>

                    <button
                      type="button"
                      onClick={() => removeGalleryImage(idx)}
                      className="p-1 rounded bg-white/10 hover:bg-rose-500/50 text-rose-300 cursor-pointer transition"
                      title="Remove this photo"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>

                    <button
                      type="button"
                      disabled={idx === galleryImages.length - 1}
                      onClick={() => moveGalleryImage(idx, idx + 1)}
                      className="p-1 rounded bg-white/10 hover:bg-cyan-500/40 text-white disabled:opacity-20 cursor-pointer disabled:cursor-not-allowed transition"
                      title="Move photo right"
                    >
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

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
          <div className="sticky top-16 sm:top-[68px] xl:top-[72px] z-20 p-2.5 bg-[#080a12]/95 backdrop-blur-xl border-b border-white/10 flex flex-wrap items-center gap-1">
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
              onMouseDown={saveSelection}
              onClick={() => {
                saveSelection();
                bodyImageInputRef.current?.click();
              }}
              className="p-2 rounded-xl hover:bg-white/10 text-neutral-300 hover:text-white cursor-pointer flex items-center gap-1"
              title="Upload & Insert Photo Between Paragraphs"
            >
              <ImageIcon className="w-3.5 h-3.5 text-cyan-400" />
            </button>

            <button
              type="button"
              onMouseDown={saveSelection}
              onClick={handleInsertImageUrl}
              className="px-2 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white text-[11px] font-mono cursor-pointer flex items-center gap-1"
              title="Insert Image by URL"
            >
              <span>+ Image URL</span>
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
              onKeyUp={saveSelection}
              onMouseUp={saveSelection}
              onPaste={handleEditorPaste}
              onDrop={handleEditorDrop}
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
