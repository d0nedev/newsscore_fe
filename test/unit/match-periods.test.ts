import { describe, expect, it } from "vitest";
import type { MatchEvent } from "~/types/match";
import { eventPeriods } from "~/utils/match-periods";

const ev = (
  minuteLabel: string,
  team: "home" | "away",
  type: MatchEvent["type"] = "goal",
): MatchEvent => ({
  minute: Number.parseInt(minuteLabel, 10),
  minuteLabel,
  team,
  type,
  player: "P",
  shootout: !minuteLabel.includes("'"),
});

describe("eventPeriods", () => {
  it("splits halves, extra time and a shootout with separate scores", () => {
    const periods = eventPeriods([
      // The API lists shootout kicks first.
      ev("1", "home"),
      ev("1", "away", "missed"),
      ev("2", "home"),
      ev("19'", "away"),
      ev("45+2'", "home"),
      ev("90+3'", "home", "yellow"),
      ev("112'", "away"),
    ]);
    expect(periods.map((p) => [p.label, p.score, p.rows.length])).toEqual([
      ["Babak pertama", "1 - 1", 2],
      ["Babak kedua", "1 - 1", 1],
      ["Babak tambahan", "1 - 2", 1],
      ["Adu penalti", "2 - 0", 3],
    ]);
    expect(periods[3]!.rows.map((r) => r.score)).toEqual([
      "1 - 0",
      undefined,
      "2 - 0",
    ]);
  });

  it("carries the score into a period without goals", () => {
    const periods = eventPeriods([ev("10'", "home"), ev("60'", "away", "red")]);
    expect(periods.map((p) => p.score)).toEqual(["1 - 0", "1 - 0"]);
  });
});
