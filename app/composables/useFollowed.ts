import { useLocalStorage } from "@vueuse/core";

/**
 * Stars the reader put on matches, teams or competitions. One list per kind,
 * shared by every caller so a star survives navigation. Browser only, like pins.
 */
export function useFollowed(kind: "match" | "team" | "competition") {
  const ids = useLocalStorage<string[]>(`followed-${kind}`, []);

  const isFollowed = (id: string) => ids.value.includes(id);

  const toggle = (id: string) => {
    ids.value = isFollowed(id)
      ? ids.value.filter((other) => other !== id)
      : [...ids.value, id];
  };

  return { ids, isFollowed, toggle };
}
