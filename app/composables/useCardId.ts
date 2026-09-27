import { slugify } from "~/utils/slug";

/**
 * Stable `data-card` value for a card: "<route name>-<card name>",
 * e.g. "pertandingan-match-statistik". Unique per page, handy in devtools and tests.
 */
export function useCardId(name: string) {
  return `${String(useRoute().name ?? "app")}-${slugify(name)}`;
}
