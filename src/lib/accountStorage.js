// A key is selected only after the SDK has established the current identity.
let accountId = null;
export const ACCOUNT_CHANGE_KEY = 'sparky_authenticated_account';
export function accountStorageKey(key) { return accountId ? `${key}:${accountId}` : null; }
export function bindAccountStorage(id) {
  accountId = id || null;
  // Legacy shared caches cannot safely be attributed to any account.
  ['firstdollar_session', 'sparky_active_path_id', 'firstdollar_lang'].forEach(key => localStorage.removeItem(key));
  const next = accountId || '';
  if (localStorage.getItem(ACCOUNT_CHANGE_KEY) !== next) localStorage.setItem(ACCOUNT_CHANGE_KEY, next);
}