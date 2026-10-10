import { useInfiniteQuery, useQueries, useQuery } from "@tanstack/vue-query";
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
import { roundLabel } from "~/utils/rounds";
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
  round?: string;
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
  photo?: string;
  /** Starters only: 1 goalkeeper, then each line from defence to attack. */
  formationPlace?: number;
  /** SofaScore matches only; keys vary by competition. */
  stats?: Record<string, number>;
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
  lineups: {
    home?: ApiLineupPlayer[];
    away?: ApiLineupPlayer[];
    homeFormation?: string;
    awayFormation?: string;
  };
  stats: { label: string; home: string; away: string }[];
}

type ApiStandingRow = StandingRow & { badge: string; logo?: string };

interface ApiLeague {
  id: string;
  name: string;
  country: string;
  type: "league" | "cup";
  /** 0 until a match is stored. */
  season: number;
  /** Local path under /assets/leagues/. */
  logo?: string;
  /** Only on GET /leagues/{id}. */
  standings?: ApiStandingRow[];
  /** Cups only, on GET /leagues/{id}. */
  groups?: { name: string; standings: ApiStandingRow[] }[];
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
  /** Local path, 108x108. */
  photo?: string;
  number?: number;
  position?: string;
  country?: string;
  /** "YYYY-MM-DD". */
  birthDate?: string;
  heightCm?: number;
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
    league?: string;
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

const withLogo = <T extends { logo?: string }>(item: T): T => ({
  ...item,
  logo: assetUrl(item.logo),
});

const toMatch = ({ league: _league, ...m }: ApiMatch): Match => ({
  ...m,
  home: withLogo(m.home),
  away: withLogo(m.away),
  round: roundLabel(m.round),
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
  photo: assetUrl(p.photo),
  formationPlace: p.formationPlace,
  rating: p.stats?.rating,
});

// Source type -> row type; anything else (period markers, raw types) has no row design.
const EVENT_TYPES: Record<string, MatchEvent["type"]> = {
  goal: "goal",
  "penalty missed": "missed",
  yellow: "yellow",
  red: "red",
  sub: "sub",
};

const side = (players: ApiLineupPlayer[] | undefined, starter: boolean) =>
  (players ?? []).filter((p) => p.starter === starter).map(toLineup);

const toMatchDetail = (m: ApiMatchDetail): Match => ({
  ...toMatch(m),
  events: m.events
    .filter((e) => e.team && EVENT_TYPES[e.type])
    .map((e) => ({
      minute: Number.parseInt(e.minute, 10) || 0,
      minuteLabel: e.minute,
      team: e.team as "home" | "away",
      type: EVENT_TYPES[e.type]!,
      // Shootout kicks carry their round ("3") instead of a minute ("3'").
      shootout: !e.minute.includes("'"),
      player: e.player,
      assist: e.assist,
      note: e.note,
    })),
  // The source repeats each label per period after the full-match block; keep the first.
  stats: m.stats
    .filter((s, i) => m.stats.findIndex((o) => o.label === s.label) === i)
    .map((s) => ({
      label: s.label,
      home: Number.parseFloat(s.home) || 0,
      away: Number.parseFloat(s.away) || 0,
      percent: s.home.includes("%") || s.away.includes("%"),
      // Passes come as "83% (601/722)": keep the counts too.
      text: /\(/.test(s.home + s.away)
        ? { home: s.home, away: s.away }
        : undefined,
    })),
  lineups: {
    home: side(m.lineups.home, true),
    away: side(m.lineups.away, true),
  },
  substitutes: {
    home: side(m.lineups.home, false),
    away: side(m.lineups.away, false),
  },
  formations: {
    home: m.lineups.homeFormation,
    away: m.lineups.awayFormation,
  },
  playerStats: (["home", "away"] as const).flatMap((team) =>
    (m.lineups[team] ?? []).flatMap((p) =>
      p.stats
        ? [
            {
              team,
              name: p.name,
              playerId: p.playerId,
              rating: p.stats.rating,
              goals: p.stats.goals ?? 0,
              assists: p.stats.goalAssist ?? p.stats.assists ?? 0,
              shots: p.stats.totalShots ?? 0,
            },
          ]
        : [],
    ),
  ),
});

const toLeague = (l: ApiLeague): League => ({
  id: l.id,
  name: l.name,
  country: l.country,
  type: l.type,
  season: l.season ? String(l.season) : "",
  // The API mirrors every logo at this path; missing ones 404 and fall back to the country chip.
  logo: assetUrl(l.logo || `/assets/leagues/${l.id}.png`),
  standings: (l.standings ?? []).map(withLogo),
  groups: (l.groups ?? []).map((g) => ({
    name: g.name,
    standings: g.standings.map(withLogo),
  })),
  archive: [],
});

const POSITIONS = {
  GK: "Penjaga gawang",
  DF: "Bek",
  MF: "Gelandang",
  FW: "Penyerang",
} as const;
type Position = keyof typeof POSITIONS;
const isPosition = (p?: string): p is Position => !!p && p in POSITIONS;

const toTeam = (t: ApiTeamProfile): TeamProfile => ({
  id: t.id,
  name: t.name,
  badge: t.badge,
  logo: assetUrl(t.logo),
  // The profile names no league; its matches do.
  leagueId:
    t.recentMatches[0]?.leagueId ?? t.upcomingMatches[0]?.leagueId ?? "",
  squad: t.squad.map((p): SquadPlayer => ({
    id: p.id,
    name: p.name,
    number: p.number,
    position: isPosition(p.position) ? p.position : undefined,
    matches: p.matches,
    goals: p.goals,
    assists: p.assists,
  })),
  matches: [...t.recentMatches, ...t.upcomingMatches].map(toMatch),
});

/** Whole years from a "YYYY-MM-DD" birth date to today. */
const ageOn = (birthDate: string) => {
  const born = new Date(birthDate);
  const now = new Date();
  const hadBirthday =
    now.getMonth() > born.getMonth() ||
    (now.getMonth() === born.getMonth() && now.getDate() >= born.getDate());
  return now.getFullYear() - born.getFullYear() - (hadBirthday ? 0 : 1);
};

const toPlayer = (p: ApiPlayerProfile): PlayerProfile => ({
  id: p.id,
  name: p.name,
  team: p.team ? withLogo(p.team) : undefined,
  photo: assetUrl(p.photo),
  number: p.number,
  position: isPosition(p.position) ? POSITIONS[p.position] : p.position,
  country: p.country,
  birthDate: p.birthDate?.split("-").reverse().join("."),
  age: p.birthDate ? ageOn(p.birthDate) : undefined,
  height: p.heightCm,
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
      competition: e.league ?? "",
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

/** Last and next 15 days: the widest range /matches accepts (31 days). */
export function matchWindow() {
  const now = Date.now();
  return { from: formatDate(now - 15 * DAY), to: formatDate(now + 15 * DAY) };
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

export interface TopPlayer {
  rank: number;
  playerId: string;
  name: string;
  photo?: string;
  teamId?: string;
  team?: string;
  badge?: string;
  logo?: string;
  /** Goals, cards, or a rating like 7.12. */
  value: number;
  appearances?: number;
}

/** Season leaderboards by category (GET /leagues/{id}/top-players); SofaScore competitions only. */
export function useTopPlayers(id: MaybeRefOrGetter<string>) {
  return useQuery({
    queryKey: ["top-players", id],
    queryFn: () =>
      get<{ categories: { category: string; players: TopPlayer[] }[] }>(
        `/leagues/${toValue(id)}/top-players`,
      ).then((d) =>
        d.categories.map((c) => ({
          category: c.category,
          players: c.players.map((p) => ({
            ...p,
            photo: assetUrl(p.photo),
            logo: assetUrl(p.logo),
          })),
        })),
      ),
    staleTime: 5 * 60_000,
  });
}

export interface MatchFilter {
  date?: string;
  /** "DD.MM.YYYY" range, at most 31 days; replaces date. */
  from?: string;
  to?: string;
  leagueId?: string;
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

/**
 * A competition's fixtures from today to the end of the season, 31 days per
 * page (the widest range /matches accepts). The last page is the first empty one.
 */
export function useSeasonFixtures(leagueId: MaybeRefOrGetter<string>) {
  return useInfiniteQuery({
    queryKey: ["season-fixtures", leagueId],
    initialPageParam: 0,
    queryFn: ({ pageParam }) => {
      const from = Date.now() + pageParam * 31 * DAY;
      return get<ApiMatch[]>("/matches", {
        leagueId: toValue(leagueId),
        status: "scheduled",
        from: formatDate(from),
        to: formatDate(from + 30 * DAY),
      }).then((list) => list.map(toMatch));
    },
    // ponytail: stops at the first empty month; a break longer than 31 days ends the list early.
    getNextPageParam: (last, _all, page) =>
      last.length ? page + 1 : undefined,
    staleTime: 5 * 60_000,
  });
}

/**
 * A competition's played matches, newest first, 31 days per page going back
 * from today. The first page skips empty months (a finished cup) up to a year;
 * later pages stop at the first empty month, the gap before the season began.
 */
export function useSeasonResults(leagueId: MaybeRefOrGetter<string>) {
  return useInfiniteQuery({
    queryKey: ["season-results", leagueId],
    initialPageParam: 0,
    queryFn: async ({ pageParam }) => {
      // ponytail: up to 12 sequential requests on the first page, and a mid-season break over 31 days ends the list; a season on /matches would fix both.
      const tries = pageParam === 0 ? 12 : 1;
      for (let k = pageParam; k < pageParam + tries; k++) {
        const to = Date.now() - k * 31 * DAY;
        const list = await get<ApiMatch[]>("/matches", {
          leagueId: toValue(leagueId),
          from: formatDate(to - 30 * DAY),
          to: formatDate(to),
        });
        const played = list.filter((m) => m.status !== "scheduled");
        if (played.length) {
          return { matches: played.map(toMatch).reverse(), next: k + 1 };
        }
      }
      return { matches: [] as Match[], next: undefined };
    },
    getNextPageParam: (last) => last.next,
    refetchInterval: (query) =>
      query.state.data?.pages[0]?.matches.some((m) => m.status === "live")
        ? 30_000
        : false,
    staleTime: 5 * 60_000,
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

const teamQuery = (id: string) => ({
  queryKey: ["team", id],
  queryFn: () => get<ApiTeamProfile>(`/teams/${id}`).then(toTeam),
});

export function useTeam(id: MaybeRefOrGetter<string>) {
  return useQuery(computed(() => teamQuery(toValue(id))));
}

/** Several team profiles, in the given order; teams still loading are left out. */
export function useTeams(ids: MaybeRefOrGetter<string[]>) {
  return useQueries({
    queries: computed(() =>
      toValue(ids).map((id) => ({ ...teamQuery(id), staleTime: 5 * 60_000 })),
    ),
    combine: (results) => results.flatMap((r) => (r.data ? [r.data] : [])),
  });
}

export interface SearchPlayer {
  id: string;
  name: string;
  number?: number;
  /** Team name. */
  team?: string;
  photo?: string;
}

/** Teams and players whose name matches q (GET /search); idle below two characters. */
export function useSearch(q: MaybeRefOrGetter<string>) {
  return useQuery({
    queryKey: ["search", q],
    queryFn: () =>
      get<{ teams: Team[]; players: SearchPlayer[] }>("/search", {
        q: toValue(q).trim(),
      }).then((r) => ({
        teams: r.teams.map(withLogo),
        players: r.players.map((p) => ({ ...p, photo: assetUrl(p.photo) })),
      })),
    enabled: () => toValue(q).trim().length >= 2,
    staleTime: 60_000,
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
