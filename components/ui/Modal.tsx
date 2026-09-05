'use client';

import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  className,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-xl p-3 sm:p-6 flex flex-col justify-start sm:justify-center items-center animate-in fade-in duration-200">
      <div
        className={cn(
          'relative w-full max-w-lg p-6 sm:p-8 rounded-3xl border border-white/15 bg-[#06070a] shadow-2xl space-y-6 my-auto max-h-[92vh] overflow-y-auto',
          className
        )}
      >
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white transition cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {(title || subtitle) && (
          <div className="space-y-1 pr-8">
            {title && <h3 className="text-lg font-bold font-mono text-white uppercase">{title}</h3>}
            {subtitle && <p className="text-xs font-mono text-neutral-400 leading-relaxed">{subtitle}</p>}
          </div>
        )}

        {children}
      </div>
    </div>
  );
};