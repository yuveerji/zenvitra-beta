/**
 * Zenvitra Category Subscription Service
 * Powers user subscriptions to categories across Press, News, and Pulse.
 * When new dispatches, articles, or posts are uploaded, automatically formats and delivers
 * notifications to subscribers across the platform.
 */

import { pushLiveNotification } from './notificationStorage';
import { sendNativeBrowserNotification } from './browserNotifications';

export type SubscriptionPlatform = 'press' | 'news' | 'pulse';

export interface CategorySubscriptionState {
  press: string[];
  news: string[];
  pulse: string[];
}

export const PRESS_CATEGORIES = [
  { id: 'EDITORIAL', label: 'Editorial & Strategic Analysis', icon: '📰' },
  { id: 'ARCHITECTURE', label: 'Architecture & Cyber Infrastructure', icon: '🏛️' },
  { id: 'MANIFESTO', label: 'Manifestos & Ideological Decrees', icon: '📜' },
  { id: 'COMMUNITY', label: 'Community & Youth Governance', icon: '🤝' },
  { id: 'UPDATES', label: 'Official Platform Updates', icon: '⚡' },
];

export const NEWS_CATEGORIES = [
  { id: 'BREAKING', label: 'Breaking News', icon: '🚨' },
  { id: 'INDIA', label: 'India National', icon: '🇮🇳' },
  { id: 'WORLD', label: 'World Affairs', icon: '🌍' },
  { id: 'INTERNATIONAL_AFFAIRS', label: 'International Affairs & Treaties', icon: '🌐' },
  { id: 'YOUTH', label: 'Youth & Model UN', icon: '🎓' },
  { id: 'AI', label: 'Artificial Intelligence', icon: '🤖' },
  { id: 'TECHNOLOGY', label: 'Technology & Cyber', icon: '💻' },
  { id: 'ECONOMY', label: 'Global Economy & Trade', icon: '📈' },
  { id: 'ENVIRONMENT', label: 'Climate & Environment', icon: '🌱' },
  { id: 'SCIENCE', label: 'Science & Deep Tech', icon: '🔬' },
  { id: 'EDUCATION', label: 'Education & Civics', icon: '📚' },
  { id: 'SOCIETY', label: 'Society & Culture', icon: '🏛️' },
];

export const PULSE_TOPICS = [
  { id: 'General', label: 'Sovereign Commons', icon: '🌌' },
  { id: 'Diplomacy', label: 'Diplomacy & Model UN', icon: '🕊️' },
  { id: 'Technology', label: 'Technology & Open Web', icon: '⚡' },
  { id: 'Policy', label: 'Public Policy & Law', icon: '⚖️' },
  { id: 'Economics', label: 'Markets & Decentralization', icon: '🪙' },
  { id: 'Youth', label: 'Youth & Leadership', icon: '🔥' },
];

const LS_SUBSCRIPTIONS_KEY = 'zenvitra_category_subscriptions_v1';

export function getCategorySubscriptions(): CategorySubscriptionState {
  if (typeof window === 'undefined') {
    return { press: [], news: [], pulse: [] };
  }

  try {
    const raw = localStorage.getItem(LS_SUBSCRIPTIONS_KEY);
    if (!raw) {
      return { press: [], news: [], pulse: [] };
    }
    const parsed = JSON.parse(raw);
    return {
      press: Array.isArray(parsed?.press) ? parsed.press : [],
      news: Array.isArray(parsed?.news) ? parsed.news : [],
      pulse: Array.isArray(parsed?.pulse) ? parsed.pulse : [],
    };
  } catch {
    return { press: [], news: [], pulse: [] };
  }
}

export function saveCategorySubscriptions(subs: CategorySubscriptionState): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(LS_SUBSCRIPTIONS_KEY, JSON.stringify(subs));
    window.dispatchEvent(new CustomEvent('zenvitra_category_subscriptions_updated', { detail: subs }));
  } catch (err) {
    console.error('Failed to save category subscriptions:', err);
  }
}

export function isSubscribedToCategory(platform: SubscriptionPlatform, category: string): boolean {
  const subs = getCategorySubscriptions();
  const cleanCat = category.trim().toUpperCase();
  const list = subs[platform] || [];
  return list.some(c => c.toUpperCase() === cleanCat);
}

export function getTotalSubscriptionsCount(subs?: CategorySubscriptionState): number {
  const current = subs || getCategorySubscriptions();
  return (current.news?.length || 0) + (current.press?.length || 0) + (current.pulse?.length || 0);
}

/**
 * Checks if the Category Subscriptions screen has already been completed/seen.
 * Must appear ONLY ONCE per account, exactly like the Tier Points screen.
 */
export function hasSeenCategorySubscriptionsScreen(username?: string): boolean {
  if (typeof window === 'undefined') return false;
  const clean = (username || 'guest').toLowerCase().replace(/^@/, '').trim();
  try {
    const userSeen = localStorage.getItem(`zenvitra_cat_subs_screen_seen_${clean}`);
    if (userSeen === 'true') return true;

    // Check if the user already has at least 5 subscriptions configured and has marked them
    const subs = getCategorySubscriptions();
    const count = (subs.news?.length || 0) + (subs.press?.length || 0) + (subs.pulse?.length || 0);
    if (count >= 5 && userSeen === 'true') {
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

/**
 * Marks that the Category Subscriptions screen has been completed by this user.
 */
export function markCategorySubscriptionsScreenSeen(username?: string): void {
  if (typeof window === 'undefined') return;
  const clean = (username || 'guest').toLowerCase().replace(/^@/, '').trim();
  try {
    localStorage.setItem(`zenvitra_cat_subs_screen_seen_${clean}`, 'true');
    localStorage.setItem('zenvitra_cat_subs_screen_seen_global', 'true');
  } catch {}
}

export function toggleCategorySubscription(platform: SubscriptionPlatform, category: string): boolean {
  const subs = getCategorySubscriptions();
  const cleanCat = category.trim();
  const list = subs[platform] || [];
  const exists = list.some(c => c.toUpperCase() === cleanCat.toUpperCase());

  let updatedList: string[];
  if (exists) {
    updatedList = list.filter(c => c.toUpperCase() !== cleanCat.toUpperCase());
  } else {
    updatedList = [...list, cleanCat];
  }

  const updatedSubs = {
    ...subs,
    [platform]: updatedList,
  };

  saveCategorySubscriptions(updatedSubs);
  return !exists;
}

export function subscribeToCategory(platform: SubscriptionPlatform, category: string): void {
  if (!isSubscribedToCategory(platform, category)) {
    toggleCategorySubscription(platform, category);
  }
}

export function unsubscribeFromCategory(platform: SubscriptionPlatform, category: string): void {
  if (isSubscribedToCategory(platform, category)) {
    toggleCategorySubscription(platform, category);
  }
}

export interface CategoryNotificationPayload {
  platform: SubscriptionPlatform;
  category: string;
  title: string;
  authorName?: string;
  excerpt?: string;
  link: string;
  itemId?: string;
}

/**
 * Dispatches an automated formatted notification to subscribers whenever an item is published.
 */
export function notifyCategorySubscribers(payload: CategoryNotificationPayload): void {
  if (typeof window === 'undefined') return;

  const { platform, category, title, authorName, excerpt, link, itemId } = payload;
  const cleanCategory = category.trim().toUpperCase();

  // Check if subscriber (or if the user has opted in to notifications for this category)
  const isSubscribed = isSubscribedToCategory(platform, cleanCategory);
  
  // Format notification based on platform
  let notifTitle = '';
  let notifMessage = '';

  if (platform === 'press') {
    notifTitle = `📰 Press [${cleanCategory}]: ${title.slice(0, 50)}${title.length > 50 ? '...' : ''}`;
    notifMessage = `${authorName || 'Correspondent'} published a new analysis in ${cleanCategory}.${excerpt ? ` "${excerpt.slice(0, 90)}..."` : ' Read the full dispatch.'}`;
  } else if (platform === 'news') {
    notifTitle = `⚡ News Wire [${cleanCategory}]: ${title.slice(0, 50)}${title.length > 50 ? '...' : ''}`;
    notifMessage = `New wire flash by ${authorName || 'Wire Desk'}.${excerpt ? ` "${excerpt.slice(0, 90)}..."` : ' Click to verify sources and read timeline.'}`;
  } else {
    notifTitle = `🔥 Pulse [${cleanCategory}]: ${title.slice(0, 50)}${title.length > 50 ? '...' : ''}`;
    notifMessage = `${authorName || 'Member'} shared a new post in #${cleanCategory}.${excerpt ? ` "${excerpt.slice(0, 90)}..."` : ''}`;
  }

  const notifId = itemId ? `notif_cat_${platform}_${itemId}` : `notif_cat_${platform}_${Date.now()}`;

  // Only push notification if the user is subscribed to this category (or if it is breaking news)
  if (isSubscribed || cleanCategory === 'BREAKING') {
    pushLiveNotification({
      id: notifId,
      title: notifTitle,
      message: notifMessage,
      link,
      type: 'pulse',
      priority: cleanCategory === 'BREAKING' ? 'URGENT' : 'NORMAL',
      category: cleanCategory,
      platform,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    });

    // Also trigger native browser notification if user allowed device push alerts
    sendNativeBrowserNotification(notifTitle, {
      body: notifMessage,
      link,
      tag: notifId,
    });
  }
}
