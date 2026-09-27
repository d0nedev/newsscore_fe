/**
 * The API serves logos and photos as local paths ("/assets/teams/x.png").
 * Prefix them with the API origin; absolute URLs pass through unchanged.
 */
export function assetUrl(path?: string | null): string | undefined {
  if (!path) return undefined;
  const base = useRuntimeConfig().public.apiBaseUrl;
  // Empty base = API on the same origin, so the path already works.
  return base ? new URL(path, base).toString() : path;
}
