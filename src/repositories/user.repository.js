const db = require("../database/pg.database");

exports.getAllUsers = async () => {
    try {
        const res = await db.query("SELECT * FROM users");
        return res.rows;
    } catch (error) {
        console.error("Error executing query", error);
    }
};

exports.createUser = async (user) => {
    try {
        const res = await db.query("INSERT INTO users (name, email, password, balance) VALUES ($1, $2, $3, $4) RETURNING *", 
            [user.name, user.email, user.password, user.balance]
        );
        return res.rows[0];
    } catch (error) {
        console.error("Error executing query", error);
    }
};

exports.getUserByID = async (id) => {
    try {
        const res = await db.query("SELECT * FROM users WHERE id = $1", [id]);
        return res.rows[0];
    } catch (error) {
        console.error("Error executing query", error);
    }
};

exports.updateUser = async (user) => {
    try {
        const res = await db.query(
            "UPDATE users SET name = $1, email = $2, password = $3, balance = $4 WHERE id = $5 RETURNING *",
            [user.name, user.email, user.password, user.balance, user.id]
        );
        return res.rows[0];
    } catch (error) {
        console.error("Error executing query", error);
    }
};

exports.deleteUser = async (id) => {
    try {
        const res = await db.query("DELETE FROM users WHERE id = $1 RETURNING *", [id]);
        return res.rows[0];
    } catch (error) {
        console.error("Error executing query", error);
    }
};

exports.getUserByEmail = async (email) => {
    try {
        const res = await db.query("SELECT * FROM users WHERE email = $1", [email]);
        return res.rows[0];
    } catch (error) {
        console.error("Error executing query", error);
    }
};

exports.login = async (email, password) => {
    try {
        const res = await db.query("SELECT * FROM users WHERE email = $1 AND password = $2", [email, password]);
        return res.rows[0];
    } catch (error) {
        console.error("Error executing query", error);
    }
};

exports.topUp = async (id, amount) => {
    try {
        const res = await db.query(
            "UPDATE users SET balance = balance + $1 WHERE id = $2 RETURNING *", 
            [amount, id]
        );
        return res.rows[0];
    } catch (error) {
        console.error("Error executing query", error);
    }
};