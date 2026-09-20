import type { Match, Team } from "~/types/match";

const team = (id: string, name: string, badge: string): Team => ({
  id,
  name,
  badge,
});

const noDetail = {
  stats: [],
  lineups: { home: [], away: [] },
  headToHead: [],
};

// Dummy fixtures for the static slice.
export const matches: Match[] = [
  {
    id: "bre-che",
    leagueId: "liga-primer",
    status: "live",
    time: "67'",
    date: "20.09.2026",
    round: "Pekan 5",
    venue: "Stadion Barat",
    home: team("brentford", "Brentford", "BR"),
    away: team("chelsea", "Chelsea", "CH"),
    score: [1, 2],
    halfTime: [1, 1],
    events: [
      { minute: 12, team: "away", type: "goal", player: "N. Jackson" },
      { minute: 38, team: "home", type: "goal", player: "B. Mbeumo" },
      { minute: 44, team: "home", type: "yellow", player: "C. Norgaard" },
      { minute: 61, team: "away", type: "goal", player: "C. Palmer" },
      {
        minute: 64,
        team: "home",
        type: "sub",
        player: "K. Schade",
        note: "masuk untuk Y. Wissa",
      },
    ],
    stats: [
      { label: "Penguasaan bola", home: 44, away: 56, percent: true },
      { label: "Tembakan", home: 9, away: 14 },
      { label: "Tembakan tepat sasaran", home: 3, away: 6 },
      { label: "Sepak pojok", home: 4, away: 7 },
      { label: "Pelanggaran", home: 11, away: 8 },
    ],
    lineups: {
      home: [
        { number: 1, name: "M. Flekken", playerId: "bre-1" },
        { number: 2, name: "N. Collins", playerId: "bre-2" },
        { number: 4, name: "C. Norgaard", playerId: "bre-4" },
        { number: 6, name: "B. Mbeumo", playerId: "bre-6" },
        { number: 7, name: "Y. Wissa", playerId: "bre-7" },
      ],
      away: [
        { number: 1, name: "R. Sanchez", playerId: "che-1" },
        { number: 2, name: "M. Cucurella", playerId: "che-2" },
        { number: 4, name: "M. Caicedo", playerId: "che-4" },
        { number: 6, name: "C. Palmer", playerId: "che-6" },
        { number: 7, name: "N. Jackson", playerId: "che-7" },
      ],
    },
    headToHead: [
      { date: "12.04.2026", label: "Chelsea - Brentford", score: "2 - 0" },
      { date: "03.11.2025", label: "Brentford - Chelsea", score: "1 - 1" },
      { date: "28.01.2025", label: "Chelsea - Brentford", score: "3 - 2" },
    ],
    odds: [
      { bookmaker: "SkorBet", home: 3.1, draw: 3.4, away: 2.2 },
      { bookmaker: "AngkaKu", home: 3.05, draw: 3.5, away: 2.25 },
      { bookmaker: "PasarTaruh", home: 3.2, draw: 3.35, away: 2.15 },
    ],
    commentary: [
      {
        minute: "67'",
        text: "Tendangan sudut untuk Chelsea, bola disapu bek.",
      },
      {
        minute: "64'",
        text: "Pergantian Brentford: Schade masuk, Wissa keluar.",
      },
      {
        minute: "61'",
        text: "GOL! Palmer menyelesaikan umpan tarik dari sisi kanan.",
        highlight: true,
      },
      {
        minute: "50'",
        text: "Babak kedua dimulai, tuan rumah menekan lebih awal.",
      },
      { minute: "45'", text: "Turun minum, skor imbang 1 - 1." },
      {
        minute: "38'",
        text: "GOL! Mbeumo menyamakan kedudukan lewat tembakan kaki kiri.",
        highlight: true,
      },
      {
        minute: "12'",
        text: "GOL! Jackson membawa tamu unggul dari serangan balik.",
        highlight: true,
      },
      { minute: "1'", text: "Pertandingan dimulai." },
    ],
    playerStats: [
      {
        team: "home",
        name: "B. Mbeumo",
        playerId: "bre-6",
        rating: 7.8,
        goals: 1,
        assists: 0,
        shots: 4,
      },
      {
        team: "home",
        name: "M. Flekken",
        playerId: "bre-1",
        rating: 6.9,
        goals: 0,
        assists: 0,
        shots: 0,
      },
      {
        team: "away",
        name: "C. Palmer",
        playerId: "che-6",
        rating: 8.4,
        goals: 1,
        assists: 1,
        shots: 5,
      },
      {
        team: "away",
        name: "N. Jackson",
        playerId: "che-7",
        rating: 7.5,
        goals: 1,
        assists: 0,
        shots: 3,
      },
    ],
  },
  {
    id: "ars-eve",
    leagueId: "liga-primer",
    status: "finished",
    time: "FT",
    date: "20.09.2026",
    round: "Pekan 5",
    venue: "Stadion Utara",
    home: team("arsenal", "Arsenal", "AR"),
    away: team("everton", "Everton", "EV"),
    score: [3, 0],
    halfTime: [1, 0],
    events: [
      { minute: 9, team: "home", type: "goal", player: "B. Saka" },
      { minute: 55, team: "home", type: "goal", player: "K. Havertz" },
      { minute: 73, team: "away", type: "red", player: "J. Branthwaite" },
      { minute: 81, team: "home", type: "goal", player: "L. Trossard" },
    ],
    stats: [
      { label: "Penguasaan bola", home: 63, away: 37, percent: true },
      { label: "Tembakan", home: 17, away: 4 },
      { label: "Tembakan tepat sasaran", home: 8, away: 1 },
      { label: "Sepak pojok", home: 9, away: 2 },
      { label: "Pelanggaran", home: 7, away: 14 },
    ],
    lineups: {
      home: [
        { number: 1, name: "D. Raya", playerId: "ars-1" },
        { number: 2, name: "W. Saliba", playerId: "ars-2" },
        { number: 4, name: "D. Rice", playerId: "ars-4" },
        { number: 6, name: "B. Saka", playerId: "ars-6" },
        { number: 7, name: "K. Havertz", playerId: "ars-7" },
      ],
      away: [
        { number: 1, name: "J. Pickford" },
        { number: 5, name: "J. Branthwaite" },
        { number: 8, name: "I. Gueye" },
        { number: 9, name: "B. Beto" },
      ],
    },
    headToHead: [
      { date: "15.02.2026", label: "Everton - Arsenal", score: "0 - 2" },
      { date: "21.09.2025", label: "Arsenal - Everton", score: "1 - 1" },
    ],
    odds: [
      { bookmaker: "SkorBet", home: 1.35, draw: 5.0, away: 8.5 },
      { bookmaker: "AngkaKu", home: 1.38, draw: 4.8, away: 8.0 },
    ],
  },
  {
    id: "liv-new",
    leagueId: "liga-primer",
    status: "scheduled",
    time: "21:00",
    date: "20.09.2026",
    round: "Pekan 5",
    venue: "Stadion Merah",
    home: team("liverpool", "Liverpool", "LI"),
    away: team("newcastle", "Newcastle", "NE"),
    score: null,
    events: [],
    ...noDetail,
    headToHead: [
      { date: "02.03.2026", label: "Newcastle - Liverpool", score: "1 - 3" },
    ],
    odds: [
      { bookmaker: "SkorBet", home: 1.55, draw: 4.2, away: 5.6 },
      { bookmaker: "AngkaKu", home: 1.58, draw: 4.1, away: 5.4 },
    ],
  },
  {
    id: "rma-bet",
    leagueId: "laliga",
    status: "live",
    time: "23'",
    date: "20.09.2026",
    round: "Pekan 5",
    venue: "Stadion Ibu Kota",
    home: team("real-madrid", "Real Madrid", "RM"),
    away: team("betis", "Real Betis", "BE"),
    score: [0, 0],
    events: [{ minute: 18, team: "away", type: "yellow", player: "Isco" }],
    stats: [
      { label: "Penguasaan bola", home: 58, away: 42, percent: true },
      { label: "Tembakan", home: 5, away: 2 },
      { label: "Tembakan tepat sasaran", home: 1, away: 0 },
    ],
    lineups: { home: [], away: [] },
    headToHead: [],
  },
  {
    id: "bar-gir",
    leagueId: "laliga",
    status: "scheduled",
    time: "22:30",
    date: "20.09.2026",
    round: "Pekan 5",
    venue: "Stadion Katalan",
    home: team("barcelona", "Barcelona", "BA"),
    away: team("girona", "Girona", "GI"),
    score: null,
    events: [],
    ...noDetail,
    odds: [
      { bookmaker: "SkorBet", home: 1.42, draw: 4.8, away: 6.5 },
      { bookmaker: "PasarTaruh", home: 1.45, draw: 4.6, away: 6.2 },
    ],
  },
  {
    id: "int-laz",
    leagueId: "serie-a",
    status: "finished",
    time: "FT",
    date: "19.09.2026",
    round: "Pekan 5",
    venue: "Stadion Utara Milan",
    home: team("inter", "Inter", "IN"),
    away: team("lazio", "Lazio", "LA"),
    score: [2, 2],
    halfTime: [1, 1],
    events: [
      { minute: 22, team: "home", type: "goal", player: "L. Martinez" },
      { minute: 35, team: "away", type: "goal", player: "M. Zaccagni" },
      { minute: 64, team: "home", type: "goal", player: "M. Thuram" },
      { minute: 90, team: "away", type: "goal", player: "T. Castellanos" },
    ],
    stats: [
      { label: "Penguasaan bola", home: 51, away: 49, percent: true },
      { label: "Tembakan", home: 12, away: 11 },
      { label: "Tembakan tepat sasaran", home: 5, away: 5 },
    ],
    lineups: { home: [], away: [] },
    headToHead: [
      { date: "08.03.2026", label: "Lazio - Inter", score: "0 - 1" },
    ],
  },
  {
    id: "che-new",
    leagueId: "liga-primer",
    status: "finished",
    time: "FT",
    date: "19.09.2026",
    round: "Pekan 4",
    venue: "Stadion Biru",
    home: team("chelsea", "Chelsea", "CH"),
    away: team("newcastle", "Newcastle", "NE"),
    score: [2, 1],
    halfTime: [0, 1],
    events: [
      { minute: 30, team: "away", type: "goal", player: "A. Isak" },
      { minute: 58, team: "home", type: "goal", player: "C. Palmer" },
      { minute: 77, team: "home", type: "goal", player: "N. Jackson" },
    ],
    stats: [
      { label: "Penguasaan bola", home: 55, away: 45, percent: true },
      { label: "Tembakan", home: 13, away: 9 },
      { label: "Tembakan tepat sasaran", home: 6, away: 3 },
    ],
    lineups: { home: [], away: [] },
    headToHead: [],
  },
  {
    id: "eve-bre",
    leagueId: "liga-primer",
    status: "scheduled",
    time: "18:30",
    date: "21.09.2026",
    round: "Pekan 6",
    venue: "Stadion Timur",
    home: team("everton", "Everton", "EV"),
    away: team("brentford", "Brentford", "BR"),
    score: null,
    events: [],
    ...noDetail,
    odds: [
      { bookmaker: "SkorBet", home: 2.6, draw: 3.3, away: 2.7 },
    ],
  },
  {
    id: "gir-rma",
    leagueId: "laliga",
    status: "scheduled",
    time: "20:00",
    date: "21.09.2026",
    round: "Pekan 6",
    venue: "Stadion Girona",
    home: team("girona", "Girona", "GI"),
    away: team("real-madrid", "Real Madrid", "RM"),
    score: null,
    events: [],
    ...noDetail,
    odds: [
      { bookmaker: "SkorBet", home: 5.2, draw: 4.0, away: 1.62 },
      { bookmaker: "AngkaKu", home: 5.0, draw: 4.1, away: 1.65 },
    ],
  },
];

export const findMatch = (id: string) =>
  matches.find((match) => match.id === id);

export const matchesByLeague = (leagueId: string) =>
  matches.filter((match) => match.leagueId === leagueId);

export const matchesByTeam = (teamId: string) =>
  matches.filter(
    (match) => match.home.id === teamId || match.away.id === teamId,
  );

/** Dates present in the dummy data; the date bar walks this list. */
export const matchDates = ["19.09.2026", "20.09.2026", "21.09.2026"];

export const today = "20.09.2026";

export const matchesByDate = (date: string) =>
  matches.filter((match) => match.date === date);

export const liveCount = matches.filter(
  (match) => match.status === "live",
).length;

export const sports = [
  "Sepak Bola",
  "Tenis",
  "Bola Basket",
  "Hoki",
  "Bisbol",
  "Kriket",
  "Esports",
];
