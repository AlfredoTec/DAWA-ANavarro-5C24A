import userRepository from "../../repositories/user/user.repository.js";

class UserService {
    async createUser(userData) {
        const { name, lastName, email, phoneNumber, password, age } = userData;
        return await userRepository.create({ name, lastName, email, phoneNumber, password, age });
    }

    async getUsers() {
        return await userRepository.findAll();
    }
}

export default new UserService();
