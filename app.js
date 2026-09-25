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