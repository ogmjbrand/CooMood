/**
 * Runs a data-fetching function and never throws — pages use this to stay up
 * (static sections, PageHero, nav, footer) even when Supabase is unreachable,
 * showing an inline fallback only where the failed data would have rendered.
 */
export async function safeFetch<T>(fn: () => Promise<T>, fallback: T): Promise<{ data: T; ok: boolean }> {
  try {
    const data = await fn();
    return { data, ok: true };
  } catch (error) {
    console.error("[safeFetch] data fetch failed:", error);
    return { data: fallback, ok: false };
  }
}
