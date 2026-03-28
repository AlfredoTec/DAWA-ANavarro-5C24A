const http = require("http");

const PORT = 3000;

const server = http.createServer((req, res) => {
    res.setHeader("Content-Type", "text/html; charset=utf-8");

    if (req.url === "/") {
        res.statusCode = 200;
        res.end("<h1>Bienvenido al servidor Node.js 🚀</h1>");
    } else if (req.url === "/about") {
        res.statusCode = 200;
        res.end("<h1>Acerca de nosotros</h1><p>Este es un servidor básico.</p>");
    } else if (req.url === "/contact") {
        res.statusCode = 200;
        res.end("<h1>Contacto</h1><p>Escribenos a contacto@ejemplo.com</p>");
    } else if (req.url == "/services") {
        header = "<h1>Nuestros servicios</h1><br>";
        services = ["Web development", "IT consulting", "technical support"];
        content = `
        <ul>
        <li><h2>${services[0]}</h2></li>
        <li><h2>${services[1]}</h2></li>
        <li><h2>${services[2]}</h2></li>
        </ul>`;
        res.statusCode = 200;
        res.end(header+content);
    } else if (req.url === '/error') {
        res.statusCode = 500;
        res.end('<h1>Error 500</h1><p>Ocurrió un error interno en el servidor.</p>');
    }
    else {
        res.statusCode = 404;
        res.end("<h1>404 - Página no encontrada</h1>");
    }
});

server.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});