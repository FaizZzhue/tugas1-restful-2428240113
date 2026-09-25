// Import Express
// Inisialisasi aplikasi Express
// Port server
	const express = require("express");
	const app = express();
	const PORT = process.env.PORT || 3000;

// Middleware untuk membaca JSON request body
	app.use(express.json());

// Data film awal
// Data disimpan di memory sesuai instruksi tugas
let movies = [
	{
		id: 1,
		judul: "Jejak Senja",
		genre: "Drama",
		durasiMenit: 118,
		ratingUsia: "13+",
		sutradara: "Arif Wibowo",
	},
	{
		id: 2,
		judul: "Malam Terakhir",
		genre: "Thriller",
		durasiMenit: 105,
		ratingUsia: "17+",
		sutradara: "Raka Pratama",
	},
	{
		id: 3,
		judul: "Petualangan Langit",
		genre: "Adventure",
		durasiMenit: 125,
		ratingUsia: "SU",
		sutradara: "Dimas Saputra",
	},
];

// ID berikutnya
let nextId = 4;

// ======================================================
// GET /
// Informasi API
// ======================================================

app.get("/", (req, res) => {
	res.status(200).json({
		nama: "Achmad Faiz Yudha Ramadhan",
		npm: "2428240113",
		topik: 9,
		topikNama: "Bioskop - Film",
		resource: "/movies",
		endpoints: [
			"GET /movies",
			"GET /movies/:id",
			"GET /movies?genre=Drama",
			"POST /movies",
			"PUT /movies/:id",
			"DELETE /movies/:id",
		],
	});
});

// ======================================================
// GET /movies
// Ambil semua film
// ======================================================

app.get("/movies", (req, res) => {
	const { genre } = req.query;

	// Filter berdasarkan genre
	if (genre) {
		const hasil = movies.filter(
			(movie) => movie.genre.toLowerCase() === genre.toLowerCase()
		);

		return res.status(200).json(hasil);
	}

	// Jika tidak ada filter
	res.status(200).json(movies);
});

// ======================================================
// GET /movies/:id
// Ambil satu film berdasarkan ID
// ======================================================

app.get("/movies/:id", (req, res) => {
	const id = parseInt(req.params.id);

	const movie = movies.find((movie) => movie.id === id);

	if (!movie) {
		return res.status(404).json({
			status: "error",
			message: `Data dengan id ${id} tidak ditemukan`,
			data: null,
		});
	}

	res.status(200).json(movie);
});

// ======================================================
// POST /movies
// Tambah film baru
//
// Body:
// {
//   "judul": "Film Baru",
//   "genre": "Comedy",
//   "durasiMenit": 110,
//   "ratingUsia": "SU",
//   "sutradara": "Budi Santoso"
// }
// ======================================================

app.post("/movies", (req, res) => {
	const {judul, genre, durasiMenit, ratingUsia, sutradara} = req.body;

  // Validasi field wajib
	if (!judul || !genre || durasiMenit === undefined || !ratingUsia) {
		return res.status(400).json({
			status: "error",
			message:"Field judul, genre, durasiMenit, dan ratingUsia wajib diisi",
			data: null,
		});
	}

  // Validasi durasi
	if (typeof durasiMenit !== "number") {
		return res.status(400).json({
			status: "error",
			message: "durasiMenit harus berupa number",
			data: null,
		});
	}

  // Validasi rating usia
	const ratingValid = ["SU", "13+", "17+", "21+"];

	if (!ratingValid.includes(ratingUsia)) {
		return res.status(400).json({
			status: "error",
			message: "ratingUsia harus SU, 13+, 17+, atau 21+",
			data: null,
		});
	}

  // Membuat data baru
	const movieBaru = {
		id: nextId++,
		judul,
		genre,
		durasiMenit,
		ratingUsia,
		sutradara: sutradara || "",
	};

	movies.push(movieBaru);

	res.status(201).json({
		status: "success",
		message: "Data film berhasil ditambahkan",
		data: movieBaru,
	});
});

// ======================================================
// PUT /movies/:id
// Mengubah seluruh data film
//
// Body:
// {
//   "judul": "Film Baru",
//   "genre": "Drama",
//   "durasiMenit": 120,
//   "ratingUsia": "13+",
//   "sutradara": "Budi Santoso"
// }
// ======================================================

app.put("/movies/:id", (req, res) => {
	const id = parseInt(req.params.id);

	const index = movies.findIndex((movie) => movie.id === id);

  // Jika ID tidak ditemukan
	if (index === -1) {
		return res.status(404).json({
			status: "error",
			message: `Data dengan id ${id} tidak ditemukan`,
			data: null,
		});
	}

  	const {judul, genre, durasiMenit, ratingUsia, sutradara} = req.body;

  // Validasi field wajib
	if (!judul || !genre || durasiMenit === undefined || !ratingUsia) {
		return res.status(400).json({
			status: "error",
			message: "Field judul, genre, durasiMenit, dan ratingUsia wajib diisi",
			data: null,
		});
	}

  // Validasi durasi
	if (typeof durasiMenit !== "number") {
		return res.status(400).json({
			status: "error",
			message: "durasiMenit harus berupa number",
			data: null,
		});
	}

  // Validasi rating usia
	const ratingValid = ["SU", "13+", "17+", "21+"];

	if (!ratingValid.includes(ratingUsia)) {
		return res.status(400).json({
			status: "error",
			message: "ratingUsia harus SU, 13+, 17+, atau 21+",
			data: null,
		});
	}

  // Penggantian seluruh data
	const movieUpdated = {
		id,
		judul,
		genre,
		durasiMenit,
		ratingUsia,
		sutradara: sutradara || "",
	};

	movies[index] = movieUpdated;

	res.status(200).json({
		status: "success",
		message: `Data film dengan id ${id} berhasil diubah`,
		data: movieUpdated,
	});
});

// ======================================================
// DELETE /movies/:id
// Hapus film
// ======================================================

app.delete("/movies/:id", (req, res) => {
	const id = parseInt(req.params.id);

	const index = movies.findIndex((movie) => movie.id === id);

  // Jika ID tidak ditemukan
	if (index === -1) {
		return res.status(404).json({
			status: "error",
			message: `Data dengan id ${id} tidak ditemukan`,
			data: null,
		});
	}

  // Hapus data
	movies.splice(index, 1);

	res.status(200).json({
		status: "success",
		message: `Data film dengan id ${id} berhasil dihapus`,
		data: null,
	});
});