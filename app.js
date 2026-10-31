const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const logger = require("./middlewares/logger");
const movieRoutes = require("./routes/movieRoutes");
const cinemaRoutes = require("./routes/cinemaRoutes");
const connectDatabase = require("./config/database");
const { notFoundHandler, errorHandler } = require("./middlewares/errorHandler");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(",") : true,
}));
app.use(logger);
app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({
    nama: "Achmad Faiz Yudha Ramadhan",
    npm: "2428240113",
    topik: 9,
    topikNama: "Bioskop - Film",
    database: "MongoDB",
    resource: ["/movies", "/cinemas"],
    endpoints: [
      "GET /movies (filtering, pagination, sorting, projection)",
      "GET /movies/:id",
      "POST /movies",
      "PUT /movies/:id",
      "DELETE /movies/:id",
      "GET /cinemas",
      "GET /cinemas/:id",
      "POST /cinemas",
      "PUT /cinemas/:id",
      "DELETE /cinemas/:id",
    ],
  });
});

app.use("/movies", movieRoutes);
app.use("/cinemas", cinemaRoutes);
app.use(notFoundHandler);
app.use(errorHandler);

if (require.main === module) {
  connectDatabase()
    .then(() => {
      app.listen(PORT, () => console.log(`Server berjalan di http://localhost:${PORT}`));
    })
    .catch((error) => {
      console.error("Gagal menghubungkan MongoDB:", error.message);
      process.exit(1);
    });
}

module.exports = app;