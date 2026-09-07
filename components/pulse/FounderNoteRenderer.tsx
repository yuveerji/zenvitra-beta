'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface FounderNoteRendererProps {
  body: string;
  defaultExpanded?: boolean;
  collapsible?: boolean;
  className?: string;
}

export function FounderNoteRenderer({
  body,
  defaultExpanded = false,
  collapsible = true,
  className = '',
}: FounderNoteRendererProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  if (!body) return null;

  // Split content by paragraphs (double newline or single if formatted)
  const sections = body.split(/\n\n+/);

  const renderContent = () => {
    return sections.map((section, idx) => {
      const trimmed = section.trim();
      if (!trimmed) return null;

      // Divider line
      if (trimmed === '———' || trimmed === '---' || trimmed === '***') {
        return (
          <div key={idx} className="my-4 flex items-center gap-3">
            <div className="h-px bg-gradient-to-r from-transparent via-rose-500/30 to-transparent flex-1" />
            <span className="text-[10px] font-mono text-rose-400/60 tracking-widest select-none">❖</span>
            <div className="h-px bg-gradient-to-r from-transparent via-rose-500/30 to-transparent flex-1" />
          </div>
        );
      }

      // Check if this is an all-caps section header (e.g., "WHAT IF THERE WAS ANOTHER WAY?")
      const isHeader =
        trimmed.length > 3 &&
        trimmed.length < 80 &&
        trimmed === trimmed.toUpperCase() &&
        /[A-Z]/.test(trimmed) &&
        !trimmed.includes('\n');

      if (isHeader) {
        return (
          <h4
            key={idx}
            className="pt-2 pb-1 font-display font-bold text-sm sm:text-base text-rose-200 tracking-wide flex items-center gap-2"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-rose-400 shrink-0" />
            <span>{trimmed}</span>
          </h4>
        );
      }

      // Check for quote or single emphasis lines ending with a dash or quote
      const isQuote = trimmed.startsWith('"') && trimmed.endsWith('"');
      if (isQuote) {
        return (
          <blockquote
            key={idx}
            className="my-2 pl-3 py-1 border-l-2 border-rose-500/40 text-amber-200/90 font-mono text-xs sm:text-sm italic"
          >
            {trimmed}
          </blockquote>
        );
      }

      // Regular paragraph - handle internal single newlines as line breaks
      const lines = trimmed.split('\n');
      return (
        <p
          key={idx}
          className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-sans font-light"
        >
          {lines.map((line, lIdx) => (
            <React.Fragment key={lIdx}>
              {line}
              {lIdx < lines.length - 1 && <br />}
            </React.Fragment>
          ))}
        </p>
      );
    });
  };

  return (
    <div className={`space-y-3 ${className}`}>
      <div
        className={`space-y-3 transition-all duration-300 relative ${
          collapsible && !isExpanded ? 'max-h-56 overflow-hidden' : ''
        }`}
      >
        {renderContent()}

        {collapsible && !isExpanded && (
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#0d0914] via-[#0d0914]/80 to-transparent pointer-events-none" />
        )}
      </div>

      {collapsible && (
        <div className="pt-1">
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="inline-flex items-center gap-1.5 text-[11px] font-mono font-bold text-rose-300 hover:text-rose-200 transition-colors bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/25 px-3 py-1.5 rounded-xl cursor-pointer"
          >
            {isExpanded ? (
              <>
                <span>Collapse Note</span>
                <ChevronUp className="w-3.5 h-3.5" />
              </>
            ) : (
              <>
                <span>Read Full Founder's Note ({sections.length} sections)</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
