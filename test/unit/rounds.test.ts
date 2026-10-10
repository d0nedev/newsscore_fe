import { describe, expect, it } from "vitest";
import type { Match } from "~/types/match";
import { groupByRound, roundLabel } from "~/utils/rounds";

const m = (id: string, round: string) => ({ id, round }) as Match;

describe("roundLabel", () => {
  it("translates numbered and knockout rounds", () => {
    expect(roundLabel("Round 12")).toBe("Pekan 12");
    expect(roundLabel("Semifinals")).toBe("Semifinal");
    expect(roundLabel("Grup A")).toBe("Grup A");
    expect(roundLabel(undefined)).toBe("");
  });
});

describe("groupByRound", () => {
  it("orders weeks numerically, keeps a postponed match in its week", () => {
    const groups = groupByRound([
      m("a", "Pekan 10"),
      m("b", "Pekan 9"),
      m("c", "Pekan 10"),
      m("late", "Pekan 2"),
      m("f", "Final"),
      m("x", ""),
    ]);
    expect(groups.map((g) => [g.round, g.matches.map((x) => x.id)])).toEqual([
      ["Pekan 2", ["late"]],
      ["Pekan 9", ["b"]],
      ["Pekan 10", ["a", "c"]],
      ["Final", ["f"]],
      ["Lainnya", ["x"]],
    ]);
  });
});
