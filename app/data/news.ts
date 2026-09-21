import type { NewsItem } from "~/types/match";

// Dummy headlines for the static slice; no real reporting behind them.
export const news: NewsItem[] = [
  {
    id: "jadwal-pekan-6",
    category: "Resmi",
    title: "Jadwal pekan keenam Liga Primer dirilis",
    summary: "Lima laga dimainkan Sabtu, sisanya Minggu malam waktu setempat.",
    published: "2 jam lalu",
  },
  {
    id: "wawancara-palmer",
    category: "Wawancara",
    title: "Palmer: kami masih punya ruang untuk berkembang",
    summary:
      "Gelandang Chelsea menilai timnya membaik sejak jeda internasional.",
    published: "5 jam lalu",
  },
  {
    id: "cedera-mbeumo",
    category: "Cedera",
    title: "Mbeumo diperkirakan absen dua pekan",
    summary: "Brentford menunggu hasil pemindaian sebelum memastikan durasi.",
    published: "kemarin",
  },
  {
    id: "laliga-rekor",
    category: "Statistik",
    title: "Real Madrid catat awal musim terbaik dalam lima tahun",
    summary: "Empat kemenangan dan satu imbang dari lima laga pembuka LaLiga.",
    published: "kemarin",
  },
];
