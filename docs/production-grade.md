# Parameter Production Grade (Standar Ponytail)

Parameter produksi bukan dinilai dari seberapa canggih arsitekturnya, tapi dari seberapa sedikit kode yang bisa rusak. Proyek siap rilis jika kode di dalamnya sesedikit mungkin, sejelas mungkin, dan tidak memiliki beban masa depan.

## 1. YAGNI (You Aren't Gonna Need It)
- **Kriteria:** Tidak ada kode atau abstraksi yang dibuat "untuk jaga-jaga nanti butuh". 
- **Bukti di proyek:** `app/utils/form.ts` dan *parser* `fieldErrors` adalah abstraksi spekulatif yang membebani *codebase* karena sama sekali belum ada form atau komponen yang memakainya.

## 2. Stdlib & Native First
- **Kriteria:** Selalu pakai bawaan bahasa/platform (DOM, `Date`, `Intl`, CSS standar) alih-alih membuat fungsi matematika manual atau menambah dependensi baru.
- **Bukti di proyek:** `seasonProgress` membuat asumsi manual 31 hari per bulan. Native `Date().getTime()` jauh lebih akurat dan sudah tersedia gratis tanpa perlu logika kustom.

## 3. Don't Reinvent The Wheel (Gunakan yang Sudah Ada)
- **Kriteria:** Jika dependensi yang diinstal sudah menangani sesuatu yang kompleks (seperti ARIA *accessibility* dan navigasi *keyboard*), jangan direplikasi ulang secara manual.
- **Bukti di proyek:** Membangun `PillTabs.vue` dengan *event listener* `ArrowRight` manual, padahal sudah ada `<Tabs>` bawaan dari `shadcn-vue` (Radix/Reka UI) yang *accessible* secara native.

## 4. Zero Dead Code
- **Kriteria:** Utilitas, *interface*, atau fungsi yang tidak pernah di-import harus langsung dibuang.
- **Bukti di proyek:** 130 baris kode mati dan fungsi sisa (*orphaned*) yang cuma jadi beban *maintenance*.

## Kesimpulan
Proyek ini belum sepenuhnya "lean" (ramping). Jika sisa lemak (kode mati dan fitur buatan sendiri) ini dihapus, proyek ini baru pantas disebut *production grade*.
