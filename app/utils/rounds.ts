import type { Match } from "~/types/match";

// The API sends the source's English round names.
// Flashscore and SofaScore spell some of them differently.
const KNOCKOUT: Record<string, string> = {
  "1/8": "16 besar",
  "1/8-finals": "16 besar",
  "Round of 16": "16 besar",
  Quarterfinals: "Perempat final",
  "Quarter-finals": "Perempat final",
  Semifinals: "Semifinal",
  "Semi-finals": "Semifinal",
  Final: "Final",
  "Match for 3rd place": "Perebutan juara 3",
  "3rd place": "Perebutan juara 3",
};

/** "Round 3" -> "Pekan 3", knockout names in Indonesian, anything else as sent. */
export function roundLabel(round?: string): string {
  if (!round) return "";
  const n = /^Round (\d+)$/.exec(round)?.[1];
  return n ? `Pekan ${n}` : (KNOCKOUT[round] ?? round);
}

const weekNumber = (label: string) =>
  Number(/^Pekan (\d+)$/.exec(label)?.[1] ?? Number.POSITIVE_INFINITY);

/**
 * Matches grouped by their (already translated) round, numbered weeks in order
 * and other rounds after them as they first appear. A postponed match joins its
 * own week rather than the week it is played in.
 */
export function groupByRound(matches: Match[]) {
  const groups = new Map<string, Match[]>();
  for (const match of matches) {
    const key = match.round || "Lainnya";
    groups.set(key, [...(groups.get(key) ?? []), match]);
  }
  return [...groups]
    .map(([round, list]) => ({ round, matches: list }))
    .sort((a, b) => weekNumber(a.round) - weekNumber(b.round));
}
