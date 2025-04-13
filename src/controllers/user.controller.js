const bcrypt = require("bcrypt");
const userRepository = require("../repositories/user.repository");
const baseResponse = require("../utils/baseResponse.util");

exports.getAllUsers = async (req, res) => {
    try {
        const users = await userRepository.getAllUsers();
        baseResponse(res, true, 200, "Users retrieved successfully", users);
    } catch (error) {
        baseResponse(res, false, 500, "Error retrieving users", error);
    }
};

exports.createUser = async (req, res) => {
    if (!req.query.name || !req.query.email || !req.query.password) {
        return baseResponse(res, false, 400, "Name, email, and password are required");
    }
    try {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(req.query.email)) {
            return baseResponse(res, false, 400, "Invalid email format");
        }

        // Check if email is already used
        const existingUser = await userRepository.getUserByEmail(req.query.email);
        if (existingUser) {
            return baseResponse(res, false, 400, "Email already used", null);
        }

        // Hash the plain text password
        const hashedPassword = await bcrypt.hash(req.query.password, 10);

        // Save the user with the hashed password
        const user = await userRepository.createUser({
            ...req.query,
            password: hashedPassword
        });
        baseResponse(res, true, 201, "User created successfully", user);
    } catch (error) {
        baseResponse(res, false, 500, error.message || "Server Error", error);
    }
};

exports.getUserByID = async (req, res) => {
    const id = req.params.id;
    try {
        const user = await userRepository.getUserByID(id);
        if(user) {
            baseResponse(res, true, 200, "User retrieved successfully", user);
        } else {
            baseResponse(res, false, 404, "User not found");
        }
    } catch (error) {
        baseResponse(res, false, 500, "Error retrieving user", error);
    }
};

exports.updateUser = async (req, res) => {
    if (!req.body.id || !req.body.name || !req.body.email || !req.body.password) {
        return baseResponse(res, false, 400, "ID, name, email, and password are required");
    }
    try {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (!emailRegex.test(req.body.email)) {
            return baseResponse(res, false, 400, "Invalid email format");
        }
        
        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        const user = await userRepository.updateUser({
            ...req.body,
            password: hashedPassword
        });
        if (user) {
            baseResponse(res, true, 200, "User updated successfully", user);
        } else {
            baseResponse(res, false, 404, "User not found");
        }
    } catch (error) {
        baseResponse(res, false, 500, error.message || "Server Error", error);
    }
};

exports.deleteUser = async (req, res) => {
    const id = req.params.id;
    try {
        const user = await userRepository.deleteUser(id);
        if (user) {
            baseResponse(res, true, 200, "User deleted successfully", user);
        } else {
            baseResponse(res, false, 404, "User not found");
        }
    } catch (error) {
        baseResponse(res, false, 500, error.message || "Server Error", error);
    }
};

exports.getUserByEmail = async (req, res) => {
    const email = req.params.email;
    try {
        const user = await userRepository.getUserByEmail(email);
        if(user) {
            baseResponse(res, true, 200, "User retrieved successfully", user);
        } else {
            baseResponse(res, false, 404, "User not found");
        }
    } catch (error) {
        baseResponse(res, false, 500, "Error retrieving user", error);
    }
};

exports.login = async (req, res) => {
    const email = req.query.email;
    const password = req.query.password;
    try {
        const user = await userRepository.getUserByEmail(email);
        if (!user) {
            return baseResponse(res, false, 404, "Invalid email or password", null);
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return baseResponse(res, false, 404, "Invalid email or password", null);
        }

        baseResponse(res, true, 200, "Login successful", user);
    } catch (error) {
        baseResponse(res, false, 500, error.message || "Server Error", null);
    }
};

exports.deleteUser = async (req, res) => {
    const id = req.params.id;
    try {
        const user = await userRepository.deleteUser(id);
        if (user) {
            baseResponse(res, true, 200, "User deleted successfully", user);
        } else {
            baseResponse(res, false, 404, "User not found");
        }
    } catch (error) {
        baseResponse(res, false, 500, error.message || "Server Error", error);
    }
};

exports.topUp = async (req, res) => {
    const id = req.query.id;
    const amount = parseFloat(req.query.amount);

    if (amount <= 0) {
        return baseResponse(res, false, 400, "Amount must be greater than 0", null);
    }

    try {
        const user = await userRepository.topUp(id, amount);
        if (user) {
            baseResponse(res, true, 200, "Top up successful", user);
        } else {
            baseResponse(res, false, 404, "User not found");
        }
    } catch (error) {
        baseResponse(res, false, 500, error.message || "Server Error", error);
    }
};