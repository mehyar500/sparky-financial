const hostname = window.location.hostname.toLowerCase();
export const IS_MARKETING_HOST = ['sparkydollar.com', 'www.sparkydollar.com'].includes(hostname);
// Keep the original homepage route usable in the builder preview and on the Base44 address.
export const HOME_HREF = IS_MARKETING_HOST ? '/' : '/home';
export const APP_HREF = '/app';