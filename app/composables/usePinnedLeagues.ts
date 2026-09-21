import { competitions, leagues } from "~/data/leagues";

/**
 * Which competitions the reader has pinned. One shared list, so a league's pin
 * looks the same in every section header, on its own page and in the sidebar.
 */
export function usePinnedLeagues() {
  const pinned = useState<string[]>("pinned-leagues", () => [
    leagues[0]?.id ?? "",
  ]);

  const isPinned = (leagueId?: string) =>
    Boolean(leagueId) && pinned.value.includes(leagueId!);

  const toggle = (leagueId: string) => {
    pinned.value = isPinned(leagueId)
      ? pinned.value.filter((id) => id !== leagueId)
      : [...pinned.value, leagueId];
  };

  const pinnedLeagues = computed(() =>
    competitions.filter((competition) => pinned.value.includes(competition.id)),
  );

  return { pinned, pinnedLeagues, isPinned, toggle };
}
