const http = require("http");
const fs = require("fs");
const path = require("path");
const handlebars = require("handlebars");

const PORT = 3000;

handlebars.registerHelper('ifCond', function (v1, operator, v2, options) {
    switch (operator) {
        case '==':
            return (v1 == v2) ? options.fn(this) : options.inverse(this);
        case '>':
            return (v1 > v2) ? options.fn(this) : options.inverse(this);
        default:
            return options.inverse(this);
    }
});

const server = http.createServer((req, res) => {
    if (req.url === "/") {
        const filePath = path.join(__dirname, "views", "home.hbs");

        fs.readFile(filePath, "utf8", (err, templateData) => {
            if (err) {
                res.statusCode = 500;
                res.end("Error interno del servidor");
                return;
            }

            const template = handlebars.compile(templateData);

            const data = {
                title: "Servidor con Handlebars 🚀",
                welcomeMessage: "Bienvenido al laboratorio de Node.js",
                day: new Date().toLocaleDateString("es-PE"),
                students: ["Ana", "Luis", "Pedro", "María"],
            };

            const html = template(data);

            res.setHeader("Content-Type", "text/html; charset=utf-8");
            res.end(html);
        });
    } else if(req.url === "/about") {
        const filePath = path.join(__dirname, "views", "about.hbs");

        fs.readFile(filePath, "utf-8", (err, templateData) => {
            if (err) {
                res.statusCode = 500;
                res.end("Error interno del servidor");
                return;
            }

            const template = handlebars.compile(templateData);

            const data = {
                title: "Datos sobre el curso",
                courseName: "Desarrollo de Aplicaciones Web Avanzado",
                courseTeacher: "Arevalo Sermenio, Edwin William",
                date: new Date().toLocaleDateString("es-PE")
            };

            const html = template(data);

            res.setHeader("Content-Type", "text/html; charset=utf-8");
            res.end(html);
        })
    } else if(req.url === "/students") {
        const filePath = path.join(__dirname, "views", "students.hbs");

        fs.readFile(filePath, "utf-8", (err, templateData) => {
            if (err) {
                res.statusCode = 500;
                res.end("Error interno del servidor");
                return;
            }

            const students = [
                { name: "Ana Pérez", grade: 18 },
                { name: "Luis Gómez", grade: 14 },
                { name: "María López", grade: 16 },
                { name: "Carlos Ruiz", grade: 12 },
                { name: "Sofía Torres", grade: 19 }
            ];

            const template = handlebars.compile(templateData);

            const data = {
                title: "Datos de los estudiantes",
                students: students
            };

            const html = template(data);

            res.setHeader("Content-Type", "text/html; charset=utf-8");
            res.end(html);
        })
    }
     else {
        res.statusCode = 404;
        res.end("<h1>404 - Página no encontrada</h1>");
    }
});

server.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});