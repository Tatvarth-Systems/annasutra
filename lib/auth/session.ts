export const SESSION_COOKIE = "as_session";

const MAX_AGE_SECONDS = 60 * 60 * 12;

/** Extracts session cookie value from document.cookie. */
const readCookie = (): string | null => {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(
    new RegExp(`(?:^|; )${SESSION_COOKIE}=([^;]*)`),
  );
  return match && decodeURIComponent(match[1]);
};

let snapshot: string | null = null;
let initialized = false;
const listeners = new Set<() => void>();

/** Initializes session snapshot from cookie on first call. */
const ensureInitialized = (): void => {
  if (initialized || typeof document === "undefined") return;
  snapshot = readCookie();
  initialized = true;
};

/** Notifies all registered listeners of session changes. */
const emit = (): void => {
  listeners.forEach((listener) => listener());
};

/** Registers a listener for session changes and returns unsubscribe function. */
export const subscribeToSession = (listener: () => void): (() => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

/** Returns current session username snapshot. */
export const getSessionSnapshot = (): string | null => {
  ensureInitialized();
  return snapshot;
};

/** Server-side snapshot placeholder (always null). */
export const getSessionServerSnapshot = (): string | null => {
  return null;
};

/** Writes session cookie with username and notifies listeners. */
export const writeSessionCookie = (username: string): void => {
  document.cookie = `${SESSION_COOKIE}=${encodeURIComponent(
    username,
  )}; Path=/; Max-Age=${MAX_AGE_SECONDS}; SameSite=Lax`;
  snapshot = username;
  initialized = true;
  emit();
};

/** Clears session cookie and notifies listeners. */
export const clearSessionCookie = (): void => {
  document.cookie = `${SESSION_COOKIE}=; Path=/; Max-Age=0; SameSite=Lax`;
  snapshot = null;
  initialized = true;
  emit();
};
