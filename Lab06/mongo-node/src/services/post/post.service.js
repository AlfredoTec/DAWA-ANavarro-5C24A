import postRepository from "../../repositories/post/post.repository.js";
import userRepository from "../../repositories/user/user.repository.js";

class PostService {
    async createPost(userId, postData) {
        const user = await userRepository.findById(userId);
        if (!user) throw new Error("Usuario no encontrado");

        const { title, content } = postData;
        return await postRepository.create({ title, content, user: user._id });
    }

    async updatePost(postId, postData) {
        const updateData = {};
        if (postData.title !== undefined) updateData.title = postData.title;
        if (postData.content !== undefined) updateData.content = postData.content;

        if (Object.keys(updateData).length === 0) {
            throw new Error("No hay datos para actualizar");
        }

        return await postRepository.update(postId, updateData);
    }

    async getPostById(postId) {
        const post = await postRepository.findById(postId);
        if (!post) throw new Error("Post no encontrado");
        return post;
    }

    async getPosts() {
        return await postRepository.findAll();
    }

    async getPostsByUser(userId) {
        return await postRepository.findByUser(userId);
    }

    async deletePost(postId) {
        const deleted = await postRepository.delete(postId);
        if (!deleted) throw new Error("Post no encontrado");
        return deleted;
    }
}

export default new PostService();
