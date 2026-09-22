# Rekomendasi Tema Warna

Status: usulan, belum diterapkan.
Sumber tema saat ini: `app/assets/css/main.css`.

## 1. Tema saat ini

| Token                 | Light     | Dark      | Catatan                               |
| --------------------- | --------- | --------- | ------------------------------------- |
| `--background`        | `#FFFFFF` | `#0A0A0A` |                                       |
| `--foreground`        | `#0A0A0A` | `#FAFAFA` |                                       |
| `--primary`           | `#DF212A` | `#DF212A` | merah, sama di kedua mode             |
| `--destructive`       | `#E7000B` | `#FF6467` |                                       |
| `--muted`             | `#F5F5F5` | `#262626` |                                       |
| `--muted-foreground`  | `#737373` | `#A1A1A1` |                                       |
| `--border`            | `#E5E5E5` | putih 10% | dark memakai alpha, bukan putih solid |
| `--accent`            | `#F5F5F5` | `#262626` |                                       |
| `--secondary`         | `#F5F5F5` | `#262626` |                                       |
| `--header`            | `#061B22` | `#040F13` | navy gelap                            |
| `--header-foreground` | `#FFFFFF` | `#FAFAFA` |                                       |
| `--league-header`     | `#E6F4FE` | `#1E282F` | biru tipis, penanda baris kompetisi   |
| `--sidebar`           | `#FAFAFA` | `#171717` |                                       |
| `--sidebar-primary`   | `#171717` | `#1447E6` |                                       |
| `--radius`            | `0.25rem` |           | sudut tajam                           |

Tipografi: Inter (UI), Manrope (judul), Barlow Condensed (angka skor).

## 2. Masalah yang ditemukan

### 2.1 Warna brand bertabrakan dengan warna kekalahan

`--primary` `#DF212A` dan `--destructive` `#E7000B` praktis merah yang sama.
Di aplikasi ini keduanya punya arti berbeda:

- `--primary` — brand, tautan, tab aktif, menit pertandingan berjalan
- `--destructive` — badge kalah (K), zona degradasi

Akibatnya "pertandingan sedang berlangsung" dan "tim kalah" terbaca identik.

### 2.2 Warna mentah di luar kendali tema

19 pemakaian kelas warna Tailwind langsung, 13 varian berbeda, tidak satupun
lewat token:

| Warna              | Jumlah |
| ------------------ | ------ |
| `text-emerald-600` | 3      |
| `bg-amber-500`     | 3      |
| `text-sky-600`     | 2      |
| `bg-sky-700`       | 2      |
| `bg-rose-800`      | 2      |
| `bg-emerald-600`   | 2      |
| `bg-violet-600`    | 1      |
| `bg-slate-700`     | 1      |
| `bg-slate-600`     | 1      |
| `bg-sky-600`       | 1      |
| `bg-rose-600`      | 1      |
| `bg-emerald-500`   | 1      |
| `bg-amber-400`     | 1      |

Makna yang sama dipakai dengan nilai berbeda: menang memakai `emerald-500`,
`emerald-600`, dan `text-emerald-600`; pin memakai `sky-600` dan `sky-700`.
Mengganti isi `main.css` tidak akan menyentuh satupun dari 19 titik ini.

### 2.3 Sisa bawaan shadcn

`--sidebar-primary` pada mode dark bernilai `#1447E6` (biru), bentrok dengan
brand merah. Ini nilai bawaan template, bukan keputusan desain.

### 2.4 Seri grafik tidak terbedakan

`--chart-1` sampai `--chart-5` seluruhnya abu tanpa kroma. Belum ada grafik di
aplikasi, tetapi begitu ada, kelima serinya tidak akan bisa dibedakan.

## 3. Prinsip

Aplikasi skor butuh tiga warna status yang tidak boleh saling tabrak: hijau
untuk menang, kuning untuk seri, merah untuk kalah. Jika warna brand juga
merah, merah menanggung dua makna sekaligus dan kehilangan ketegasannya.

Karena itu warna brand sebaiknya berada di luar rumpun merah, kuning, dan
hijau. Header navy `#061B22` yang sudah dipakai mendukung arah biru.

## 4. Opsi palet

### Opsi B — Midnight (rekomendasi)

Brand pindah ke biru, merah dibebaskan sepenuhnya untuk makna negatif.

| Token             | Hex       | oklch           | Dipakai untuk                 |
| ----------------- | --------- | --------------- | ----------------------------- |
| `--primary`       | `#0077C7` | `0.55 0.16 245` | brand, tautan, tab aktif, pin |
| `--live`          | `#FA5D36` | `0.68 0.20 35`  | menit berjalan, badge live    |
| `--win`           | `#2E9E52` | `0.62 0.15 150` | badge M, form menang          |
| `--draw`          | `#DFA11A` | `0.75 0.15 80`  | badge S                       |
| `--loss`          | `#DF202E` | `0.58 0.22 25`  | badge K, zona degradasi       |
| `--header`        | `#061B22` | `0.21 0.03 220` | tetap                         |
| `--league-header` | `#E6F4FE` | `0.96 0.02 240` | tetap                         |

Kelebihan: header navy yang sudah ada langsung selaras; setiap status punya
satu warna sendiri.

### Opsi A — Pitch

Brand hijau lapangan, live jingga.

| Token             | Hex       | oklch           |
| ----------------- | --------- | --------------- |
| `--primary`       | `#008140` | `0.52 0.15 155` |
| `--live`          | `#F47600` | `0.70 0.19 55`  |
| `--win`           | `#2E9E52` | `0.62 0.15 150` |
| `--draw`          | `#DFA11A` | `0.75 0.15 80`  |
| `--loss`          | `#DF202E` | `0.58 0.22 25`  |
| `--header`        | `#072014` | `0.22 0.04 160` |
| `--league-header` | `#E8F6EC` | `0.96 0.02 155` |

Kelebihan: paling kuat nuansa sepak bolanya.
Risiko: brand `#008140` berdekatan dengan hijau menang `#2E9E52`; jarak
terangnya harus dijaga agar badge menang tidak terbaca sebagai elemen brand.

### Opsi C — Kick

Perubahan paling kecil. Brand tetap merah, kekalahan digeser ke maroon.

| Token             | Hex       | oklch           |
| ----------------- | --------- | --------------- |
| `--primary`       | `#DF212A` | `0.58 0.22 26`  |
| `--live`          | `#DF212A` | `0.58 0.22 26`  |
| `--win`           | `#2E9E52` | `0.62 0.15 150` |
| `--draw`          | `#DFA11A` | `0.75 0.15 80`  |
| `--loss`          | `#9E122B` | `0.45 0.17 20`  |
| `--header`        | `#061B22` | `0.21 0.03 220` |
| `--league-header` | `#E6F4FE` | `0.96 0.02 240` |

Kelebihan: identitas tidak berubah, tabrakan selesai.
Kekurangan: merah masih menanggung dua makna, hanya dibedakan oleh terang.

## 5. Langkah penerapan

Berlaku untuk opsi manapun.

1. Tambahkan token semantik di `app/assets/css/main.css`, pada `:root` dan
   `.dark`, lalu daftarkan di blok `@theme inline`:
   `--win`, `--draw`, `--loss`, `--live`,
   `--zone-champions`, `--zone-europa`, `--zone-relegation`.
2. Tarik 19 pemakaian warna mentah ke token tersebut. Titik sentuhnya sedikit
   karena komponen sudah dikonsolidasi sebelumnya:
   - `app/components/ResultBadge.vue` — menang, seri, kalah
   - `app/components/RatingBadge.vue` — ambang nilai
   - `app/components/StandingsTable.vue` — warna zona peringkat
   - `app/components/MatchRow.vue` — status live
   - `app/components/CountryChip.vue` — palet bendera pengganti
   - `app/components/TransferTable.vue`, `PlayerTransfers.vue` — arah masuk dan keluar
   - `app/components/PlayerInjuries.vue` — penanda cedera
3. Perbaiki `--sidebar-primary` mode dark agar mengikuti brand.
4. Beri `--chart-1` sampai `--chart-5` kroma yang berbeda sebelum grafik pertama dibuat.

Setelah langkah 2 selesai, mengganti tema cukup menyentuh satu berkas.
