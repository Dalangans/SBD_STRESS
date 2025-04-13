const db = require("../database/pg.database");

exports.createItem = async (item, image) => {
    try {
        const uploadResponse = await db.cloudinary.uploader.upload(image.path);
        const res = await db.query(
            "INSERT INTO items (name, price, store_id, image_url, stock) VALUES ($1, $2, $3, $4, $5) RETURNING *",
            [item.name, item.price, item.store_id, uploadResponse.secure_url, item.stock]
        );
        return res.rows[0];
    } catch (error) {
        console.error("Error executing query", error);
    }
};

exports.checkStoreExists = async (store_id) => {
    try {
        const res = await db.query("SELECT * FROM stores WHERE id = $1", [store_id]);
        return res.rows.length > 0;
    } catch (error) {
        console.error("Error executing query", error);
    }
};

exports.getItems = async () => {
    try {
        const res = await db.query("SELECT * FROM items");
        return res.rows;
    } catch (error) {
        console.error("Error executing query", error);
    }
};

exports.getItemsById = async (id) => {
    try {
        const res = await db.query("SELECT * FROM items WHERE id = $1", [id]);
        return res.rows[0];
    } catch (error) {
        console.error("Error executing query", error);
    }
}

exports.getItemsByStoreId = async (store_id) => {
    try {
        const res = await db.query("SELECT * FROM items WHERE store_id = $1", [store_id]);
        return res.rows;
    } catch (error) {
        console.error("Error executing query", error);
    }
}

exports.updateItem = async (item, image) => {
    try {
        const uploadResponse = await db.cloudinary.uploader.upload(image.path);
        const res = await db.query(
            "UPDATE items SET name = $1, price = $2, store_id = $3, image_url = $4, stock = $5  RETURNING *",
            [item.name, item.price, item.store_id, uploadResponse.secure_url, item.stock]
        );
        return res.rows[0];
    } catch (error) {
        console.error("Error executing query", error);
    }
};

exports.deleteItem = async (id) => {
    try {
        const res = await db.query("DELETE FROM items WHERE id = $1", [id]);
        return res.rows[0];
    } catch (error) {
        console.error("Error executing query", error);
    }
};