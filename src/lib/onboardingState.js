import { accountStorageKey } from '@/lib/accountStorage';
// Draft answers are isolated to the authenticated account.
export const STORAGE_KEY = 'firstdollar_session';

export function getSession() {
  try {
    const key = accountStorageKey(STORAGE_KEY);
    const raw = key ? localStorage.getItem(key) : null;
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

export function saveSession(data) {
  try {
    const key = accountStorageKey(STORAGE_KEY);
    if (key) localStorage.setItem(key, JSON.stringify(data));
  } catch {}
}

export function clearSession() {
  const key = accountStorageKey(STORAGE_KEY);
  if (key) localStorage.removeItem(key);
}

export const SITUATION_RESPONSES = {
  'laid_off': {
    headline: 'Just got laid off?',
    sub: "Let's help you earn\nyour first dollar here.",
    emoji: '💔',
    bg: 'from-teal-400 to-teal-600'
  },
  'might_lose': {
    headline: 'Uh-oh! Your job is\nat stake.',
    sub: "Let's help you earn\nyour first dollar here.",
    emoji: '😰',
    bg: 'from-teal-400 to-teal-600'
  },
  'extra_income': {
    headline: 'Got it! You need some\nextra money.',
    sub: "Let's help you earn\nyour first dollar here.",
    emoji: '🐷',
    bg: 'from-teal-400 to-teal-600'
  },
  'try_something': {
    headline: 'Sure!\nLet\'s explore something NEW',
    sub: 'to earn your first dollar here.',
    emoji: '🔮',
    bg: 'from-teal-400 to-teal-600'
  }
};