export const SESSION_COOKIE = "as_session";

const MAX_AGE_SECONDS = 60 * 60 * 12;

function readCookie(): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(
    new RegExp(`(?:^|; )${SESSION_COOKIE}=([^;]*)`),
  );
  return match ? decodeURIComponent(match[1]) : null;
}

let snapshot: string | null = null;
let initialized = false;
const listeners = new Set<() => void>();

function ensureInitialized(): void {
  if (initialized || typeof document === "undefined") return;
  snapshot = readCookie();
  initialized = true;
}

function emit(): void {
  listeners.forEach((listener) => listener());
}

export function subscribeToSession(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getSessionSnapshot(): string | null {
  ensureInitialized();
  return snapshot;
}

export function getSessionServerSnapshot(): string | null {
  return null;
}

export function writeSessionCookie(username: string): void {
  document.cookie = `${SESSION_COOKIE}=${encodeURIComponent(
    username,
  )}; Path=/; Max-Age=${MAX_AGE_SECONDS}; SameSite=Lax`;
  snapshot = username;
  initialized = true;
  emit();
}

export function clearSessionCookie(): void {
  document.cookie = `${SESSION_COOKIE}=; Path=/; Max-Age=0; SameSite=Lax`;
  snapshot = null;
  initialized = true;
  emit();
}
