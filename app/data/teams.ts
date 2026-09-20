import type { PlayerProfile, SquadPlayer, TeamProfile } from "~/types/match";

const squad = (prefix: string, names: string[]): SquadPlayer[] =>
  names.map((name, i) => ({
    id: `${prefix}-${i + 1}`,
    name,
    number: i + 1,
    position: (["GK", "DF", "DF", "MF", "MF", "MF", "FW", "FW"] as const)[
      i % 8
    ]!,
    age: 21 + ((i * 3) % 12),
    matches: 5 - (i % 3),
    goals: (i * 2) % 5,
    assists: i % 4,
  }));

// Dummy squads for the static slice.
export const teams: TeamProfile[] = [
  {
    id: "chelsea",
    name: "Chelsea",
    badge: "CH",
    leagueId: "liga-primer",
    venue: "Stadion Biru",
    capacity: 40853,
    founded: 1905,
    squad: squad("che", [
      "R. Sanchez",
      "M. Cucurella",
      "L. Colwill",
      "M. Caicedo",
      "E. Fernandez",
      "C. Palmer",
      "N. Jackson",
      "P. Neto",
      "J. Gusto",
      "A. Disasi",
    ]),
  },
  {
    id: "brentford",
    name: "Brentford",
    badge: "BR",
    leagueId: "liga-primer",
    venue: "Stadion Barat",
    capacity: 17250,
    founded: 1889,
    squad: squad("bre", [
      "M. Flekken",
      "N. Collins",
      "E. Pinnock",
      "C. Norgaard",
      "M. Damsgaard",
      "B. Mbeumo",
      "Y. Wissa",
      "K. Schade",
    ]),
  },
  {
    id: "arsenal",
    name: "Arsenal",
    badge: "AR",
    leagueId: "liga-primer",
    venue: "Stadion Utara",
    capacity: 60704,
    founded: 1886,
    squad: squad("ars", [
      "D. Raya",
      "W. Saliba",
      "G. Magalhaes",
      "D. Rice",
      "M. Odegaard",
      "B. Saka",
      "K. Havertz",
      "L. Trossard",
    ]),
  },
];

export const findTeam = (id: string) => teams.find((team) => team.id === id);

// One fleshed-out player profile; the rest fall back to their squad row.
export const players: PlayerProfile[] = [
  {
    id: "che-6",
    name: "C. Palmer",
    teamId: "chelsea",
    position: "Gelandang Serang",
    number: 6,
    age: 24,
    country: "Inggris",
    height: 189,
    foot: "Kiri",
    season: { matches: 5, goals: 4, assists: 3, minutes: 431 },
    transfers: [
      {
        season: "2023/2024",
        from: "Manchester City",
        to: "Chelsea",
        fee: "42,5 jt",
      },
      { season: "2020/2021", from: "Akademi", to: "Manchester City", fee: "-" },
    ],
    injuries: [
      {
        season: "2024/2025",
        issue: "Cedera pangkal paha",
        from: "12.03.2025",
        to: "02.04.2025",
      },
      {
        season: "2023/2024",
        issue: "Cedera hamstring",
        from: "18.11.2023",
        to: "01.12.2023",
      },
    ],
  },
];

export const findPlayer = (id: string) =>
  players.find((player) => player.id === id);
