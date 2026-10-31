# Panduan Menjalankan dan Menguji Tugas MongoDB

## 1. Persiapan

- Instal Node.js LTS.
- Instal MongoDB Community Server secara lokal atau buat cluster MongoDB Atlas.
- Buka repository ini di VS Code.

## 2. Instal dependency

Jalankan pada terminal di folder project:

```bash
npm install
```

Perintah ini memasang dependency termasuk Mongoose dan menyelaraskan `package-lock.json`.

## 3. Konfigurasi environment

Salin `.env.example` menjadi `.env`, kemudian sesuaikan:

```env
PORT=3000
API_KEY=buat-kunci-rahasia-sendiri
CORS_ORIGIN=http://localhost:5173
DB_URI=mongodb://127.0.0.1:27017/paw2_bioskop
```

Jika memakai MongoDB Atlas, ganti DB_URI dengan connection string dari Atlas. Jangan commit file .env.

## 4. Jalankan MongoDB

Pastikan layanan MongoDB aktif. Jika menggunakan Atlas, pastikan IP address komputer diizinkan pada Network Access dan database user sudah dibuat.

## 5. Isi data awal

```bash
npm run seed
```

Seed akan menghapus data pada koleksi movies dan cinemas dalam database yang ditentukan, lalu membuat 2 cinema dan 3 film contoh. Gunakan hanya untuk database tugas/pengujian.

## 6. Jalankan API

```bash
npm run dev
```

Buka `http://localhost:3000/`. Pastikan terminal menampilkan pesan MongoDB terhubung dan server berjalan.

## 7. Pengujian Postman

Semua endpoint GET dapat diuji tanpa API key. Endpoint POST, PUT, DELETE membutuhkan header:

```
x-api-key: nilai API_KEY pada file .env
```

### Membuat cinema

`POST http://localhost:3000/cinemas`

```json
{
  "nama": "Cinema Test",
  "lokasi": "Palembang",
  "alamat": "Jl. Contoh No. 1, Palembang",
  "fasilitas": ["Regular", "Parking"]
}
```

Salin nilai `data._id` dari response. Gunakan sebagai `cinemaId` saat membuat film.

### Membuat film (embedding + referencing)

`POST http://localhost:3000/movies`

```json
{
  "judul": "Film Uji MongoDB",
  "genre": "Drama",
  "durasiMenit": 120,
  "ratingUsia": "13+",
  "sutradara": "Nama Sutradara",
  "cinemaId": "GANTI_DENGAN_ID_CINEMA",
  "pemeran": [
    { "nama": "Aktor Pertama", "peran": "Tokoh A" },
    { "nama": "Aktris Kedua", "peran": "Tokoh B" }
  ]
}
```

### Endpoint utama dan query

| Fitur | URL |
|---|---|
| Semua film | `GET /movies` |
| Filter genre | `GET /movies?genre=Drama` |
| Filter rating | `GET /movies?ratingUsia=13+` |
| Cari judul/sutradara | `GET /movies?search=senja` |
| Rentang durasi | `GET /movies?minDurasi=90&maxDurasi=130` |
| Pagination | `GET /movies?page=1&limit=2` |
| Sorting A-Z | `GET /movies?sortBy=judul&order=asc` |
| Sorting durasi terlama | `GET /movies?sortBy=durasiMenit&order=desc` |
| Projection | `GET /movies?fields=judul,genre,durasiMenit` |
| Gabungan fitur | `GET /movies?genre=Drama&page=1&limit=5&sortBy=judul&order=asc&fields=judul,genre,cinema` |

### Operasi data lainnya

- `GET /movies/:id`
- `PUT /movies/:id` (body mengikuti format create movie)
- `DELETE /movies/:id`
- `GET /cinemas`
- `GET /cinemas/:id`
- `PUT /cinemas/:id`
- `DELETE /cinemas/:id`

Cinema yang masih direferensikan film tidak dapat dihapus (HTTP 409).

## 8. Screenshot

Ikuti daftar pada [BUKTI-PENGUJIAN.md](./BUKTI-PENGUJIAN.md). Screenshot harus berasal dari pengujian yang benar-benar dilakukan pada komputer sendiri.

## 9. Upload ke GitHub

Setelah semua pengujian berhasil dan screenshot sudah disimpan:

```bash
git status
git add .
git commit -m "feat: integrate MongoDB with embedded and referenced schemas"
git push origin main
```

Jika kamu sedang berada di branch lain, cek dengan `git branch` sebelum push. Jangan pernah mengunggah file .env.
