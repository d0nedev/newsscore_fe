# Rencana Refactor

Status: sedang berjalan. P0 dan P5 selesai.
Dasar: pemindaian repo pada 2026-09-21, diperbarui 2026-09-22.
Warna sengaja tidak disentuh di sini — lihat `docs/color-recommendation.md`.
Rencana API terpisah di `docs/integration-api-plan.md`.

| Bagian | Isi                              | Status                     |
| ------ | -------------------------------- | -------------------------- |
| P0     | Lint gagal                       | **selesai** 2026-09-22     |
| P1     | Status bintang tidak nyata       | belum                      |
| P2     | Kode mati                        | belum, sebagian dibatalkan |
| P3     | Lapisan data terkunci ke halaman | ditunda, sengaja           |
| P4     | Berkas yang mulai kebesaran      | belum                      |
| P5     | Logika tanpa pengaman            | **selesai** 2026-09-22     |

## Ringkasan kesehatan saat ini

Seluruhnya hijau per 2026-09-22.

| Pemeriksaan | Perintah         | Hasil                    |
| ----------- | ---------------- | ------------------------ |
| Build       | `pnpm build`     | lolos (exit 0)           |
| Type        | `pnpm typecheck` | lolos (exit 0)           |
| Lint        | `pnpm lint`      | lolos (exit 0)           |
| Unit test   | `pnpm test`      | 32 test, 3 berkas, lolos |
| E2E         | `pnpm test:e2e`  | 8 test, lolos            |

Total kode aplikasi di luar `app/components/ui`: 5.115 baris.
Dari jumlah itu, 1.357 baris (27%) adalah data dummy yang ditulis tangan.

`source/` (30 MB salinan situs referensi) sudah masuk `.gitignore` dan tidak
ikut ter-commit. Tidak perlu tindakan.

## P0 — Lint gagal — SELESAI 2026-09-22

`pnpm lint` sekarang keluar dengan kode 0.

Yang dikerjakan:

- `app/components/Breadcrumb.vue` diganti nama menjadi `AppBreadcrumb.vue`,
  beserta empat rujukannya. Dipilih mengganti nama, bukan mematikan aturan
  `vue/multi-word-component-names`, supaya aturannya tetap berlaku untuk
  komponen berikutnya.
- Impor `TeamTransfer` yang yatim dihapus dari `app/data/teams.ts`.
- Tujuh prop opsional di `CrestBox`, `SectionCard`, dan `StandingsTable`
  diberi nilai bawaan `undefined` eksplisit lewat `withDefaults`. Perilakunya
  tidak berubah; niatnya menjadi tertulis.

Catatan dari pengerjaan: seluruh temuan berasal dari refactor konsistensi
sehari sebelumnya. Lint tidak dijalankan di sela-sela refactor itu, sehingga
sembilan temuan menumpuk sekaligus.

Uraian temuan aslinya ada di riwayat git dokumen ini.

## P1 — Status bintang tidak nyata

Masalahnya sama persis dengan pin yang sudah diperbaiki: status disimpan
sebagai `ref` lokal per instance, sehingga tidak tersinkron dan hilang saat
pindah halaman.

Lima tempat menyimpan salinannya masing-masing:

| Berkas                               | Baris | Menyimpan            |
| ------------------------------------ | ----- | -------------------- |
| `app/components/MatchList.vue`       | 16    | bintang kompetisi    |
| `app/components/MatchRow.vue`        | 11    | bintang pertandingan |
| `app/components/MatchCardRow.vue`    | 7     | bintang pertandingan |
| `app/pages/pertandingan/[match].vue` | 60    | bintang dua tim      |
| `app/pages/tim/[team].vue`           | 73    | ikuti tim            |
| `app/pages/pemain/[player].vue`      | 87    | ikuti pemain         |

Akibat yang terlihat pengguna: membintangi pertandingan di beranda tidak
tampak di halaman liga; membintangi tim di halamannya tidak mengisi daftar
"Tim Saya" di sidebar, yang sampai sekarang masih memakai daftar statis
`followedTeams` di `app/layouts/default.vue`.

Rencana: satu composable `useFollowed()` bergaya `usePinnedLeagues()`, dengan
koleksi terpisah untuk kompetisi, pertandingan, tim, dan pemain. Sidebar "Tim
Saya" lalu diturunkan dari sana, bukan dari array statis.

## P2 — Kode mati

Hapus, jangan disambungkan. Tidak ada yang memanggilnya dan tidak ada rencana
konkret yang membutuhkannya.

| Berkas                          | Bukti                                           |
| ------------------------------- | ----------------------------------------------- |
| `app/services/api-client.ts`    | nol referensi di luar dirinya sendiri           |
| `app/plugins/vue-query.ts`      | nol referensi; plugin aktif tetapi tak terpakai |
| `app/components/ErrorState.vue` | nol referensi                                   |
| `app/components/ui/toggle/`     | hanya dirujuk berkasnya sendiri                 |

Catatan: `app/utils/api-error.ts` **tetap dipakai** oleh `ErrorState.vue` dan
punya test sendiri. Jika `ErrorState.vue` dihapus, `api-error.ts` ikut menjadi
yatim — putuskan keduanya bersamaan, jangan sebagian.

**Koreksi 2026-09-22.** Pertanyaan di atas sudah terjawab: integrasi API jadi
dikerjakan, dan rencananya ada di `docs/integration-api-plan.md`. Setelah
dibaca utuh, rangka itu bukan boilerplate kosong — di dalamnya sudah ada
keputusan matang soal sesi lewat cookie `HttpOnly`, kebijakan ulang-coba yang
sadar jenis galat, dan `AbortError` yang sengaja diteruskan agar pembatalan
permintaan tidak tertelan.

Karena itu `api-client.ts`, `vue-query.ts`, `ErrorState.vue`, dan
`api-error.ts` **dipertahankan**. Yang tetap boleh dihapus dari daftar di atas
hanya `app/components/ui/toggle/`.

## P3 — Lapisan data terkunci ke halaman

Setiap halaman mengimpor langsung dari `~/data/*`:

```
app/pages/index.vue            -> data/matches, data/leagues, data/news
app/pages/sepak-bola/[league]  -> data/leagues, data/matches
app/pages/tim/[team]           -> data/leagues, data/matches, data/teams
app/pages/pemain/[player]      -> data/leagues, data/teams
app/pages/negara/[country]     -> data/leagues, data/matches
app/pages/pertandingan/[match] -> data/leagues, data/matches, data/news
```

Selama datanya dummy ini tidak menyakitkan. Begitu sumber sungguhan masuk,
enam halaman harus diubah serentak, dan tiap halaman harus belajar menangani
status memuat serta gagal.

Rencana bertahap, tanpa abstraksi spekulatif:

1. Biarkan bentuk fungsi pencarinya tetap (`findLeague`, `matchesByTeam`, dan
   seterusnya). Itu sudah menjadi kontrak yang benar.
2. Saat API pertama benar-benar tersedia, ubah isi fungsi-fungsi tersebut,
   bukan halamannya.
3. Jangan bikin lapisan repository sekarang. Belum ada implementasi kedua,
   jadi belum ada yang perlu diabstraksi.

## P4 — Berkas yang mulai kebesaran

| Berkas                               | Baris | Catatan                                                                                              |
| ------------------------------------ | ----- | ---------------------------------------------------------------------------------------------------- |
| `app/data/teams.ts`                  | 629   | data dummy; besar itu wajar, tetapi profil pemain lengkap sebaiknya dipisah ke `app/data/players.ts` |
| `app/data/matches.ts`                | 476   | data dummy                                                                                           |
| `app/pages/pertandingan/[match].vue` | 342   | **bukan data** — seluruh isi tab ditulis inline dalam satu template                                  |
| `app/layouts/default.vue`            | 255   | sidebar, navigasi olahraga, dan footer dalam satu berkas                                             |
| `app/types/match.ts`                 | 232   | menampung tipe pertandingan, tim, pemain, liga, dan berita sekaligus                                 |

Usulan:

- `app/pages/pertandingan/[match].vue` — keluarkan isi tab H2H, Peluang, dan
  Susunan Pemain menjadi komponen tersendiri, sejajar dengan `MatchEvents`,
  `MatchStats`, dan `MatchInfo` yang sudah ada. Target di bawah 150 baris.
- `app/layouts/default.vue` — pisahkan `AppSidebar.vue` dan `AppFooter.vue`.
- `app/types/match.ts` — namanya sudah tidak jujur karena isinya bukan hanya
  pertandingan. Pecah menjadi `match.ts`, `team.ts`, `player.ts`, `league.ts`,
  atau setidaknya ganti nama menjadi `app/types/index.ts`.
- `app/data/teams.ts` — pindahkan `players` dan `findPlayer` ke
  `app/data/players.ts`. Berkasnya bernama teams tetapi separuh isinya pemain.

## P5 — Logika tanpa pengaman — SELESAI 2026-09-22

`test/unit/standings.test.ts` dibuat: 10 kasus, seluruhnya lolos. Tidak ada
framework tambahan dan tidak ada fixture eksternal.

`standingsByScope` — 6 kasus:

- `Keseluruhan` mengembalikan tabel musim apa adanya, diperiksa dengan `toBe`
  sehingga identitas referensinya ikut terkunci
- `Kandang` hanya menghitung laga kandang, `Tandang` hanya laga tandang
- Laga belum main diabaikan, dalam dua bentuk: berstatus `scheduled`, dan
  berstatus `finished` tetapi `score` masih `null`
- Tim di luar tabel musim dilewati tanpa melempar galat
- Poin sama dipecah oleh selisih gol, lalu oleh jumlah gol

Baris fixture sengaja diisi angka ngawur (`99` di semua kolom, form penuh).
Jika perhitungan ulang lupa menol-kan satu kolom, angka itu bocor dan test
langsung merah — lebih tajam daripada memulai dari nol.

`seasonProgress` — 4 kasus, memakai musim Agustus sampai Mei yang melewati
pergantian tahun: batas musim tidak lengkap, hari pembuka dan penutup,
kenaikan monotonik di dalam rentang 0..1, dan masa jeda antar-musim.

Dua catatan yang ditemukan saat menulis test, bukan saat membaca kode:

1. Tanggal sebelum pembukaan musim mengembalikan `1`, bukan `0`. Kodenya
   menggeser tanggal itu ke siklus berikutnya. Untuk bilah progres ini masuk
   akal — di luar musim bilahnya penuh, artinya musim selesai — jadi perilaku
   ini dikunci sebagai disengaja, bukan diperbaiki diam-diam.
2. `dayOfYear()` menganggap setiap bulan 31 hari. Hasilnya hampiran. Test
   tidak mengunci nilai desimal persis, hanya urutan dan batas, supaya
   perbaikan ketelitian di kemudian hari tidak memicu kegagalan palsu.

Sisa berkas logika yang belum tertutup: `app/utils/slug.ts` dan
`app/composables/usePinnedLeagues.ts`. Keduanya jauh lebih sederhana dan bisa
menyusul bersama P1.

## Catatan proses — E2E ikut rusak, ditemukan terlambat

Saat menyiapkan `docs/integration-api-plan.md`, `test/e2e/app.spec.ts` dibaca
dan ternyata refactor konsistensi 2026-09-21 merusaknya. Sudah diperbaiki pada
2026-09-22, tetapi sebabnya perlu dicatat.

Dua kerusakan nyata, keduanya akibat `PillTabs` menggantikan markup lama:

1. Deretan sub-tab di halaman pertandingan kehilangan `role="tab"`, karena
   `PillTabs` merender `<button>` polos. Empat asersi gagal.
2. Label filter beranda berubah dari `LIVE` menjadi `Live`. Huruf besarnya
   hanya efek CSS `uppercase`, sedangkan nama aksesibilitas diambil dari teks.

Perbaikannya di komponen, bukan di test: `PillTabs` kini punya dua semantik.
`variant="tabs"` memakai pola tabs ARIA lengkap — `role="tablist"`,
`role="tab"`, `aria-selected`, `aria-controls`, roving `tabindex`, dan
navigasi tombol panah — sementara `variant="filter"` yang menjadi bawaan
memakai `role="group"` dengan `aria-pressed`. Perbedaannya bukan gaya: tabs
menukar panel, filter menyempitkan satu daftar yang tetap di layar, dan
menandai filter sebagai `tablist` menyesatkan pembaca layar.

Karena `role="tab"` tanpa panel hanyalah tempelan, isi tab di
`app/pages/pertandingan/[match].vue` kini dibungkus `role="tabpanel"` dengan
id yang cocok. `app/utils/tabs.ts` menurunkan id tab dan panel dari stem yang
sama supaya keduanya tidak bisa melenceng.

Dua selector di `test/e2e/app.spec.ts` juga diketatkan, tetapi karena halamannya memang
bertambah isi, bukan karena testnya dilemahkan:

- `getByRole("heading", { name: "Liga Primer" })` cocok ke tiga elemen setelah
  tab Ringkasan memuat blok Jadwal dan Skor terkini, masing-masing dengan bar
  `Inggris: Liga Primer`. Ditambah `exact: true`.
- `getByText("Transfer")` cocok ke tiga elemen setelah halaman pemain memiliki
  tab Transfer, seksi Transfer, dan label tipe `TRANSFER`. Diganti menjadi
  asersi terhadap judul seksi.

Asersi `toHaveCount(7)` pada klasemen diperiksa ulang terhadap data — liga
primer berisi 6 tim, jadi header ditambah 6 memang 7 — dan tidak diubah.

**Pelajaran, berlaku untuk P1 dan P4:** `pnpm test:e2e` wajib dijalankan
setiap kali komponen bersama disentuh. `pnpm lint`, `pnpm typecheck`, dan
`pnpm build` semuanya hijau sepanjang refactor itu; tidak satupun bisa melihat
peran ARIA yang hilang atau nama aksesibilitas yang berubah. Hanya E2E yang
bisa.

## Urutan pengerjaan yang disarankan

1. ~~**P0** — kembalikan `pnpm lint` ke hijau.~~ Selesai 2026-09-22.
2. ~~**P5** — tulis test `standings.ts` sebelum menyentuh apapun di P1–P4.~~
   Selesai 2026-09-22. Jaring pengamannya sudah terpasang.
3. **P1** — satukan status bintang. **Berikutnya.** Ini satu-satunya temuan
   yang terlihat langsung oleh pengguna. Sekalian tutup `slug.ts` dan
   `usePinnedLeagues.ts` dengan test.
4. **P2** — hapus `app/components/ui/toggle/` saja. Sisa daftarnya dibatalkan,
   lihat koreksi di bagian P2.
5. **P4** — pecah berkas besar.
6. **P3** — tunda sampai API sungguhan ada. Menyentuhnya sekarang berarti
   membangun untuk kebutuhan yang belum terbukti. Rencananya sudah ada di
   `docs/integration-api-plan.md`.

Untuk langkah 3 sampai 5, jalankan empat gerbang sekaligus sebelum menyatakan
selesai: `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm test:e2e`.

## Yang sengaja tidak masuk rencana

- **Warna dan token tema** — sudah ditangani `docs/color-recommendation.md`,
  dan atas permintaan belum dikerjakan.
- **`source/`** — 30 MB, tetapi sudah di-gitignore dan tidak mengganggu repo.
- **`app/components/ui/`** — komponen bawaan shadcn-vue. Biarkan apa adanya
  supaya bisa disinkronkan ulang dengan hulunya, kecuali `toggle/` yang
  memang tidak dipakai.
- **Lapisan repository atau state management** — belum ada bukti kebutuhannya.
