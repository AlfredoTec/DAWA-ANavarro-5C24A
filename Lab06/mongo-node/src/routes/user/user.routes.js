import express from "express";
import userController from "../../controllers/user/user.controller.js";

const router = express.Router();

router.get("/", userController.getAll);
router.get("/json", userController.getAllJson);
router.post("/", userController.create);

export default router;
