// "Base de datos" en memoria
const gamesList = [];

const games = (req, res) => {
  res.render("games", { title: "Registrar juego favorito" });
};

const saveFavGame = (req, res) => {
  const { name, favGame, reason, description, rating } = req.body;

  gamesList.push({ name, favGame, reason, description, rating });

  res.redirect('/favGames');
};

const listGames  = (req, res) => {
    res.render("favGames", { gamesList, title:"Juegos favoritos" });
  };

const gamesController = {
  games,
  saveFavGame,
  listGames
};

module.exports = gamesController;
