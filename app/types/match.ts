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

export interface TeamProfile extends Team {
  leagueId: string;
  venue: string;
  capacity: number;
  founded: number;
  squad: SquadPlayer[];
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
  season: { matches: number; goals: number; assists: number; minutes: number };
  transfers: { season: string; from: string; to: string; fee: string }[];
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
