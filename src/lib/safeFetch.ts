const DEFAULT_TIMEOUT_MS = 8000;

function timeout(ms: number): Promise<never> {
  return new Promise((_, reject) => {
    setTimeout(() => reject(new Error(`safeFetch timed out after ${ms}ms`)), ms);
  });
}

/**
 * Races a promise against a timeout so a slow-but-not-dead backend (e.g. a
 * Supabase project still cold-starting) can't hang a request indefinitely.
 * Rejects on timeout instead of swallowing the error — use this in code paths
 * that need their own try/catch control flow (e.g. notFound()); use
 * safeFetch below when a simple fallback value is enough.
 */
export function withTimeout<T>(promise: Promise<T>, timeoutMs: number = DEFAULT_TIMEOUT_MS): Promise<T> {
  return Promise.race([promise, timeout(timeoutMs)]);
}

/**
 * Runs a data-fetching function and never throws — pages use this to stay up
 * (static sections, PageHero, nav, footer) even when Supabase is unreachable
 * OR just slow (e.g. a project cold-starting after being unpaused), showing an
 * inline fallback only where the failed data would have rendered instead of
 * hanging the whole page load.
 */
export async function safeFetch<T>(
  fn: () => Promise<T>,
  fallback: T,
  timeoutMs: number = DEFAULT_TIMEOUT_MS
): Promise<{ data: T; ok: boolean }> {
  try {
    const data = await withTimeout(fn(), timeoutMs);
    return { data, ok: true };
  } catch (error) {
    console.error("[safeFetch] data fetch failed:", error);
    return { data: fallback, ok: false };
  }
}
