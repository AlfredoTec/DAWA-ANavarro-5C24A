import postService from "../../services/post/post.service.js";
import userService from "../../services/user/user.service.js";

class PostController {
    async create(req, res) {
        try {
            const { userId } = req.params;
            const post = await postService.createPost(userId, req.body);
            res.status(201).json(post);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async createFromForm(req, res) {
        try {
            const { userId, title, content } = req.body;
            await postService.createPost(userId, { title, content });
            res.redirect("/posts/");
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async getAllJson(req, res) {
        try {
            const posts = await postService.getPosts();
            res.status(200).json(posts);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async getById(req, res) {
        try {
            const { postId } = req.params;
            const post = await postService.getPostById(postId);
            res.status(200).json(post);
        } catch (error) {
            res.status(404).json({ error: error.message });
        }
    }

    async getByUser(req, res) {
        try {
            const { userId } = req.params;
            const posts = await postService.getPostsByUser(userId);
            res.status(200).json(posts);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async update(req, res) {
        try {
            const { postId } = req.params;
            const post = await postService.updatePost(postId, req.body);
            res.status(200).json(post);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async delete(req, res) {
        try {
            const { postId } = req.params;
            const post = await postService.deletePost(postId);
            res.status(200).json(post);
        } catch (error) {
            res.status(404).json({ error: error.message });
        }
    }

    async getAll(req, res) {
        try {
            const posts = await postService.getPosts();
            const users = await userService.getUsers();
            console.log(posts);
            res.render("posts/posts", { posts, users });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

export default new PostController();
