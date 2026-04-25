import userService from "../../services/user/user.service.js";

class UserController {
    async create(req, res) {
        try {
            const user = await userService.createUser(req.body);
            res.redirect("/users/");
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async getAllJson(req, res) {
        try {
            const users = await userService.getUsers();
            res.status(200).json(users);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async getAll(req, res) {
        try {
            const users = await userService.getUsers();
            res.render("users/users", { users });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

export default new UserController();
