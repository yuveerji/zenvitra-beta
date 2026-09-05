import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export function sanitizeHandle(handle: string): string {
  return handle
    .trim()
    .toLowerCase()
    .replace(/^@+/, '')
    .replace(/[^a-z0-9_]/g, '')
    .slice(0, 24);
}

export function formatTruncatedKey(key: string, visibleChars: number = 4): string {
  if (key.length <= visibleChars * 2) return key;
  return `${key.slice(0, visibleChars)}••••••••${key.slice(-visibleChars)}`;
}