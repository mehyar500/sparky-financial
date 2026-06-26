// Central onboarding state manager - stored in localStorage for persistence
export const STORAGE_KEY = 'firstdollar_session';

export function getSession() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

export function saveSession(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {}
}

export function clearSession() {
  localStorage.removeItem(STORAGE_KEY);
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