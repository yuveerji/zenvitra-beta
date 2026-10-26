'use client';

import React, { useState, useEffect, useRef, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X, User, ArrowRight, Sparkles, ShieldCheck, ExternalLink } from 'lucide-react';
import { MASTER_BADGES, isFoundingMember } from '@/lib/badgeSystem';

interface ProfileSearchResult {
  id: string;
  username: string;
  displayName: string;
  avatarUrl?: string;
  bio?: string;
  role?: string;
  badge?: string;
  isVerified?: boolean;
}

interface SearchProfileBarProps {
  className?: string;
  placeholder?: string;
  onSelectProfile?: (username: string) => void;
}

export function SearchProfileBar({
  className = '',
  placeholder = 'Search profiles (@handle)...',
  onSelectProfile,
}: SearchProfileBarProps) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [results, setResults] = useState<ProfileSearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Global hotkey: '/' or 'Ctrl+K' / 'Cmd+K' to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === '/' && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') ||
          ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k')) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Click outside listener to close dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounced search query
  useEffect(() => {
    const clean = query.trim().replace(/^@/, '');
    if (!clean) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/profiles/search?q=${encodeURIComponent(clean)}`);
        if (res.ok) {
          const data = await res.json();
          setResults(data.profiles || []);
        } else {
          setResults([]);
        }
      } catch {
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 180);

    return () => clearTimeout(timer);
  }, [query]);

  const cleanQuery = query.trim().toLowerCase().replace(/^@/, '');

  const handleNavigate = (username: string) => {
    const cleanU = username.toLowerCase().replace(/^@/, '');
    if (!cleanU) return;
    setIsFocused(false);
    setQuery('');
    if (onSelectProfile) {
      onSelectProfile(cleanU);
    } else {
      router.push(`/profile/${cleanU}`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex >= 0 && results[selectedIndex]) {
        handleNavigate(results[selectedIndex].username);
      } else if (cleanQuery) {
        handleNavigate(cleanQuery);
      }
    } else if (e.key === 'Escape') {
      setIsFocused(false);
      inputRef.current?.blur();
    }
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Search Input Box */}
      <div 
        className={`relative flex items-center h-8 sm:h-8.5 rounded-full bg-white/[0.04] hover:bg-white/[0.07] border transition-all duration-200 px-3 ${
          isFocused 
            ? 'border-cyan-400/60 bg-black/80 ring-2 ring-cyan-400/20 shadow-[0_0_15px_rgba(6,182,212,0.25)]' 
            : 'border-white/15'
        }`}
      >
        <Search className={`w-3.5 h-3.5 shrink-0 transition-colors ${isFocused ? 'text-cyan-400' : 'text-neutral-400'}`} />
        
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setSelectedIndex(-1);
          }}
          onFocus={() => setIsFocused(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full bg-transparent px-2.5 text-xs text-white placeholder:text-neutral-500 focus:outline-none font-sans"
        />

        {query ? (
          <button
            type="button"
            onClick={() => {
              setQuery('');
              setResults([]);
              inputRef.current?.focus();
            }}
            className="p-0.5 rounded-full text-neutral-400 hover:text-white hover:bg-white/10 transition cursor-pointer shrink-0"
            title="Clear search"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        ) : (
          <kbd className="hidden xl:inline-block px-1.5 py-0.5 text-[9px] font-mono text-neutral-500 bg-white/5 border border-white/10 rounded">
            /
          </kbd>
        )}
      </div>

      {/* Autocomplete Results Dropdown */}
      {isFocused && (cleanQuery.length > 0 || results.length > 0) && (
        <div 
          className="absolute left-0 sm:left-auto sm:right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-[#07090e]/98 backdrop-blur-2xl border border-white/15 shadow-[0_20px_60px_rgba(0,0,0,0.95),0_0_35px_rgba(6,182,212,0.15)] p-2 z-[200] overflow-hidden animate-in fade-in duration-150"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-3 py-1.5 border-b border-white/10 text-[10px] font-mono text-neutral-400">
            <span className="uppercase tracking-wider flex items-center gap-1.5">
              <User className="w-3 h-3 text-cyan-400" />
              <span>Profiles &amp; Delegates</span>
            </span>
            {isLoading && <span className="text-cyan-400 animate-pulse">Searching...</span>}
          </div>

          {/* Results List */}
          <div className="max-h-72 overflow-y-auto no-scrollbar py-1 space-y-1">
            {results.map((prof, idx) => {
              const badgeKey = prof.badge || (isFoundingMember(prof.username) ? 'FOUNDING MEMBER' : 'DELEGATE');
              const badgeMeta = MASTER_BADGES[badgeKey as keyof typeof MASTER_BADGES] || MASTER_BADGES['DELEGATE'];
              const isSelected = selectedIndex === idx;

              return (
                <button
                  key={prof.id || prof.username}
                  type="button"
                  onClick={() => handleNavigate(prof.username)}
                  className={`w-full p-2.5 rounded-xl transition flex items-center justify-between gap-3 text-left cursor-pointer ${
                    isSelected ? 'bg-cyan-500/20 border border-cyan-400/40 text-white' : 'hover:bg-white/[0.06] text-neutral-200'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-400 to-blue-500 p-[1.5px] shrink-0">
                      <div className="w-full h-full rounded-full bg-black flex items-center justify-center font-bold text-xs text-white uppercase overflow-hidden">
                        {prof.avatarUrl ? (
                          <img src={prof.avatarUrl} alt={prof.displayName} className="w-full h-full object-cover" />
                        ) : (
                          (prof.displayName || prof.username || 'U')[0]?.toUpperCase()
                        )}
                      </div>
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-white truncate">{prof.displayName}</span>
                        {prof.isVerified && <ShieldCheck className="w-3 h-3 text-cyan-400 shrink-0" />}
                      </div>
                      <p className="text-[10px] font-mono text-neutral-400 truncate">@{prof.username}</p>
                    </div>
                  </div>

                  {/* Badge */}
                  <div className="shrink-0 flex items-center gap-1 text-[9px] font-mono px-2 py-0.5 rounded-full border border-white/10 bg-white/5">
                    <span>{badgeMeta.label}</span>
                  </div>
                </button>
              );
            })}

            {/* Direct lookup fallback for ANY query */}
            {cleanQuery && (
              <button
                type="button"
                onClick={() => handleNavigate(cleanQuery)}
                className="w-full p-2.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 transition flex items-center justify-between text-xs font-mono font-semibold cursor-pointer"
              >
                <div className="flex items-center gap-2 truncate">
                  <ArrowRight className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span className="truncate">Open dossier for <strong>@{cleanQuery}</strong></span>
                </div>
                <span className="text-[10px] text-cyan-400/80 bg-cyan-500/20 px-2 py-0.5 rounded-md">View CV / Profile</span>
              </button>
            )}

            {!isLoading && results.length === 0 && !cleanQuery && (
              <div className="p-4 text-center text-xs text-neutral-500 font-mono">
                Type any handle, sovereign ID, or delegate name...
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
