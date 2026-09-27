import { test as base } from "@playwright/test";
import type { Page, Route } from "@playwright/test";
import type { League, Match } from "../../app/types/match";
import { competitions, findLeague } from "./fixtures/leagues";
import { findMatch, matches } from "./fixtures/matches";
import { news } from "./fixtures/news";
import { findPlayer, findTeam, teams } from "./fixtures/teams";

// Fake Go API (openapi: newsscore 1.0.0) backed by the dummy fixtures.

/** The fixtures are dated around this day; pin the browser clock to it. */
export const FIXTURE_NOW = new Date("2026-09-20T12:00:00+07:00");

const json = (route: Route, status: number, body: unknown) =>
  route.fulfill({
    status,
    contentType: "application/json",
    headers: { "x-request-id": "e2e" },
    body: JSON.stringify(body),
  });

const notFound = (route: Route) =>
  json(route, 404, { error: { code: "NOT_FOUND", message: "Not found" } });

const toApiLeague = (l: League, withTable: boolean) => ({
  id: l.id,
  name: l.name,
  country: l.country,
  type: l.type === "cup" || l.type === "friendly" ? "cup" : "league",
  season: 2026,
  standings: withTable
    ? l.standings.map((row) => ({
        ...row,
        badge:
          findTeam(row.teamId)?.badge ?? row.team.slice(0, 3).toUpperCase(),
      }))
    : undefined,
});

const toApiMatch = (m: Match) => ({
  id: m.id,
  leagueId: m.leagueId,
  league: findLeague(m.leagueId)?.name ?? "",
  status: m.status,
  time: m.status === "live" ? "LIVE" : m.time,
  date: m.date,
  home: m.home,
  away: m.away,
  score: m.score,
});

const toApiMatchDetail = (m: Match) => ({
  ...toApiMatch(m),
  events: m.events.map((e) => ({
    minute: `${e.minute}'`,
    team: e.team,
    type: e.type,
    player: e.player,
    assist: e.type === "goal" ? e.assist : undefined,
    note: e.type === "sub" ? `Keluar: ${e.assist}` : e.note,
  })),
  stats: m.stats.map((s) => ({
    label: s.label,
    home: s.percent ? `${s.home}%` : String(s.home),
    away: s.percent ? `${s.away}%` : String(s.away),
  })),
  lineups: {
    home: m.lineups.home.map((p) => ({ ...p, starter: true })),
    away: m.lineups.away.map((p) => ({ ...p, starter: true })),
  },
});

function team(id: string) {
  const t = findTeam(id);
  if (!t) return;
  const own = matches.filter((m) => m.home.id === id || m.away.id === id);
  return {
    id: t.id,
    name: t.name,
    badge: t.badge,
    season: 2026,
    squad: t.squad.map((p) => ({
      id: p.id,
      name: p.name,
      number: p.number,
      position: p.position,
      matches: p.matches,
      goals: p.goals,
      assists: p.assists,
    })),
    recentMatches: own.filter((m) => m.status !== "scheduled").map(toApiMatch),
    upcomingMatches: own
      .filter((m) => m.status === "scheduled")
      .map(toApiMatch),
  };
}

function player(id: string) {
  const profile = findPlayer(id);
  if (profile) {
    // Fixture profiles still carry the old teamId field.
    const { teamId } = profile as { teamId?: string };
    const t = findTeam(teamId ?? "") ?? teams[0]!;
    return {
      id: profile.id,
      name: profile.name,
      number: profile.number,
      position: teams.flatMap((x) => x.squad).find((x) => x.id === profile.id)
        ?.position,
      country: profile.country,
      team: { id: t.id, name: t.name, badge: t.badge },
      season: { season: 2026, ...profile.season },
      matchLog: (profile.matchLog ?? []).map((e) => ({
        date: e.date.replace(/\.(\d{2})$/, ".20$1"),
        matchId: e.matchId,
        home: e.home,
        away: e.away,
        score: e.score,
        outcome: e.outcome,
        started: !e.note,
        played: !e.note,
        goals: 0,
        assists: 0,
        yellow: e.yellow ?? 0,
        red: e.red ?? 0,
      })),
    };
  }
  for (const t of teams) {
    const entry = t.squad.find((p) => p.id === id);
    if (!entry) continue;
    return {
      id: entry.id,
      name: entry.name,
      number: entry.number,
      position: entry.position,
      team: { id: t.id, name: t.name, badge: t.badge },
      season: {
        season: 2026,
        matches: entry.matches,
        goals: entry.goals,
        assists: entry.assists,
      },
      matchLog: [],
    };
  }
}

async function handle(route: Route) {
  const url = new URL(route.request().url());
  const path = url.pathname.replace(/^\/api\/v1/, "");
  const q = url.searchParams;
  const [, resource, id] = path.split("/");

  if (resource === "leagues") {
    if (!id) {
      const data = competitions.map((l) => toApiLeague(l, false));
      return json(route, 200, { data });
    }
    const league = findLeague(id);
    return league
      ? json(route, 200, { data: toApiLeague(league, true) })
      : notFound(route);
  }
  if (resource === "matches") {
    if (id) {
      const match = findMatch(id);
      return match
        ? json(route, 200, { data: toApiMatchDetail(match) })
        : notFound(route);
    }
    // "DD.MM.YYYY" -> "YYYYMMDD", so dates compare as strings.
    const key = (d: string) => d.split(".").reverse().join("");
    const from = q.get("from"),
      to = q.get("to");
    const date = q.get("date") ?? "20.09.2026";
    const onDay = (d: string) =>
      from && to ? key(d) >= key(from) && key(d) <= key(to) : d === date;
    const data = matches
      .filter(
        (m) =>
          onDay(m.date) &&
          (!q.get("leagueId") || m.leagueId === q.get("leagueId")) &&
          (!q.get("status") || m.status === q.get("status")) &&
          (!q.get("teamId") ||
            m.home.id === q.get("teamId") ||
            m.away.id === q.get("teamId")),
      )
      .map(toApiMatch);
    return json(route, 200, { data });
  }
  if (resource === "teams") {
    const data = team(id!);
    return data ? json(route, 200, { data }) : notFound(route);
  }
  if (resource === "players") {
    const data = player(id!);
    return data ? json(route, 200, { data }) : notFound(route);
  }
  if (resource === "news") {
    const data = news.map((n) => ({
      ...n,
      publishedAt: FIXTURE_NOW.toISOString(),
    }));
    return json(route, 200, { data, meta: { nextCursor: null } });
  }
  return notFound(route);
}

export const mockApi = (page: Page) => page.route("**/api/v1/**", handle);

/** Playwright `test` with a fixed clock and the fake API on every page. */
export const test = base.extend<{ api: undefined }>({
  api: [
    async ({ page }, use) => {
      await page.clock.setFixedTime(FIXTURE_NOW);
      await mockApi(page);
      await use(undefined);
    },
    { auto: true },
  ],
});
export { expect } from "@playwright/test";
