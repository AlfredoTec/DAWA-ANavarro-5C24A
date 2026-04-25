import User from "../../models/user/User.js";

class UserRepository {
    async create(user) {
        return await User.create(user);
    }

    async findByEmail(email) {
        return await User.findOne({ email });
    }

    async findAll() {
        return await User.find();
    }

    async findById(id) {
        return await User.findById(id);
    }
}

export default new UserRepository();
