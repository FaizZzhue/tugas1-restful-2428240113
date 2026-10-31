const mongoose = require("mongoose");

const connectDatabase = async () => {
  const uri = process.env.DB_URI;

  if (!uri) {
    throw new Error("DB_URI belum diatur. Periksa file .env");
  }

  mongoose.set("strictQuery", true);
  await mongoose.connect(uri);

  console.log(`MongoDB terhubung: ${mongoose.connection.name}`);
};

module.exports = connectDatabase;