export const LAUNCH_AT = '2026-10-16T23:41:00.000Z';
// Use the existing published address until the owner connects the custom domain.
export const SITE_URL = 'https://stringflix.base44.app';
export const CONSENT = 'Email me a confirmation and the SparkyDollar launch announcement. I can unsubscribe at any time.';
export const isEmail = value => typeof value === 'string' && value.length <= 254 && /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(value);
export const makeToken = () => Array.from(crypto.getRandomValues(new Uint8Array(32)), b => b.toString(16).padStart(2, '0')).join('');
export function launchEmail(subscriber, launch) {
  const link = `${SITE_URL}/waitlist?token=${encodeURIComponent(subscriber.token)}`;
  return {
    from_name: 'SparkyDollar', to: subscriber.email,
    subject: launch ? 'SparkyDollar is here. Find your next move.' : 'Confirm your spot on the SparkyDollar waitlist',
    text: launch
      ? `SparkyDollar is here. Turn your skills, time, and what you already have into a practical income plan. Pick a path, take your next step, and ask Sparky when you get stuck.\n\nOpen the app: ${SITE_URL}/\n\nIncome is not guaranteed. Results depend on your location, demand, skills, and effort.\n\nYou requested this launch announcement from SparkyDollar, a StringFlix LLC product.\nUnsubscribe: ${link}&action=unsubscribe`
      : `One small step before your first move: confirm that you want the SparkyDollar launch announcement.\n\nConfirm your place: ${link}&action=confirm\n\nPlanned launch: October 16, 2026 at 7:41 PM Eastern. We will send one launch announcement, not a stream of marketing emails.\n\nIf you did not request this, ignore this email or unsubscribe below. No app account has been created.\n\nSparkyDollar, a StringFlix LLC product.\nUnsubscribe: ${link}&action=unsubscribe`
  };
}