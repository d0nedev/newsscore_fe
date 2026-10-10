import { describe, expect, it } from "vitest";
import type { LineupPlayer, MatchEvent } from "~/types/match";
import { formationLines, playerMarks } from "~/utils/lineup";

const xi = (places: (number | undefined)[]): LineupPlayer[] =>
  places.map((formationPlace, i) => ({
    number: i + 1,
    name: `P${formationPlace ?? i}`,
    formationPlace,
  }));

describe("formationLines", () => {
  it("splits starters by slot into the formation's lines", () => {
    const lines = formationLines(
      xi([11, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
      "4-2-3-1",
    );
    expect(lines?.map((l) => l.map((p) => p.formationPlace))).toEqual([
      [1],
      [2, 3, 4, 5],
      [6, 7],
      [8, 9, 10],
      [11],
    ]);
  });

  it("gives up without slots or with a mismatched formation", () => {
    const places = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
    expect(formationLines(xi(places), undefined)).toBeNull();
    expect(
      formationLines(xi([...places.slice(0, 10), undefined]), "4-4-2"),
    ).toBeNull();
    expect(formationLines(xi(places), "4-4-3")).toBeNull();
  });
});

describe("playerMarks", () => {
  const ev = (
    type: MatchEvent["type"],
    player: string,
    extra: Partial<MatchEvent> = {},
  ): MatchEvent => ({
    minute: 60,
    minuteLabel: "60'",
    team: "home",
    type,
    player,
    ...extra,
  });

  it("collects goals, cards and both ends of a substitution", () => {
    const marks = playerMarks([
      ev("goal", "A"),
      ev("goal", "A"),
      ev("yellow", "B"),
      ev("sub", "C", { note: "Keluar: B" }),
      ev("goal", "B", { shootout: true }),
    ]);
    expect(marks.get("A")).toMatchObject({ goals: 2 });
    expect(marks.get("B")).toMatchObject({
      goals: 0,
      yellow: true,
      subOff: "60'",
    });
    expect(marks.get("C")).toMatchObject({ subOn: "60'" });
  });
});
