# Bukti Pengujian API MongoDB

Simpan screenshot asli dari Postman pada folder ini. Jangan mengunggah screenshot yang belum benar-benar dijalankan.

## Daftar screenshot yang harus dikumpulkan

| Nama file | Pengujian | Hasil yang diharapkan |
|---|---|---|
| 01-server-connected.png | GET / | Informasi API tampil dan server tersambung ke MongoDB |
| 02-create-cinema.png | POST /cinemas | HTTP 201, cinema berhasil dibuat |
| 03-list-cinemas.png | GET /cinemas | Daftar cinema tampil |
| 04-create-movie-embedding-reference.png | POST /movies | HTTP 201, pemeran tersimpan dan cinema terhubung |
| 05-get-movies-populate.png | GET /movies | Data cinema tampil sebagai objek hasil populate |
| 06-filtering.png | GET /movies?genre=Drama&ratingUsia=13+ | Hanya film yang sesuai filter |
| 07-pagination.png | GET /movies?page=1&limit=2 | Maksimal dua film dan metadata pagination |
| 08-sorting.png | GET /movies?sortBy=judul&order=asc | Judul film urut A-Z |
| 09-projection.png | GET /movies?fields=judul,genre,durasiMenit | Hanya field yang diminta tampil |
| 10-get-movie-detail.png | GET /movies/:id | Detail film beserta cinema |
| 11-update-movie.png | PUT /movies/:id | HTTP 200, data berubah |
| 12-delete-movie.png | DELETE /movies/:id | HTTP 200, data terhapus |
| 13-validation-error.png | POST /movies dengan body tidak lengkap | HTTP 400 |
| 14-api-key-error.png | POST /cinemas tanpa x-api-key | HTTP 401 |

## Catatan

1. Pastikan screenshot memperlihatkan URL, method, status HTTP, dan response body.
2. Gunakan data yang benar-benar dikembalikan oleh server.
3. Simpan semua screenshot PNG pada folder `docs/evidence/` atau folder ini.
4. Jangan menaruh file `.env`, password, atau MongoDB connection string berisi kredensial ke GitHub.
