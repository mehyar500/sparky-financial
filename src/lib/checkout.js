import { base44 } from '@/api/base44Client';
import { getLang, translate } from '@/lib/i18n';

export async function startCheckout(profileId) {
  if (window.self !== window.top) {
    alert(translate(getLang(), 'checkout.iframe'));
    return;
  }
  const r = await base44.functions.invoke('createCheckout', { origin: window.location.origin, profileId });
  window.location.href = r.data.url;
}