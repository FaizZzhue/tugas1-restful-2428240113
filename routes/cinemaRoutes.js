const express = require("express");
const router = express.Router();
const cinemaController = require("../controllers/cinemaController");
const cekApiKey = require("../middlewares/cekApiKey");

router.get("/", cinemaController.getCinemas);
router.get("/:id", cinemaController.getCinemaById);
router.post("/", cekApiKey, cinemaController.createCinema);
router.put("/:id", cekApiKey, cinemaController.updateCinema);
router.delete("/:id", cekApiKey, cinemaController.deleteCinema);

module.exports = router;