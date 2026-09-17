const hostname = window.location.hostname.toLowerCase();
export const IS_MARKETING_HOST = ['sparkydollar.com', 'www.sparkydollar.com'].includes(hostname);
const isCustomHost = IS_MARKETING_HOST || hostname === 'app.sparkydollar.com';
// Keep the original routes usable in the builder preview and on the Base44 address.
export const HOME_HREF = isCustomHost ? 'https://sparkydollar.com/' : '/home';
export const APP_HREF = isCustomHost ? 'https://app.sparkydollar.com/' : '/';