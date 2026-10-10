import type { LineupPlayer, MatchEvent } from "~/types/match";

/**
 * Starters split into pitch lines, goalkeeper first: "4-2-3-1" gives
 * [[GK], [4 defenders], [2], [3], [striker]]. Null when the formation or a
 * starter's slot is missing, or they do not add up to the formation.
 */
export function formationLines(
  starters: LineupPlayer[],
  formation?: string,
): LineupPlayer[][] | null {
  if (!formation || !starters.every((p) => p.formationPlace)) return null;
  const sizes = [1, ...formation.split("-").map(Number)];
  if (
    sizes.some((n) => !n) ||
    sizes.reduce((a, b) => a + b) !== starters.length
  )
    return null;
  const ordered = starters.toSorted(
    (a, b) => a.formationPlace! - b.formationPlace!,
  );
  let at = 0;
  return sizes.map((n) => ordered.slice(at, (at += n)));
}

export interface PlayerMarks {
  goals: number;
  yellow: boolean;
  red: boolean;
  /** Minute label of coming on or going off. */
  subOn?: string;
  subOff?: string;
}

/** What happened to each player, by name, from the match events (shootout excluded). */
export function playerMarks(events: MatchEvent[]) {
  const marks = new Map<string, PlayerMarks>();
  const of = (name: string) => {
    if (!marks.has(name))
      marks.set(name, { goals: 0, yellow: false, red: false });
    return marks.get(name)!;
  };
  for (const e of events) {
    if (e.shootout) continue;
    const minute = e.minuteLabel ?? `${e.minute}'`;
    if (e.type === "goal") of(e.player).goals += 1;
    else if (e.type === "yellow") of(e.player).yellow = true;
    else if (e.type === "red") of(e.player).red = true;
    else if (e.type === "sub") {
      of(e.player).subOn = minute;
      const out = e.note?.replace(/^Keluar:\s*/, "") ?? e.assist;
      if (out) of(out).subOff = minute;
    }
  }
  return marks;
}
