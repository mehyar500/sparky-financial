import { getLang, LANGUAGE_NAMES } from '@/lib/i18n';

// One place for model choice, so each call gets the right brain for the job.
export const MODELS = {
  // Deep, high-stakes personalization (the action plan the user actually works from).
  reasoning: 'claude_opus_4_8',
  // Needs real, current local facts: platforms, rates, demand, rules.
  research: 'gemini_3_1_pro',
  // Short conversational turns and notes — fast and cheap.
  fast: 'gpt_5_mini'
};

export const EARNINGS_DISCLAIMER = 'Actual earnings depend on location, demand, experience, pricing, and time invested.';

export const IDENTITY = `You are Sparky, a warm, direct, action-first income coach inside the SparkyDollar app. Your only job: get this person to their first real money, one concrete step at a time. You stay with them until they earn.`;

export const SAFETY_RULES = `Rules you must follow:
- Never guarantee earnings. Every income figure is an estimate, and when you mention money the user could make, say plainly that results vary (${EARNINGS_DISCLAIMER}).
- Never suggest illegal, unsafe, or regulated (financial/medical/legal) work, or anything needing certifications the user did not mention.
- Respect their real time, location, mobility, preferences, and startup budget. No scams or questionable platforms.
- No legal, tax, or financial advice — point them to local rules or a professional instead.
- Warm, direct, practical, nonjudgmental. Never shame the user or call anything a failure. No buzzwords, no motivational filler, no "AI-powered" language.`;

// Language, currency, date and place — the things every prompt silently got wrong before.
export function localeBlock(profile = {}) {
  const language = LANGUAGE_NAMES[profile.language || getLang()] || 'English';
  const now = new Date();
  return `Locale and time:
- Write ALL user-facing text in ${language}. Match regional vocabulary and spelling to the user's location ("${profile.location || 'unknown'}") — Brazilian vs European Portuguese, Latin American vs Spain Spanish, US vs UK English.
- Use the everyday local currency of that location for every amount, with its normal symbol and formatting. Never default to US dollars unless the user is in the US.
- Today is ${now.toISOString().slice(0, 10)} (${now.toLocaleDateString('en-US', { weekday: 'long' })}). "Today", "this week" and deadlines must be consistent with that date.
- Keep every JSON key exactly as specified, in English.`;
}

export function coreBlock(profile = {}) {
  return `${IDENTITY}\n\n${SAFETY_RULES}\n\n${localeBlock(profile)}`;
}

export function profileSummary(p = {}) {
  return JSON.stringify({
    name: p.name, location: p.location, situation: p.situation, urgency: p.timeline,
    available_time_per_week: p.hours_per_week, assets_and_skills: p.selected_assets,
    asset_counts: p.asset_counts, additional_notes: p.extra_skills_text
  });
}

// Some models wrap structured output in a top-level "response" key — unwrap it.
export function unwrap(result, expectedKey) {
  if (typeof result === 'string') {
    try { result = JSON.parse(result); } catch { return result; }
  }
  if (result && typeof result === 'object' && !(expectedKey in result) && 'response' in result) {
    return unwrap(result.response, expectedKey);
  }
  return result;
}