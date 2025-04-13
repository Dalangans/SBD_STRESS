const db = require("../database/pg.database");

exports.createTransaction = async (transaction) => {
    try {
        // Fetch user_id from users table
        const userRes = await db.query("SELECT id FROM users WHERE id = $1", [transaction.user_id]);
        if (userRes.rows.length === 0) {
            throw new Error("User not found");
        }

        // Fetch item_id from items table
        const itemRes  =  await db.query("SELECT * FROM items WHERE id = $1", [transaction.item_id]);
        if (itemRes.rows.length === 0) {
            throw new Error("Item not found");
        }

        const total =  itemRes.rows[0].price * transaction.quantity;

        // Insert transaction
        const res = await db.query(
            "INSERT INTO transactions (item_id, quantity, user_id, total) VALUES ($1, $2, $3, $4) RETURNING *",
            [transaction.item_id, transaction.quantity, transaction.user_id, total]
        );
        return res.rows[0]; // Ensure the transaction payload is returned
    } catch (error) {
        console.error("Error executing query", error);
        throw error; // Ensure the error is propagated to the controller
    }
};

exports.getTransaction = async () => {
    try {
        const res = await db.query(`
            SELECT 
                t.*,
                json_build_object(
                    'id', u.id,
                    'name', u.name,
                    'email', u.email,
                    'password', u.password,
                    'balance', u.balance,
                    'created_at', u.created_at
                ) AS user,
                json_build_object(
                    'id', i.id,
                    'name', i.name,
                    'price', i.price,
                    'store_id', i.store_id,
                    'image_url', i.image_url,
                    'stock', i.stock,
                    'created_at', i.created_at
                ) AS item
            FROM transactions t
            JOIN users u ON t.user_id = u.id
            JOIN items i ON t.item_id = i.id
        `);
        return res.rows;
    } catch (error) {
        console.error("Error executing query", error);
        throw error; // Ensure the error is propagated to the controller
    }
};

exports.payTransaction = async (transactionId) => {
    try {
        // Fetch the transaction details
        const transactionRes = await db.query("SELECT * FROM transactions WHERE id = $1", [transactionId]);
        if (transactionRes.rows.length === 0) {
            throw new Error("Transaction not found");
        }
        const transaction = transactionRes.rows[0];

        // Fetch the user's balance
        const userRes = await db.query("SELECT balance FROM users WHERE id = $1", [transaction.user_id]);
        if (userRes.rows.length === 0) {
            throw new Error("User not found");
        }
        const userBalance = userRes.rows[0].balance;

        // Check if the user's balance is sufficient
        if (userBalance < transaction.total) {
            throw new Error("Not enough balance");
        }

        // Deduct the total from the user's balance
        await db.query("UPDATE users SET balance = balance - $1 WHERE id = $2", [transaction.total, transaction.user_id]);

        // Update the transaction status to 'paid'
        const res = await db.query(
            "UPDATE transactions SET status = 'paid' WHERE id = $1 RETURNING *",
            [transactionId]
        );
        return res.rows[0];
    } catch (error) {
        console.error("Error executing query", error);
        throw error;
    }
};

exports.deleteTransaction = async (transactionId) => {
    try {
        const res = await db.query("DELETE FROM transactions WHERE id = $1 RETURNING *", [transactionId]);
        if (!res || res.rows.length === 0) {
            throw new Error("Transaction not found");
        }
        return res.rows[0];
    } catch (error) {
        console.error("Error executing query", error);
        throw error;
    }
};