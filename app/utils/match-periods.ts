import type { MatchEvent } from "~/types/match";

export interface EventRow {
  event: MatchEvent;
  /** Score right after a goal, e.g. "1 - 0". */
  score?: string;
}

// Walk the events once, tracking the score, and split them by period.
// Period scores are counted from the goals, since the API sends none.
// ponytail: periods split at 45/90 minutes; youth matches (2x30) fold into the first half until the API marks periods.
export function eventPeriods(events: MatchEvent[]) {
  const periods = [
    { label: "Babak pertama", until: 45 },
    { label: "Babak kedua", until: 90 },
    { label: "Babak tambahan", until: Infinity },
  ].map((p) => ({ ...p, rows: [] as EventRow[], score: "" }));
  const shootout = { label: "Adu penalti", rows: [] as EventRow[], score: "" };

  const tally = { home: 0, away: 0 };
  const kicks = { home: 0, away: 0 };
  for (const event of events) {
    const count = event.shootout ? kicks : tally;
    let score: string | undefined;
    if (event.type === "goal") {
      count[event.team] += 1;
      score = `${count.home} - ${count.away}`;
    }
    if (event.shootout) {
      shootout.rows.push({ event, score });
      continue;
    }
    // "90+3'" parses as 90, so stoppage time stays in its half.
    const period = periods.find((p) => event.minute <= p.until)!;
    period.rows.push({ event, score });
    period.score = `${tally.home} - ${tally.away}`;
  }
  shootout.score = `${kicks.home} - ${kicks.away}`;

  // A period without its own goal still shows the running score.
  let last = "0 - 0";
  for (const period of periods) last = period.score ||= last;

  return [...periods, shootout].filter((p) => p.rows.length > 0);
}
