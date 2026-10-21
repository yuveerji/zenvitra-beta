'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Check } from 'lucide-react';

export interface SelectOption {
  value: string;
  label: string;
  description?: string;
  icon?: React.ComponentType<{ className?: string }>;
  badge?: string;
}

interface CustomSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export function CustomSelect({
  value,
  onChange,
  options,
  placeholder = 'Select an option',
  className = '',
  disabled = false,
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setIsOpen((prev) => !prev);
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (!isOpen) {
        setIsOpen(true);
      } else {
        const currIndex = options.findIndex((opt) => opt.value === value);
        const nextIndex = currIndex < options.length - 1 ? currIndex + 1 : 0;
        onChange(options[nextIndex].value);
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (!isOpen) {
        setIsOpen(true);
      } else {
        const currIndex = options.findIndex((opt) => opt.value === value);
        const prevIndex = currIndex > 0 ? currIndex - 1 : options.length - 1;
        onChange(options[prevIndex].value);
      }
    }
  };

  const SelectedIcon = selectedOption?.icon;

  return (
    <div ref={dropdownRef} className={`relative w-full ${className}`}>
      {/* Trigger Button */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen((prev) => !prev)}
        onKeyDown={handleKeyDown}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className={`w-full px-4 py-3 rounded-2xl bg-white/[0.03] border text-left flex items-center justify-between gap-3 transition-all duration-200 cursor-pointer select-none group shadow-inner ${
          isOpen
            ? 'border-cyan-400/80 ring-2 ring-cyan-500/20 bg-white/[0.06] shadow-[0_0_20px_rgba(6,182,212,0.15)]'
            : 'border-white/10 hover:border-white/20 hover:bg-white/[0.05]'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <div className="flex items-center gap-3 min-w-0 flex-1">
          {SelectedIcon && (
            <div className="w-7 h-7 rounded-xl bg-cyan-500/10 border border-cyan-500/25 flex items-center justify-center text-cyan-400 shrink-0 shadow-sm">
              <SelectedIcon className="w-3.5 h-3.5" />
            </div>
          )}
          <div className="min-w-0 flex-1">
            <div className="text-xs font-semibold text-white truncate flex items-center gap-2">
              <span>{selectedOption ? selectedOption.label : placeholder}</span>
              {selectedOption?.badge && (
                <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 uppercase tracking-wider">
                  {selectedOption.badge}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <ChevronDown
            className={`w-4 h-4 text-neutral-400 group-hover:text-cyan-400 transition-transform duration-200 ${
              isOpen ? 'rotate-180 text-cyan-400' : ''
            }`}
          />
        </div>
      </button>

      {/* Flyout Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
            className="absolute left-0 right-0 top-full mt-2 z-50 p-2 rounded-2xl bg-[#090b12]/95 border border-white/15 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.9),0_0_25px_rgba(6,182,212,0.12)] space-y-1 overflow-hidden"
          >
            <div className="max-h-64 overflow-y-auto no-scrollbar space-y-1 p-0.5">
              {options.map((option) => {
                const isSelected = option.value === value;
                const OptionIcon = option.icon;

                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => {
                      onChange(option.value);
                      setIsOpen(false);
                    }}
                    className={`w-full p-2.5 rounded-xl text-left transition-all duration-150 flex items-center justify-between gap-3 cursor-pointer group border ${
                      isSelected
                        ? 'bg-gradient-to-r from-cyan-500/15 via-cyan-500/10 to-transparent border-cyan-400/40 text-white shadow-sm'
                        : 'bg-transparent border-transparent hover:bg-white/[0.05] hover:border-white/10 text-neutral-300 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      {OptionIcon && (
                        <div
                          className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                            isSelected
                              ? 'bg-cyan-500/20 border border-cyan-400/40 text-cyan-300'
                              : 'bg-white/5 border border-white/10 text-neutral-400 group-hover:text-white group-hover:border-white/20'
                          }`}
                        >
                          <OptionIcon className="w-4 h-4" />
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className={`text-xs font-semibold ${isSelected ? 'text-cyan-300' : 'text-white'}`}>
                            {option.label}
                          </span>
                          {option.badge && (
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-white/5 border border-white/10 text-neutral-400 uppercase">
                              {option.badge}
                            </span>
                          )}
                        </div>
                        {option.description && (
                          <p className="text-[10px] text-neutral-400 font-mono leading-tight mt-0.5 truncate">
                            {option.description}
                          </p>
                        )}
                      </div>
                    </div>

                    {isSelected && (
                      <div className="w-5 h-5 rounded-full bg-cyan-400/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300 shrink-0 shadow-[0_0_8px_rgba(6,182,212,0.4)]">
                        <Check className="w-3 h-3" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default CustomSelect;
