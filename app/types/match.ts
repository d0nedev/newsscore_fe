export type MatchStatus = "scheduled" | "live" | "finished";

export interface Team {
  id: string;
  name: string;
  /** Short code used as a text stand-in for the club crest. */
  badge: string;
}

export interface MatchEvent {
  minute: number;
  team: "home" | "away";
  type: "goal" | "yellow" | "red" | "sub";
  player: string;
  note?: string;
  /** Goal assist, or the player replaced on a substitution. */
  assist?: string;
}

export interface MatchStat {
  label: string;
  home: number;
  away: number;
  /** Rendered as "12%" instead of "12" when true. */
  percent?: boolean;
}

export interface LineupPlayer {
  number: number;
  name: string;
  playerId?: string;
}

export interface MatchOdds {
  bookmaker: string;
  home: number;
  draw: number;
  away: number;
}

export interface CommentaryLine {
  minute: string;
  text: string;
  highlight?: boolean;
}

export interface PlayerMatchStat {
  team: "home" | "away";
  name: string;
  playerId?: string;
  rating: number;
  goals: number;
  assists: number;
  shots: number;
}

export interface Match {
  id: string;
  leagueId: string;
  status: MatchStatus;
  /** Kick-off time for scheduled matches, elapsed minute for live ones. */
  time: string;
  date: string;
  round: string;
  venue: string;
  home: Team;
  away: Team;
  score: [number, number] | null;
  halfTime?: [number, number];
  events: MatchEvent[];
  stats: MatchStat[];
  lineups: { home: LineupPlayer[]; away: LineupPlayer[] };
  headToHead: { date: string; label: string; score: string }[];
  /** Detail tabs only exist for matches with a full dummy record. */
  odds?: MatchOdds[];
  commentary?: CommentaryLine[];
  playerStats?: PlayerMatchStat[];
  referee?: string;
  attendance?: number;
  broadcasters?: string[];
}

export interface StandingRow {
  position: number;
  teamId: string;
  team: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  points: number;
  /** Most recent results first: W, D or L. */
  form: ("W" | "D" | "L")[];
}

export interface League {
  id: string;
  country: string;
  name: string;
  season: string;
  /** Cups and friendlies have no table, so they never appear in standings UI. */
  type?: "league" | "cup" | "friendly";
  /** Season window as "DD.MM", used by the header progress bar. */
  start?: string;
  end?: string;
  standings: StandingRow[];
  /** Past seasons shown on the league archive tab. */
  archive: { season: string; winner: string; runnerUp: string }[];
}

export interface SquadPlayer {
  id: string;
  name: string;
  number: number;
  position: "GK" | "DF" | "MF" | "FW";
  age: number;
  matches: number;
  goals: number;
  assists: number;
}

export interface TeamTransfer {
  /** "DD.MM.YYYY", matching the rest of the dummy data. */
  date: string;
  player: string;
  playerId?: string;
  /** Arrival at this club, or a departure from it. */
  direction: "in" | "out";
  /** The other club involved: the origin for "in", the destination for "out". */
  club: string;
  fee: string;
}

export interface TeamProfile extends Team {
  leagueId: string;
  venue: string;
  capacity: number;
  founded: number;
  /** City shown next to the stadium name in the team header. */
  city?: string;
  squad: SquadPlayer[];
  transfers?: TeamTransfer[];
}

export interface PlayerMatchLogEntry {
  /** "DD.MM.YY", as the compact match log prints it. */
  date: string;
  /** Short competition code shown next to the flag, e.g. "PL" or "EFL". */
  competition: string;
  country: string;
  matchId?: string;
  home: string;
  away: string;
  score: [number, number];
  /** Result from this player's team's point of view. */
  outcome: "W" | "D" | "L";
  rating?: number;
  minutes?: number;
  /** Saves as "3/6" for a keeper, or a goal/assist tally for an outfielder. */
  detail?: string;
  yellow?: number;
  red?: number;
  /** Replaces the stat columns when the player did not take the field. */
  note?: string;
}

export type CareerGroup =
  "Liga" | "Piala Domestik" | "Piala Internasional" | "Tim Nasional";

export interface CareerRow {
  group: CareerGroup;
  season: string;
  teamId?: string;
  team: string;
  competition: string;
  country: string;
  rating?: number;
  apps: number;
  /** Keeper columns. */
  savePct?: number;
  cleanSheets?: number;
  /** Outfield columns. */
  goals?: number;
  assists?: number;
  yellow: number;
  red: number;
}

export interface PlayerProfile {
  id: string;
  name: string;
  teamId: string;
  position: string;
  number: number;
  age: number;
  country: string;
  height: number;
  foot: "Kiri" | "Kanan";
  /** "DD.MM.YYYY", shown next to the age in the header. */
  birthDate?: string;
  marketValue?: string;
  contractUntil?: string;
  goalkeeper?: boolean;
  season: { matches: number; goals: number; assists: number; minutes: number };
  matchLog?: PlayerMatchLogEntry[];
  career?: CareerRow[];
  transfers: {
    season: string;
    /** "DD.MM.YYYY"; falls back to the season label when absent. */
    date?: string;
    from: string;
    to: string;
    /** "Transfer", "Peminjaman", "Pengembalian pinjaman". */
    type?: string;
    fee: string;
  }[];
  injuries: { season: string; issue: string; from: string; to: string }[];
}

export interface NewsItem {
  id: string;
  category: string;
  title: string;
  summary: string;
  /** Relative label; the slice has no real timestamps. */
  published: string;
}
