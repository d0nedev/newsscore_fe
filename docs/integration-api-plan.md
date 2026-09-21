# Rencana Integrasi API

Status: rencana, belum dikerjakan.
Dasar: pemindaian repo pada 2026-09-21.

## 1. Batasan yang menentukan segalanya

`nuxt.config.ts`:

```ts
ssr: false,
nitro: { preset: "static" },
```

Aplikasi ini **SPA murni yang di-deploy sebagai berkas statis**. Tidak ada
runtime server milik sendiri. Konsekuensinya mengikat, dan harus diputuskan di
awal karena mengubahnya berarti mengubah cara deploy:

- **Tidak ada BFF / proxy.** Tidak bisa menaruh `server/api/*` sebagai perantara
  ke API Go. Browser memanggil API Go secara langsung, lintas origin.
- **Tidak ada pengambilan data saat render server.** Tidak perlu memikirkan
  dehidrasi state TanStack Query maupun penerusan cookie di sisi server. Ini
  justru menyederhanakan banyak hal.
- **Tidak ada tempat menyembunyikan rahasia.** Semua yang dikirim ke browser
  bersifat publik. Tidak boleh ada API key di berkas `.env` frontend.
- **`apiBaseUrl` dipanggang saat build.** `runtimeConfig.public.apiBaseUrl`
  pada preset statis tidak bisa diubah setelah build; satu build untuk satu
  lingkungan. README sudah mencatat ini:
  `NUXT_PUBLIC_API_BASE_URL=https://api.example.com pnpm build`.

Jika salah satu konsekuensi di atas tidak bisa diterima, keputusannya bukan
soal frontend, melainkan mengganti preset ke `node-server` dan memakai
`ssr: true`. Putuskan itu **sebelum** mulai menulis service.

## 2. Yang sudah ada

Rangkanya sudah berdiri dan keputusan pentingnya sudah diambil. Tidak ada yang
perlu dibangun ulang.

| Berkas | Isi | Layak dipakai? |
| --- | --- | --- |
| `app/services/api-client.ts` | `apiFetch<T>()` — satu pintu ke API, memasang `baseURL`, `credentials: "include"`, `retry: 0` | ya |
| `app/utils/api-error.ts` | kelas `ApiError`, `toApiError()`, `errorMessage()`; 8 jenis galat dipetakan dari status HTTP | ya |
| `app/types/api.ts` | `ApiResponse<T>`, `CursorPage<T>`, `ApiErrorBody` | ya |
| `app/plugins/vue-query.ts` | `QueryClient` dengan `staleTime` 30 detik dan kebijakan ulang-coba yang sadar `ApiError` | ya |
| `app/components/ErrorState.vue` | tampilan galat + tombol coba lagi, memakai `errorMessage()` | ya |
| `@tanstack/vue-query`, `zod` | sudah terpasang sebagai dependensi | ya |

Keputusan yang sudah tertanam di dalamnya, jangan diubah tanpa alasan:

- Sesi disimpan di cookie `HttpOnly` yang dipasang API Go. JavaScript tidak
  pernah menyentuh token. Ini lebih aman daripada menyimpan token di
  `localStorage`, yang bisa dibaca skrip apa pun yang berhasil masuk halaman.
- Ulang-coba hanya untuk galat `network` dan `server`. Galat 4xx tidak
  diulang karena akan gagal lagi dengan hasil sama.
- `toApiError()` meneruskan `AbortError` apa adanya supaya pembatalan
  permintaan oleh TanStack Query tidak tertelan.
- Log galat tidak pernah memuat badan permintaan, karena bisa berisi kredensial.

> Koreksi untuk `docs/refactor-plan.md` bagian P2: di sana
> `api-client.ts`, `vue-query.ts`, dan `ErrorState.vue` diusulkan dihapus
> sebagai kode mati. Usul itu berlaku hanya jika integrasi API tidak jadi
> dikerjakan. Karena sekarang jadi, **ketiganya dipertahankan.** Yang tetap
> boleh dihapus hanya `app/components/ui/toggle/`.

## 3. Yang belum ada

Tidak ada satu pun halaman yang memanggil `apiFetch`. Enam halaman mengimpor
langsung dari `~/data/*`, yang isinya data dummy tulisan tangan.

## 4. Sambungannya: pertahankan fungsi pencari

Titik sambung sudah tersedia dan bentuknya sudah benar. Setiap halaman
memanggil fungsi pencari, bukan struktur data mentah:

```
findLeague(id)          findMatch(id)           matchesByLeague(id)
findTeam(id)            matchesByTeam(id)       matchesByDate(date)
findPlayer(id)          findCountry(slug)       competitionsByCountry(country)
```

**Aturan intinya: ganti isi fungsi-fungsi ini, jangan ganti halamannya.**

Halaman tidak perlu tahu datanya datang dari array di memori atau dari jaringan.
Yang berubah hanyalah nilai kembaliannya: dari nilai langsung menjadi hasil
kueri yang punya status memuat dan gagal.

Karena itu jangan membuat lapisan *repository* sekarang. Belum ada implementasi
kedua yang nyata, jadi belum ada yang perlu diabstraksi. Fungsi pencari sudah
menjadi abstraksinya.

## 5. Bentuk tiap lapisan

```
halaman  ->  composable kueri  ->  service  ->  apiFetch  ->  API Go
   ^              ^                   ^
   |              |                   +-- validasi zod, pemetaan ke tipe UI
   |              +-- TanStack Query: cache, ulang-coba, status
   +-- tampilkan data / memuat / galat
```

### 5.1 Service — satu berkas per sumber daya

`app/services/leagues.ts`, `matches.ts`, `teams.ts`, `players.ts`.

Tugasnya hanya dua: memanggil `apiFetch`, lalu **memetakan bentuk API ke tipe
UI** di `app/types/`.

Jangan biarkan bentuk JSON API bocor ke komponen. Kalau API mengirim
`{ "home_team": { "short_name": "CHE" } }` sementara komponen memakai
`match.home.badge`, pemetaannya berhenti di service. Kalau tidak, setiap
perubahan nama field di backend menyebar ke lusinan berkas `.vue`.

Validasi dengan zod di batas ini, bukan di dalam komponen. `zod` sudah menjadi
dependensi dan sudah dipakai di `app/utils/form.ts`, jadi tidak ada penambahan.
Skema zod sekaligus menjadi dokumentasi kontrak API yang bisa dieksekusi:
kalau backend diam-diam mengubah bentuk, yang gagal adalah satu tempat dengan
pesan jelas, bukan komponen acak dengan `undefined`.

### 5.2 Composable kueri — satu per pemakaian

`app/composables/useLeague.ts`, `useMatchesByDate.ts`, dan seterusnya.

Isinya `useQuery` dengan kunci cache yang stabil:

```ts
queryKey: ["matches", "byDate", date]
```

Kunci harus memuat setiap variabel yang memengaruhi hasil. Kunci yang salah
menyebabkan halaman menampilkan data tanggal lain — kesalahan yang tampak
seperti bug backend padahal bukan.

### 5.3 Halaman — tiga keadaan, bukan satu

Setiap halaman yang sekarang menganggap data selalu ada harus menangani
memuat, gagal, dan kosong. Pola "tidak ditemukan" sudah seragam lewat
`NotFoundCard.vue`, dan galat lewat `ErrorState.vue`.

Bedakan dua hal yang mudah tertukar: **belum ada data** dan **gagal mengambil
data**. Yang pertama pesan biasa, yang kedua harus menawarkan tombol coba lagi.

## 6. Hal teknis yang harus disepakati dengan backend

### 6.1 CORS dan cookie lintas origin

Ini yang paling sering menggagalkan integrasi pertama. Karena frontend statis
memanggil API Go langsung dan memakai `credentials: "include"`, API **harus**:

- Mengirim `Access-Control-Allow-Origin` berisi origin frontend secara
  eksplisit. Nilai `*` **dilarang** bersamaan dengan kredensial dan akan
  ditolak browser.
- Mengirim `Access-Control-Allow-Credentials: true`.
- Menjawab permintaan `OPTIONS` (preflight).
- Memasang cookie sesi dengan `Secure` dan `SameSite=None` jika domainnya
  berbeda dari frontend. Tanpa itu cookie tidak akan terkirim.

Jalan yang lebih mudah: letakkan API di subdomain yang sama, misalnya
`app.example.com` dan `api.example.com`, lalu pakai `SameSite=Lax` dengan
`Domain=.example.com`. Ini menghilangkan sebagian besar kerumitan di atas.

### 6.2 Header yang sudah diharapkan frontend

`toApiError()` membaca `x-request-id` dari respons dan menyimpannya di
`ApiError.requestId`. Minta backend selalu mengirimkannya — itu yang
menyambungkan keluhan pengguna dengan log server.

Badan galat harus mengikuti `ApiErrorBody`:

```json
{ "error": { "code": "...", "message": "...", "details": { "field": "pesan" } } }
```

`details` hanya dibaca untuk galat validasi, dan hanya nilai bertipe string
yang diambil.

### 6.3 Skor langsung butuh kebijakan berbeda

`staleTime` bawaan 30 detik cocok untuk klasemen dan profil tim, tetapi
**tidak** untuk pertandingan berjalan. Kueri pertandingan live perlu
`refetchInterval` sendiri, sekitar 15–30 detik, dan sebaiknya berhenti saat tab
tidak aktif agar tidak membakar kuota.

Jangan menaikkan frekuensi global. Naikkan hanya pada kueri yang memang live.

Jika nanti volumenya besar, polling sebaiknya diganti SSE atau WebSocket. Itu
keputusan terpisah dan jangan dirancang sekarang sebelum polling terbukti
kurang.

### 6.4 Halaman berhalaman

`CursorPage<T>` di `app/types/api.ts` sudah menyiapkan kursor, dengan catatan
tegas: kursor bersifat buram, jangan pernah diurai, cukup dikirim balik.
Pakai `useInfiniteQuery` untuk daftar panjang seperti arsip dan riwayat
transfer. Tombol "Tampilkan lainnya" yang sekarang memakai `slice()` lokal
adalah tempat alaminya.

## 7. Urutan pengerjaan

Kerjakan **satu sumber daya sampai tuntas** lebih dulu, jangan semua sekaligus.

**Tahap 0 — sepakati kontrak.** Bentuk JSON, aturan CORS, format galat,
`x-request-id`. Tanpa ini tahap berikutnya akan ditulis dua kali.

**Tahap 1 — satu irisan vertikal.** Pilih klasemen liga, karena paling
sederhana: satu permintaan, tanpa live, dan sudah ada tes unitnya.
Buat `app/services/leagues.ts`, skema zod-nya, `useLeague()`, lalu sambungkan
hanya `app/pages/sepak-bola/[league].vue`. Halaman lain tetap memakai data
dummy. Di titik ini semua kerumitan nyata — CORS, cookie, bentuk galat —
sudah ketahuan dengan biaya paling murah.

**Tahap 2 — pertandingan.** Yang paling banyak dipakai dan satu-satunya yang
butuh pembaruan berkala. Selesaikan `refetchInterval` di sini.

**Tahap 3 — tim dan pemain.**

**Tahap 4 — bersih-bersih.** Setelah tidak ada lagi yang mengimpor `~/data/*`,
pindahkan berkas data dummy ke `test/fixtures/` supaya tetap berguna bagi tes,
lalu hapus dari `app/`.

Sepanjang tahap 1–3 data dummy dan API hidup berdampingan. Itu disengaja:
setiap tahap bisa di-deploy, dan tidak ada momen ketika seluruh aplikasi rusak
bersamaan.

## 8. Dampak ke pengujian

- **Tes unit** tidak terpengaruh. `app/utils/standings.ts` menghitung dari
  objek biasa, bukan dari jaringan, jadi `test/unit/standings.test.ts` tetap
  berlaku. Ini keuntungan dari memisahkan perhitungan dari pengambilan data,
  dan sebaiknya dipertahankan: jangan pindahkan logika hitung ke dalam service.
- **Tes E2E** akan terpengaruh besar. `test/e2e/serve.mjs` hanya melayani
  berkas statis; begitu halaman butuh API, Playwright harus memalsukan jaringan
  dengan `page.route()`, atau memakai server API palsu. Sediakan berkas respons
  contoh di `test/fixtures/` — inilah gunanya data dummy yang dipindahkan di
  tahap 4.
- Tambahkan tes untuk pemeta di service: satu contoh respons API masuk, satu
  objek tipe UI keluar. Murah, dan menangkap perubahan bentuk dari backend.

## 9. Yang sebaiknya tidak dilakukan

- **Jangan** membuat lapisan repository atau pola *store* global sebelum ada
  kebutuhan nyata. TanStack Query sudah menjadi cache server-state; menaruh
  Pinia di atasnya berarti dua sumber kebenaran untuk data yang sama.
- **Jangan** menyimpan token di `localStorage`. Keputusan cookie `HttpOnly`
  sudah diambil dan itu pilihan yang lebih aman.
- **Jangan** memanggil `$fetch` langsung dari komponen. Semua lewat
  `apiFetch`, supaya penanganan galat dan kredensial hanya ada di satu tempat.
- **Jangan** membiarkan bentuk JSON API dipakai langsung sebagai tipe komponen.
- **Jangan** menyambungkan enam halaman sekaligus dalam satu perubahan besar.
