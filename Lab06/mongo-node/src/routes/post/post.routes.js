import express from "express";
import postController from "../../controllers/post/post.controller.js";

const router = express.Router();

router.get("/", postController.getAll);
router.get("/json", postController.getAllJson);
router.get("/user/:userId", postController.getByUser);
router.get("/:postId", postController.getById);
router.post("/", postController.createFromForm);
router.post("/:userId", postController.create);
router.put("/:postId", postController.update);
router.delete("/:postId", postController.delete);

export default router;
