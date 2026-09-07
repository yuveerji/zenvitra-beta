'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface FounderNoteRendererProps {
  body: string;
  defaultExpanded?: boolean;
  collapsible?: boolean;
  className?: string;
  size?: 'compact' | 'standard';
  isExpanded?: boolean;
  onToggleExpanded?: (expanded: boolean) => void;
}

export function FounderNoteRenderer({
  body,
  defaultExpanded = false,
  collapsible = true,
  className = '',
  size = 'standard',
  isExpanded: controlledExpanded,
  onToggleExpanded,
}: FounderNoteRendererProps) {
  const [internalExpanded, setInternalExpanded] = useState(defaultExpanded);
  const isExpanded = controlledExpanded !== undefined ? controlledExpanded : internalExpanded;

  const handleToggle = (val: boolean) => {
    if (controlledExpanded === undefined) {
      setInternalExpanded(val);
    }
    onToggleExpanded?.(val);
  };

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
            className={`pt-2 pb-1 font-display font-bold text-rose-200 tracking-wide flex items-center gap-2 ${
              size === 'compact' ? 'text-xs sm:text-[13px]' : 'text-sm sm:text-base'
            }`}
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
            className={`my-2 pl-3 py-1 border-l-2 border-rose-500/40 text-amber-200/90 font-mono italic ${
              size === 'compact' ? 'text-[11px]' : 'text-xs sm:text-sm'
            }`}
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
          className={`text-zinc-300 leading-relaxed font-sans font-light ${
            size === 'compact' ? 'text-[11px] sm:text-xs' : 'text-xs sm:text-sm'
          }`}
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
        className={`space-y-2.5 transition-all duration-300 relative ${
          collapsible && !isExpanded ? (size === 'compact' ? 'max-h-36 overflow-hidden' : 'max-h-56 overflow-hidden') : ''
        }`}
      >
        {renderContent()}

        {collapsible && !isExpanded && (
          <div className="absolute inset-x-0 bottom-0 h-16 sm:h-20 bg-gradient-to-t from-[#0d0914] via-[#0d0914]/90 to-transparent pointer-events-none" />
        )}
      </div>

      {collapsible && (
        <div className="pt-1">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleToggle(!isExpanded);
            }}
            className="inline-flex items-center gap-1.5 text-[10px] sm:text-[11px] font-mono font-bold text-rose-300 hover:text-rose-200 transition-colors bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/25 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-xl cursor-pointer"
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
