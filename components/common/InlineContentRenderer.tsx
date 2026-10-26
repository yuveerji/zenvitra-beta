'use client';

import React, { useState } from 'react';
import { ExternalLink, Maximize2, X } from 'lucide-react';

interface InlineContentRendererProps {
  content: string;
  className?: string;
  style?: React.CSSProperties;
}

interface ContentBlock {
  type: 'text' | 'image' | 'heading';
  text?: string;
  level?: number;
  imageUrl?: string;
  caption?: string;
}

export function InlineContentRenderer({
  content,
  className = '',
  style,
}: InlineContentRendererProps) {
  const [fullscreenImage, setFullscreenImage] = useState<{ url: string; caption?: string } | null>(null);

  if (!content || !content.trim()) {
    return <span className="text-neutral-500 italic">No content provided...</span>;
  }

  // Parse content into text, headings, and inline images
  const blocks: ContentBlock[] = [];

  // If content contains full HTML with tags from rich text editor:
  if (content.includes('<p>') || content.includes('<div') || content.includes('<img')) {
    // Split HTML by <img> or <figure> tags or render sanitized rich HTML
    // For rich text HTML from ArticleEditor, we render directly with styled images
    return (
      <>
        <div
          className={`zen-article-content text-neutral-100 font-sans leading-relaxed break-words space-y-4 ${className}`}
          style={style}
          dangerouslySetInnerHTML={{ __html: content }}
        />
        {/* Fullscreen modal for clicked images */}
        {fullscreenImage && (
          <div
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md p-4 flex flex-col items-center justify-center animate-in fade-in duration-200"
            onClick={() => setFullscreenImage(null)}
          >
            <button
              type="button"
              onClick={() => setFullscreenImage(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <img
              src={fullscreenImage.url}
              alt={fullscreenImage.caption || 'Enlarged Image'}
              className="max-w-[95vw] max-h-[85vh] rounded-2xl object-contain shadow-2xl border border-white/20"
            />
            {fullscreenImage.caption && (
              <p className="mt-3 text-xs font-mono text-neutral-300 bg-black/70 px-3 py-1 rounded-full border border-white/10">
                {fullscreenImage.caption}
              </p>
            )}
          </div>
        )}
      </>
    );
  }

  // Markdown parsing for Pulse and News dispatches
  const lines = content.split('\n');
  let currentTextBuffer: string[] = [];

  const flushTextBuffer = () => {
    if (currentTextBuffer.length > 0) {
      const text = currentTextBuffer.join('\n').trim();
      if (text) {
        blocks.push({ type: 'text', text });
      }
      currentTextBuffer = [];
    }
  };

  const mdImgRegex = /!\[(.*?)\]\((.*?)\)/;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const imgMatch = line.match(mdImgRegex);

    if (imgMatch) {
      flushTextBuffer();
      // If there's text before the image on the same line
      const before = line.substring(0, imgMatch.index).trim();
      if (before) {
        blocks.push({ type: 'text', text: before });
      }

      blocks.push({
        type: 'image',
        caption: imgMatch[1] || '',
        imageUrl: imgMatch[2],
      });

      // If there's text after the image on the same line
      const after = line.substring((imgMatch.index || 0) + imgMatch[0].length).trim();
      if (after) {
        currentTextBuffer.push(after);
      }
    } else if (line.startsWith('### ')) {
      flushTextBuffer();
      blocks.push({ type: 'heading', level: 3, text: line.replace('### ', '').trim() });
    } else if (line.startsWith('## ')) {
      flushTextBuffer();
      blocks.push({ type: 'heading', level: 2, text: line.replace('## ', '').trim() });
    } else {
      currentTextBuffer.push(line);
    }
  }
  flushTextBuffer();

  // Helper to render text with markdown links & bold
  const renderFormattedText = (text: string) => {
    const parts = text.split(/(\[.*?\]\(.*?\)|\*\*.*?\*\*)/g);
    return parts.map((part, idx) => {
      if (part.startsWith('[') && part.includes('](') && part.endsWith(')')) {
        const linkMatch = part.match(/\[(.*?)\]\((.*?)\)/);
        if (linkMatch) {
          return (
            <a
              key={idx}
              href={linkMatch[2]}
              target={linkMatch[2].startsWith('http') ? '_blank' : undefined}
              rel={linkMatch[2].startsWith('http') ? 'noopener noreferrer' : undefined}
              className="text-cyan-400 hover:text-cyan-300 underline underline-offset-2 inline-flex items-center gap-0.5"
            >
              <span>{linkMatch[1]}</span>
              {linkMatch[2].startsWith('http') && <ExternalLink className="w-2.5 h-2.5 inline shrink-0" />}
            </a>
          );
        }
      }
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={idx} className="font-bold text-white">{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  return (
    <>
      <div className={`space-y-4 text-neutral-100 font-sans leading-relaxed break-words ${className}`} style={style}>
        {blocks.map((block, idx) => {
          if (block.type === 'image' && block.imageUrl) {
            return (
              <figure key={idx} className="my-5 rounded-2xl overflow-hidden border border-white/15 bg-black/60 shadow-xl group relative">
                <div className="relative overflow-hidden cursor-pointer" onClick={() => setFullscreenImage({ url: block.imageUrl!, caption: block.caption })}>
                  <img
                    src={block.imageUrl}
                    alt={block.caption || 'Inline figure'}
                    className="w-full max-h-[500px] object-cover transition-transform duration-300 group-hover:scale-[1.01]"
                  />
                  <div className="absolute top-2.5 right-2.5 p-1.5 rounded-lg bg-black/70 text-white/80 opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm">
                    <Maximize2 className="w-4 h-4" />
                  </div>
                </div>
                {block.caption && block.caption.trim().length > 0 && (
                  <figcaption className="p-2.5 text-center text-xs font-mono text-neutral-400 border-t border-white/10 bg-white/[0.02]">
                    {block.caption}
                  </figcaption>
                )}
              </figure>
            );
          }

          if (block.type === 'heading') {
            return (
              <h4 key={idx} className="font-display font-bold text-white text-base sm:text-lg pt-2 pb-1 border-b border-white/10">
                {block.text}
              </h4>
            );
          }

          return (
            <p key={idx} className="whitespace-pre-wrap leading-relaxed text-[14px] sm:text-[15px] text-neutral-200">
              {renderFormattedText(block.text || '')}
            </p>
          );
        })}
      </div>

      {/* Fullscreen modal for clicked images */}
      {fullscreenImage && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md p-4 flex flex-col items-center justify-center animate-in fade-in duration-200"
          onClick={() => setFullscreenImage(null)}
        >
          <button
            type="button"
            onClick={() => setFullscreenImage(null)}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
          <img
            src={fullscreenImage.url}
            alt={fullscreenImage.caption || 'Enlarged Image'}
            className="max-w-[95vw] max-h-[85vh] rounded-2xl object-contain shadow-2xl border border-white/20"
          />
          {fullscreenImage.caption && (
            <p className="mt-3 text-xs font-mono text-neutral-300 bg-black/70 px-3 py-1 rounded-full border border-white/10">
              {fullscreenImage.caption}
            </p>
          )}
        </div>
      )}
    </>
  );
}
