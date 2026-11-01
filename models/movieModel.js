const mongoose = require("mongoose");

const pemeranSchema = new mongoose.Schema(
  {
    nama: {
      type: String,
      required: [true, "Nama pemeran wajib diisi"],
      trim: true,
    },
    peran: {
      type: String,
      trim: true,
      default: "Pemeran",
    },
  },
  { _id: false }
);

const movieSchema = new mongoose.Schema(
  {
    judul: {
      type: String,
      required: [true, "Judul film wajib diisi"],
      trim: true,
    },
    genre: {
      type: String,
      required: [true, "Genre film wajib diisi"],
      trim: true,
      index: true,
    },
    durasiMenit: {
      type: Number,
      required: [true, "Durasi film wajib diisi"],
      min: [1, "Durasi harus lebih dari 0"],
    },
    ratingUsia: {
      type: String,
      required: [true, "Rating usia wajib diisi"],
      enum: ["SU", "13+", "17+", "21+"],
    },
    sutradara: {
      type: String,
      trim: true,
      default: "",
    },
    // EMBEDDING: data pemeran disimpan langsung di dalam dokumen Movie.
    pemeran: {
      type: [pemeranSchema],
      default: [],
    },
    // REFERENCING: Movie menyimpan ObjectId yang menunjuk dokumen Cinema.
    cinema: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cinema",
      required: [true, "Cinema wajib dipilih (gunakan cinemaId)"],
    },
  },
  { timestamps: true }
);

movieSchema.index({ judul: "text", sutradara: "text" });

module.exports = mongoose.model("Movie", movieSchema);