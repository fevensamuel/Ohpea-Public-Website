// src/lib/demoMode.ts
/**
 * Demo mode is ON only when VITE_DEMO_MODE is explicitly "true" at build time.
 * There is NO environment auto-enable. Not dev, not preview, not staging.
 * The single reason: silently substituting hardcoded business numbers is a lie,
 * and staging/preview environments are used for sign-off by non-engineers.
 */
export const isDemoMode = (): boolean =>
  String((import.meta as any).env?.VITE_DEMO_MODE ?? '').toLowerCase() === 'true';

/**
 * Returns `real` when it is defined (not null/undefined).
 * Returns `demo` only when demo mode is explicitly enabled.
 * Throws in every other case — a missing required field from the backend is a bug,
 * not a default.
 */
export function realOrDemo<T>(label: string, real: T | undefined | null, demo: T): T {
  if (real !== undefined && real !== null) return real;
  if (isDemoMode()) return demo;
  throw new Error(
    `[ohpea] Missing required field "${label}" from backend. ` +
    `Set VITE_DEMO_MODE=true in this environment's .env to run in demo mode.`
  );
}
