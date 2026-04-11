const express = require("express");
const router = express.Router();
const gamesController = require("../../controllers/games/gamesController");

// Definir rutas y asociarlas con controladores
router.get("/games", gamesController.games);
router.post("/games", gamesController.saveFavGame);
router.get("/favGames", gamesController.listGames);

module.exports = router;