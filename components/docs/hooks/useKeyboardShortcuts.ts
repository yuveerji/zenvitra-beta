'use client';

import { useEffect, useCallback } from 'react';

interface KeyboardShortcutHandlers {
  onToggleBold?: () => void;
  onToggleItalic?: () => void;
  onToggleUnderline?: () => void;
  onSave?: () => void;
  onPrint?: () => void;
  onToggleStar?: () => void;
  onOpenCommandPalette?: () => void;
  onCloseAll?: () => void;
}

export function useKeyboardShortcuts(handlers: KeyboardShortcutHandlers) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      const isMod = e.ctrlKey || e.metaKey;

      // Cmd+K — Command palette
      if (isMod && e.key === 'k') {
        e.preventDefault();
        handlers.onOpenCommandPalette?.();
        return;
      }

      // Cmd+S — Save (prevent browser save dialog)
      if (isMod && e.key === 's' && !e.shiftKey) {
        e.preventDefault();
        handlers.onSave?.();
        return;
      }

      // Cmd+P — Print
      if (isMod && e.key === 'p') {
        e.preventDefault();
        handlers.onPrint?.();
        return;
      }

      // Cmd+Shift+S — Toggle star
      if (isMod && e.shiftKey && e.key === 'S') {
        e.preventDefault();
        handlers.onToggleStar?.();
        return;
      }

      // Escape — Close all modals/menus
      if (e.key === 'Escape') {
        handlers.onCloseAll?.();
        return;
      }
    },
    [handlers]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
}
