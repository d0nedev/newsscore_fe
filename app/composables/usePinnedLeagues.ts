import { useLocalStorage } from "@vueuse/core";

/**
 * Which competitions the reader has pinned. One shared list, so a league's pin
 * looks the same in every section header, on its own page and in the sidebar.
 * Kept in this browser only; the API has no pin endpoint.
 */
export function usePinnedLeagues() {
  // Same key everywhere, so every caller shares one reactive list.
  const pinned = useLocalStorage<string[]>("pinned-leagues", []);
  const { competitions } = useCompetitions();

  const isPinned = (leagueId?: string) =>
    Boolean(leagueId) && pinned.value.includes(leagueId!);

  const toggle = (leagueId: string) => {
    pinned.value = isPinned(leagueId)
      ? pinned.value.filter((id) => id !== leagueId)
      : [...pinned.value, leagueId];
  };

  const pinnedLeagues = computed(() =>
    competitions.value.filter((c) => pinned.value.includes(c.id)),
  );

  return { pinned, pinnedLeagues, isPinned, toggle };
}
