const mongoose = require("mongoose");

const cinemaSchema = new mongoose.Schema(
  {
    nama: {
      type: String,
      required: [true, "Nama bioskop wajib diisi"],
      trim: true,
    },
    lokasi: {
      type: String,
      required: [true, "Lokasi bioskop wajib diisi"],
      trim: true,
    },
    alamat: {
      type: String,
      required: [true, "Alamat bioskop wajib diisi"],
      trim: true,
    },
    fasilitas: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Cinema", cinemaSchema);