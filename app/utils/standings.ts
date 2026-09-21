import type { Match, StandingRow } from "~/types/match";

export type StandingsScope = "Keseluruhan" | "Kandang" | "Tandang";

/**
 * Rebuilds a standings table from played matches, optionally restricted to a
 * team's home or away fixtures. The full-season table stays authoritative for
 * "Keseluruhan" so the dummy data keeps its hand-written numbers.
 */
export function standingsByScope(
  overall: StandingRow[],
  matches: Match[],
  scope: StandingsScope,
): StandingRow[] {
  if (scope === "Keseluruhan") return overall;

  const side = scope === "Kandang" ? "home" : "away";
  const rows = new Map<string, StandingRow>(
    overall.map((row) => [
      row.teamId,
      {
        ...row,
        played: 0,
        won: 0,
        drawn: 0,
        lost: 0,
        goalsFor: 0,
        goalsAgainst: 0,
        points: 0,
        form: [],
      },
    ]),
  );

  for (const match of matches) {
    if (match.status === "scheduled" || !match.score) continue;
    const team = match[side];
    const row = rows.get(team.id);
    if (!row) continue;

    const [homeGoals, awayGoals] = match.score;
    const scored = side === "home" ? homeGoals : awayGoals;
    const conceded = side === "home" ? awayGoals : homeGoals;

    row.played += 1;
    row.goalsFor += scored;
    row.goalsAgainst += conceded;
    if (scored > conceded) {
      row.won += 1;
      row.points += 3;
      row.form.push("W");
    } else if (scored === conceded) {
      row.drawn += 1;
      row.points += 1;
      row.form.push("D");
    } else {
      row.lost += 1;
      row.form.push("L");
    }
  }

  return [...rows.values()]
    .sort(
      (a, b) =>
        b.points - a.points ||
        b.goalsFor - b.goalsAgainst - (a.goalsFor - a.goalsAgainst) ||
        b.goalsFor - a.goalsFor ||
        a.team.localeCompare(b.team),
    )
    .map((row, index) => ({ ...row, position: index + 1 }));
}

/** Fraction of the season elapsed, from "DD.MM" bounds. Clamped to 0..1. */
export function seasonProgress(start?: string, end?: string, now = new Date()) {
  if (!start || !end) return null;
  const dayOfYear = (value: string) => {
    const [day, month] = value.split(".").map(Number);
    return (month! - 1) * 31 + day!;
  };
  const from = dayOfYear(start);
  const to = dayOfYear(end);
  const today = (now.getMonth() + 1 - 1) * 31 + now.getDate();
  // The season wraps past New Year, so shift everything onto one axis.
  const span = to + 372 - from;
  const done = (today < from ? today + 372 : today) - from;
  return Math.min(1, Math.max(0, done / span));
}
