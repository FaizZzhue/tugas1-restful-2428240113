require("dotenv").config();
const mongoose = require("mongoose");
const connectDatabase = require("./config/database");
const Cinema = require("./models/cinemaModel");
const Movie = require("./models/movieModel");

const seed = async () => {
  try {
    await connectDatabase();
    await Movie.deleteMany({});
    await Cinema.deleteMany({});

    const cinemas = await Cinema.insertMany([
      {
        nama: "Cinema Palembang Square",
        lokasi: "Palembang",
        alamat: "Palembang Square Mall, Palembang",
        fasilitas: ["Regular", "Snack Bar", "Parking"],
      },
      {
        nama: "Cinema OPI Mall",
        lokasi: "Palembang",
        alamat: "OPI Mall, Jakabaring, Palembang",
        fasilitas: ["Regular", "Deluxe", "Parking"],
      },
    ]);

    await Movie.insertMany([
      {
        judul: "Jejak Senja",
        genre: "Drama",
        durasiMenit: 118,
        ratingUsia: "13+",
        sutradara: "Arif Wibowo",
        pemeran: [{ nama: "Nadia Putri", peran: "Alya" }, { nama: "Rizky Ananda", peran: "Bima" }],
        cinema: cinemas[0]._id,
      },
      {
        judul: "Malam Terakhir",
        genre: "Thriller",
        durasiMenit: 105,
        ratingUsia: "17+",
        sutradara: "Raka Pratama",
        pemeran: [{ nama: "Dimas Saputra", peran: "Reno" }],
        cinema: cinemas[0]._id,
      },
      {
        judul: "Petualangan Langit",
        genre: "Adventure",
        durasiMenit: 125,
        ratingUsia: "SU",
        sutradara: "Dimas Saputra",
        pemeran: [{ nama: "Alya Maharani", peran: "Nara" }],
        cinema: cinemas[1]._id,
      },
    ]);

    console.log("Seed berhasil: 2 cinema dan 3 film dibuat.");
  } catch (error) {
    console.error("Seed gagal:", error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
};

seed();