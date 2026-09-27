import { useQueries, useQuery } from "@tanstack/vue-query";
import type { MaybeRefOrGetter } from "vue";
import { apiFetch } from "~/services/api-client";
import type { ApiResponse } from "~/types/api";
import type {
  League,
  Match,
  MatchEvent,
  MatchStatus,
  NewsItem,
  PlayerMatchLogEntry,
  PlayerProfile,
  SquadPlayer,
  StandingRow,
  Team,
  TeamProfile,
} from "~/types/match";
import { slugify } from "~/utils/slug";

// Query hooks for every Go API read (openapi: newsscore 1.0.0). Each hook maps
// the API shape onto the UI types in ~/types/match, so components stay unaware.

const get = <T>(path: string, query?: Record<string, unknown>) =>
  apiFetch<ApiResponse<T>>(`/api/v1${path}`, { query }).then((r) => r.data);

export const isNotFound = (error: unknown) =>
  error instanceof ApiError && error.kind === "not_found";

// ---------- API shapes ----------

type Score = [number, number] | null;

interface ApiMatch {
  id: string;
  /** Competition slug. */
  leagueId: string;
  league: string;
  status: MatchStatus;
  time: string;
  date: string;
  home: Team;
  away: Team;
  score: Score;
}

interface ApiLineupPlayer {
  playerId: string;
  name: string;
  number?: number;
  starter: boolean;
}

interface ApiMatchDetail extends ApiMatch {
  events: {
    minute: string;
    team: "home" | "away" | "";
    type: string;
    player: string;
    assist?: string;
    note?: string;
  }[];
  lineups: { home?: ApiLineupPlayer[]; away?: ApiLineupPlayer[] };
  stats: { label: string; home: string; away: string }[];
}

interface ApiLeague {
  id: string;
  name: string;
  country: string;
  type: "league" | "cup";
  /** 0 until a match is stored. */
  season: number;
  /** Only on GET /leagues/{id}. */
  standings?: (StandingRow & { badge: string; logo?: string })[];
}

interface ApiTeamProfile extends Team {
  season: number;
  squad: {
    id: string;
    name: string;
    number?: number;
    position?: string;
    nationality?: string;
    matches: number;
    goals: number;
    assists: number;
  }[];
  recentMatches: ApiMatch[];
  upcomingMatches: ApiMatch[];
}

interface ApiPlayerProfile {
  id: string;
  name: string;
  number?: number;
  position?: string;
  country?: string;
  team: Team | null;
  season: {
    season?: number;
    matches?: number;
    starts?: number;
    goals?: number;
    assists?: number;
    yellow?: number;
    red?: number;
  };
  matchLog: {
    date: string;
    matchId?: string;
    home: string;
    away: string;
    score: Score;
    outcome: "W" | "D" | "L" | "";
    started?: boolean;
    played?: boolean;
    goals?: number;
    assists?: number;
    yellow?: number;
    red?: number;
  }[];
}

// ---------- mapping ----------

const toMatch = ({ league: _league, ...m }: ApiMatch): Match => ({
  ...m,
  round: "",
  venue: "",
  events: [],
  stats: [],
  lineups: { home: [], away: [] },
  headToHead: [],
});

const toLineup = (p: ApiLineupPlayer) => ({
  number: p.number ?? 0,
  name: p.name,
  playerId: p.playerId,
});

const EVENT_TYPES = new Set(["goal", "yellow", "red", "sub"]);

const toMatchDetail = (m: ApiMatchDetail): Match => ({
  ...toMatch(m),
  // Period markers and raw source types have no row design; skip them.
  events: m.events
    .filter((e) => e.team && EVENT_TYPES.has(e.type))
    .map((e) => ({
      minute: Number.parseInt(e.minute, 10) || 0,
      minuteLabel: e.minute,
      team: e.team as "home" | "away",
      type: e.type as MatchEvent["type"],
      player: e.player,
      assist: e.assist,
      note: e.note,
    })),
  stats: m.stats.map((s) => ({
    label: s.label,
    home: Number.parseFloat(s.home) || 0,
    away: Number.parseFloat(s.away) || 0,
    percent: s.home.endsWith("%") || s.away.endsWith("%"),
  })),
  lineups: {
    home: (m.lineups.home ?? []).filter((p) => p.starter).map(toLineup),
    away: (m.lineups.away ?? []).filter((p) => p.starter).map(toLineup),
  },
});

const toLeague = (l: ApiLeague): League => ({
  id: l.id,
  name: l.name,
  country: l.country,
  type: l.type,
  season: l.season ? String(l.season) : "",
  standings: l.standings ?? [],
  archive: [],
});

const toTeam = (t: ApiTeamProfile): TeamProfile => ({
  id: t.id,
  name: t.name,
  badge: t.badge,
  // The profile names no league; its matches do.
  leagueId:
    t.recentMatches[0]?.leagueId ?? t.upcomingMatches[0]?.leagueId ?? "",
  squad: t.squad.map((p): SquadPlayer => ({
    id: p.id,
    name: p.name,
    number: p.number,
    position: p.position === "GK" ? "GK" : undefined,
    matches: p.matches,
    goals: p.goals,
    assists: p.assists,
  })),
  matches: [...t.recentMatches, ...t.upcomingMatches].map(toMatch),
});

const toPlayer = (p: ApiPlayerProfile): PlayerProfile => ({
  id: p.id,
  name: p.name,
  team: p.team ?? undefined,
  number: p.number,
  position: p.position === "GK" ? "Penjaga gawang" : p.position,
  country: p.country,
  goalkeeper: p.position === "GK",
  season: {
    matches: p.season.matches ?? 0,
    goals: p.season.goals ?? 0,
    assists: p.season.assists ?? 0,
  },
  matchLog: p.matchLog
    .filter((e) => e.score && e.outcome)
    .map((e): PlayerMatchLogEntry => ({
      date: e.date.replace(/\.\d{2}(\d{2})$/, ".$1"), // DD.MM.YYYY -> DD.MM.YY
      // The log names no competition.
      competition: "",
      country: "",
      matchId: e.matchId,
      home: e.home,
      away: e.away,
      score: e.score!,
      outcome: e.outcome as "W" | "D" | "L",
      detail: `${e.goals ?? 0}/${e.assists ?? 0}`,
      yellow: e.yellow,
      red: e.red,
      note: e.played === false ? "Dibangku cadangan" : undefined,
    })),
});

// ---------- dates (WIB) ----------

const wib = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Asia/Jakarta",
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});
const DAY = 86_400_000;
const formatDate = (ms: number) => wib.format(ms).replaceAll("/", ".");

/** Today in WIB plus three days either side, as "DD.MM.YYYY". */
export function useMatchDays() {
  const now = Date.now();
  return {
    today: formatDate(now),
    matchDates: [-3, -2, -1, 0, 1, 2, 3].map((d) => formatDate(now + d * DAY)),
  };
}

// ---------- hooks ----------

/** Every competition, without tables (GET /leagues). */
export function useCompetitions() {
  const query = useQuery({
    queryKey: ["leagues"],
    queryFn: () =>
      get<ApiLeague[]>("/leagues").then((list) => list.map(toLeague)),
    staleTime: 5 * 60_000,
  });
  const competitions = computed(() => query.data.value ?? []);
  // Cups have no table.
  const leagues = computed(() =>
    competitions.value.filter((c) => c.type === "league"),
  );
  const countries = computed(() => [
    ...new Set(competitions.value.map((c) => c.country)),
  ]);
  const findLeague = (id?: string) =>
    competitions.value.find((c) => c.id === id);
  const findCountry = (slug: string) =>
    countries.value.find((country) => slugify(country) === slug);
  const byCountry = (country: string) =>
    competitions.value.filter((c) => c.country === country);

  return {
    ...query,
    competitions,
    leagues,
    countries,
    findLeague,
    findCountry,
    byCountry,
  };
}

const leagueQuery = (id: string) => ({
  queryKey: ["league", id],
  queryFn: () => get<ApiLeague>(`/leagues/${id}`).then(toLeague),
  staleTime: 5 * 60_000,
});

/** One competition with its table (GET /leagues/{id}). */
export function useLeague(id: MaybeRefOrGetter<string | undefined>) {
  return useQuery(
    computed(() => ({
      ...leagueQuery(toValue(id) ?? ""),
      enabled: Boolean(toValue(id)),
    })),
  );
}

/** Tables of every league, for the home page overview. */
export function useLeagueTables() {
  const { leagues } = useCompetitions();
  return useQueries({
    queries: computed(() => leagues.value.map((l) => leagueQuery(l.id))),
    combine: (results) =>
      results.flatMap((r) => (r.data?.standings.length ? [r.data] : [])),
  });
}

export interface MatchFilter {
  date?: string;
  teamId?: string;
  status?: MatchStatus;
}

export function useMatches(
  filter: MaybeRefOrGetter<MatchFilter>,
  enabled: MaybeRefOrGetter<boolean> = true,
) {
  return useQuery({
    queryKey: ["matches", filter],
    queryFn: () =>
      get<ApiMatch[]>("/matches", { ...toValue(filter) }).then((list) =>
        list.map(toMatch),
      ),
    enabled,
    refetchInterval: (query) =>
      query.state.data?.some((m) => m.status === "live") ? 30_000 : false,
  });
}

// ponytail: /matches is per day only, so league and country pages show the
// seven-day window (7 requests, shared cache with the home page). Add a date
// range or leagueId filter to the API when a full season view is needed.
export function useMatchWeek() {
  const { matchDates } = useMatchDays();
  return useQueries({
    queries: matchDates.map((date) => ({
      queryKey: ["matches", { date }],
      queryFn: () =>
        get<ApiMatch[]>("/matches", { date }).then((list) => list.map(toMatch)),
    })),
    combine: (results) => ({
      data: results.flatMap((r) => r.data ?? []),
      error: results.find((r) => r.error)?.error ?? null,
      isPending: results.some((r) => r.isPending),
    }),
  });
}

export function useMatch(id: MaybeRefOrGetter<string>) {
  return useQuery({
    queryKey: ["match", id],
    queryFn: () =>
      get<ApiMatchDetail>(`/matches/${toValue(id)}`).then(toMatchDetail),
    refetchInterval: (query) =>
      query.state.data?.status === "live" ? 15_000 : false,
  });
}

export function useTeam(id: MaybeRefOrGetter<string>) {
  return useQuery({
    queryKey: ["team", id],
    queryFn: () => get<ApiTeamProfile>(`/teams/${toValue(id)}`).then(toTeam),
  });
}

export function usePlayer(id: MaybeRefOrGetter<string>) {
  return useQuery({
    queryKey: ["player", id],
    queryFn: () =>
      get<ApiPlayerProfile>(`/players/${toValue(id)}`).then(toPlayer),
  });
}

export function useNews(
  filter: MaybeRefOrGetter<{ matchId?: string; teamId?: string }> = {},
) {
  return useQuery({
    queryKey: ["news", filter],
    queryFn: () => get<NewsItem[]>("/news", { limit: 20, ...toValue(filter) }),
  });
}
