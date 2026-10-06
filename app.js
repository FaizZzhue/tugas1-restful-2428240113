const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const logger = require("./middlewares/logger");
const movieRoutes = require("./routes/movieRoutes");

const {
  notFoundHandler,
  errorHandler,
} = require("./middlewares/errorHandler");

// Load environment variables
dotenv.config();

const app = express();

const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(logger);
app.use(express.json());

// API information
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

// Routes
app.use("/movies", movieRoutes);

// 404
app.use(notFoundHandler);

// Centralized error handler
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});