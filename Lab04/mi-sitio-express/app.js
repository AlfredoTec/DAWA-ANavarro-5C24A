const express = require("express");
const app = express();
const path = require("path");


// Configurar el motor de vistas
app.set("view engine", "ejs");
app.set("views", [
  path.join(__dirname, "views"),
  path.join(__dirname, "views/games")
]);

// Procesar datos del formulario
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos desde "public"
app.use(express.static(path.join(__dirname, "public")));

// Importar rutas
const mainRoutes = require("./routes/mainRoutes");
const gamesRoutes = require("./routes/games/gamesRoutes");

app.use("/", mainRoutes);
app.use("/", gamesRoutes);

// Iniciar el servidor
const PORT = 3000;
app.listen(PORT, () => console.log(`Servidor en http://localhost:${PORT}`));

// Middleware 404 - cuando no se encuentra la ruta
app.use((req, res, next) => {
  res.status(404).render('notFound', { url: req.originalUrl });
});
