import { describe, expect, it } from "vitest";
import type { Match, MatchStatus, StandingRow, Team } from "~/types/match";
import { seasonProgress, standingsByScope } from "~/utils/standings";

const team = (id: string): Team => ({
  id,
  name: id[0]!.toUpperCase() + id.slice(1),
  badge: id.slice(0, 2).toUpperCase(),
});

const match = (
  home: string,
  away: string,
  score: [number, number] | null,
  status: MatchStatus = "finished",
): Match => ({
  id: `${home}-${away}`,
  leagueId: "liga",
  status,
  time: "20:00",
  date: "20.09.2026",
  round: "Pekan 1",
  venue: "Stadion",
  home: team(home),
  away: team(away),
  score,
  events: [],
  stats: [],
  lineups: { home: [], away: [] },
  headToHead: [],
});

// Deliberately absurd numbers: a scoped rebuild must throw all of them away.
const row = (teamId: string): StandingRow => ({
  position: 99,
  teamId,
  team: team(teamId).name,
  played: 99,
  won: 99,
  drawn: 99,
  lost: 99,
  goalsFor: 99,
  goalsAgainst: 99,
  points: 99,
  form: ["W", "W", "W"],
});

const overall = [row("alfa"), row("beta"), row("gamma")];

const played = [
  match("alfa", "beta", [2, 0]),
  match("beta", "gamma", [1, 1]),
  match("gamma", "alfa", [0, 3]),
];

describe("standingsByScope", () => {
  it("hands back the season table untouched for Keseluruhan", () => {
    expect(standingsByScope(overall, played, "Keseluruhan")).toBe(overall);
  });

  it("counts only home fixtures for Kandang", () => {
    const rows = standingsByScope(overall, played, "Kandang");

    expect(rows.map((r) => [r.position, r.teamId, r.points])).toEqual([
      [1, "alfa", 3],
      [2, "beta", 1],
      [3, "gamma", 0],
    ]);
    expect(rows[0]).toMatchObject({
      played: 1,
      won: 1,
      drawn: 0,
      lost: 0,
      goalsFor: 2,
      goalsAgainst: 0,
      form: ["W"],
    });
    expect(rows[1]).toMatchObject({ drawn: 1, points: 1, form: ["D"] });
    expect(rows[2]).toMatchObject({ lost: 1, points: 0, form: ["L"] });
  });

  it("counts only away fixtures for Tandang", () => {
    const rows = standingsByScope(overall, played, "Tandang");

    expect(rows.map((r) => [r.position, r.teamId, r.points])).toEqual([
      [1, "alfa", 3],
      [2, "gamma", 1],
      [3, "beta", 0],
    ]);
    expect(rows[0]).toMatchObject({
      goalsFor: 3,
      goalsAgainst: 0,
      form: ["W"],
    });
  });

  it("ignores fixtures that were never played", () => {
    const rows = standingsByScope(
      overall,
      [
        match("alfa", "beta", null, "scheduled"),
        // Finished but without a score: still nothing to count.
        match("alfa", "gamma", null),
      ],
      "Kandang",
    );

    expect(rows.every((r) => r.played === 0 && r.points === 0)).toBe(true);
    expect(rows.every((r) => r.form.length === 0)).toBe(true);
  });

  it("skips teams that are not in the season table", () => {
    const rows = standingsByScope(
      [row("alfa")],
      [match("delta", "alfa", [1, 0])],
      "Kandang",
    );

    expect(rows).toHaveLength(1);
    expect(rows[0]).toMatchObject({ teamId: "alfa", played: 0 });
  });

  it("breaks equal points on goal difference, then goals scored", () => {
    const rows = standingsByScope(
      [row("alfa"), row("beta"), row("gamma")],
      [
        match("alfa", "x", [1, 0]), // 3 pts, GD +1, GF 1
        match("beta", "x", [4, 1]), // 3 pts, GD +3, GF 4
        match("gamma", "x", [3, 0]), // 3 pts, GD +3, GF 3
      ],
      "Kandang",
    );

    expect(rows.map((r) => r.teamId)).toEqual(["beta", "gamma", "alfa"]);
  });
});

describe("seasonProgress", () => {
  // An August-to-May season, i.e. one that wraps past New Year.
  const at = (iso: string) => seasonProgress("22.08", "30.05", new Date(iso));

  it("returns null when the season has no bounds", () => {
    expect(seasonProgress(undefined, "30.05")).toBeNull();
    expect(seasonProgress("22.08", undefined)).toBeNull();
  });

  it("sits at 0 on opening day and 1 on the closing day", () => {
    expect(at("2026-08-22T12:00:00")).toBe(0);
    expect(at("2027-05-30T12:00:00")).toBe(1);
  });

  it("grows through the season without ever leaving 0..1", () => {
    const points = [
      at("2026-09-21T12:00:00"),
      at("2026-12-26T12:00:00"),
      at("2027-03-01T12:00:00"),
      at("2027-05-29T12:00:00"),
    ] as number[];

    expect(points).toEqual([...points].sort((a, b) => a - b));
    expect(Math.min(...points)).toBeGreaterThan(0);
    expect(Math.max(...points)).toBeLessThan(1);
  });

  it("reports a finished season during the off-season break", () => {
    // June to mid-August falls after the close and before the next opening.
    expect(at("2027-07-01T12:00:00")).toBe(1);
  });
});
