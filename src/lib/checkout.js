import { base44 } from '@/api/base44Client';

export async function startCheckout(profileId) {
  if (window.self !== window.top) {
    alert('Checkout works from the published app. Open FirstDollar in a new tab to continue.');
    return;
  }
  const r = await base44.functions.invoke('createCheckout', { origin: window.location.origin, profileId });
  window.location.href = r.data.url;
}