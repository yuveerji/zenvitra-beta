/**
 * Sovereign Timezone Utility
 * Ensures all timestamps across ZenChat, Pulse, MUN, and the platform
 * render in each viewer's respective local timezone (POV-aware).
 */

export function formatViewerTime(
  rawTime?: string | number | Date | null,
  options?: { showDate?: boolean; hour12?: boolean }
): string {
  if (!rawTime) return '';
  
  // If it's a raw string that is already formatted time (like '10:30 PM') and can't be parsed as date
  const d = new Date(rawTime);
  if (isNaN(d.getTime())) {
    return String(rawTime);
  }

  const hour12 = options?.hour12 ?? true;

  if (options?.showDate) {
    const isToday = new Date().toDateString() === d.toDateString();
    if (isToday) {
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12 });
    }
    const isThisYear = new Date().getFullYear() === d.getFullYear();
    const datePart = d.toLocaleDateString([], { 
      month: 'short', 
      day: 'numeric',
      ...(isThisYear ? {} : { year: 'numeric' })
    });
    const timePart = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12 });
    return `${datePart}, ${timePart}`;
  }

  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12 });
}

export function formatViewerDate(
  rawDate?: string | number | Date | null,
  options?: Intl.DateTimeFormatOptions
): string {
  if (!rawDate) return '';
  const d = new Date(rawDate);
  if (isNaN(d.getTime())) return String(rawDate);

  const defaultOpts: Intl.DateTimeFormatOptions = {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  };

  return d.toLocaleDateString([], options || defaultOpts);
}

export function getViewerTimezoneName(): string {
  if (typeof Intl !== 'undefined' && Intl.DateTimeFormat) {
    try {
      return Intl.DateTimeFormat().resolvedOptions().timeZone || 'Local';
    } catch {
      return 'Local';
    }
  }
  return 'Local';
}
