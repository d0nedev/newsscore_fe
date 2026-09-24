# Desain Kontrak API (Backend) - NewsScore

Berdasarkan arsitektur *frontend* dan tipe data yang sudah ada, aplikasi mengadopsi standar respons pembungkus (wrapper) berupa `ApiResponse<T>` untuk data tunggal dan `CursorPage<T>` untuk data yang di-pavinasi dengan *cursor*. Berikut adalah daftar *endpoint* REST API yang perlu dibangun di sisi backend, termasuk fitur autentikasi dan personalisasi Pin.

---

## Standar Format Respons

**1. Sukses (Data Tunggal)**
```json
{
  "data": { ... }
}
```

**2. Sukses (Koleksi / Pagination)**
```json
{
  "data": [ ... ],
  "meta": {
    "nextCursor": "string_cursor_atau_null"
  }
}
```

---

## Daftar Endpoint API

### 0. Autentikasi & Personalisasi (Pin)
Karena data *pin* disimpan di server, kita memerlukan mekanisme akun pengguna.

**`POST /api/v1/auth/login`**
*   **Request Body:** `{ "email": "...", "password": "..." }`
*   **Response:** `{ "data": { "token": "jwt_token_here", "user": { ... } } }`

**`GET /api/v1/me/pins`**
*   **Fungsi:** Mengambil semua daftar id liga, tim, dan negara yang di-pin oleh user yang sedang *login*.
*   **Header:** `Authorization: Bearer <token>`
*   **Response:** 
    ```json
    {
      "data": {
        "pinnedLeagues": ["uuid-liga-1", "uuid-liga-2"],
        "pinnedTeams": ["uuid-tim-1"],
        "pinnedCountries": ["uuid-negara-1"]
      }
    }
    ```

**`POST /api/v1/me/pins/:type`**
*   **Fungsi:** Menambahkan pin baru. Parameter `:type` bisa diisi `leagues`, `teams`, atau `countries`.
*   **Request Body:** `{ "id": "uuid-dari-entity-yang-dipin" }`
*   **Response:** `{ "data": { "success": true } }`

**`DELETE /api/v1/me/pins/:type/:id`**
*   **Fungsi:** Menghapus pin.

---

*(Sisa Endpoint Tetap Sama)*

### 1. Pertandingan (Matches)
*   `GET /api/v1/matches` - Daftar pertandingan (opsional filter `date`, `leagueId`, `status`).
*   `GET /api/v1/matches/:id` - Detail lengkap satu pertandingan.

### 2. Liga (Leagues) & Klasemen
*   `GET /api/v1/leagues` - Daftar liga.
*   `GET /api/v1/leagues/:id` - Detail liga, termasuk `standings` dan `archive`.

### 3. Tim (Teams)
*   `GET /api/v1/teams/:id` - Profil tim, termasuk `squad` dan `transfers`. (Tim Nasional memiliki pola yang sama, hanya ditandai dengan flag `is_national_team = true` di database).

### 4. Pemain (Players)
*   `GET /api/v1/players/:id` - Profil pemain, karier, log laga terbaru.

### 5. Berita (News)
*   `GET /api/v1/news` - Daftar artikel berita.
*   `GET /api/v1/news/:id` - Detail artikel berita.
