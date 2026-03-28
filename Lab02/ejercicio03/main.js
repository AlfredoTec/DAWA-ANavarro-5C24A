const http = require("http");
const repo = require("./repository/studentsRepository");

const PORT = 4000;

const server = http.createServer((req, res) => {
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    const { method, url } = req;

    if (url === "/students" && method === "GET") {
        res.statusCode = 200;
        res.end(JSON.stringify(repo.getAll()));
    } else if (url.startsWith("/students/") && method === "GET") {
        const id = parseInt(url.split("/")[2]);
        const student = repo.getById(id);
        if (student) {
            res.statusCode = 200;
            res.end(JSON.stringify(student));
        } else {
            res.statusCode = 404;
            res.end(JSON.stringify({ error: "Estudiante no encontrado" }));
        }
    } else if (url === "/students" && method === "POST") {
        let body = "";
        req.on("data", chunk => (body += chunk));
        req.on("end", () => {
            try {
                const newStudent = repo.create(JSON.parse(body));
                res.statusCode = 201;
                res.end(JSON.stringify(newStudent));
            } catch (error) {
                res.statusCode = 400;
                res.end(JSON.stringify({ error: "Datos inválidos" }));
            }
        });
    } else if (url.startsWith("/students/") && method === "PUT") {
        const id = parseInt(url.split("/")[2]);
        let body = "";
        req.on("data", chunk => (body += chunk));
        req.on("end", () => {
            try {
                const updateData = JSON.parse(body);
                const updatedStudent = repo.update(id, updateData);
                if (updatedStudent) {
                    res.statusCode = 200;
                    res.end(JSON.stringify(updatedStudent));
                } else {
                    res.statusCode = 404;
                    res.end(JSON.stringify({ error: "Estudiante no encontrado" }));
                }
            } catch (error) {
                res.statusCode = 400;
                res.end(JSON.stringify({ error: "Datos inválidos" }));
            }
        });
    } else if (url.startsWith("/students/") && method === "DELETE") {
        const id = parseInt(url.split("/")[2]);
        const deleted = repo.remove(id);
        if (deleted) {
            res.statusCode = 200;
            res.end(JSON.stringify(deleted));
        } else {
            res.statusCode = 404;
            res.end(JSON.stringify({ error: "Estudiante no encontrado" }));
        }
    } 
    
    else if (url === "/ListByStatus" && method === "POST") {
        let body = "";
        req.on("data", chunk => (body += chunk));
        req.on("end", () => {
            try {
                const { status } = JSON.parse(body);
                if (!status) {
                    res.statusCode = 400;
                    res.end(JSON.stringify({ error: "El campo 'status' es requerido" }));
                    return;
                }
                const filtered = repo.listByStatus(status);
                res.statusCode = 200;
                res.end(JSON.stringify(filtered));
            } catch (error) {
                res.statusCode = 400;
                res.end(JSON.stringify({ error: "Datos inválidos" }));
            }
        });
    }

    else if (url === "/ListByGrade" && method === "POST") {
        let body = "";
        req.on("data", chunk => (body += chunk));
        req.on("end", () => {
            try {
                const { operator, grade } = JSON.parse(body);
                if (!operator || grade === undefined) {
                    res.statusCode = 400;
                    res.end(JSON.stringify({ error: "Se requieren 'operator' y 'grade'" }));
                    return;
                }
                const filtered = repo.listByGrade(operator, grade);
                res.statusCode = 200;
                res.end(JSON.stringify(filtered));
            } catch (error) {
                res.statusCode = 400;
                res.end(JSON.stringify({ error: "Datos inválidos" }));
            }
        });
    }
    else {
        res.statusCode = 404;
        res.end(JSON.stringify({ error: "Ruta no encontrada" }));
    }
});

server.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});