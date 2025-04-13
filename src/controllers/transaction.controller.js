const transactionRepository = require("../repositories/transaction.repository");
const baseResponse = require("../utils/baseResponse.util");

exports.createTransaction = async (req, res) => {
    const { item_id, quantity, user_id } = req.body;

    if (!item_id || !user_id) {
        return baseResponse(res, false, 400, "Item ID and user ID are required", null);
    }

    if (quantity <= 0) {
        return baseResponse(res, false, 400, "Quantity must be larger than 0", null);
    }

    try {
        const transaction = await transactionRepository.createTransaction(req.body);
        baseResponse(res, true, 201, "Transaction created successfully", transaction);
    } catch (error) {
        if (error.message === "User not found") {
            return baseResponse(res, false, 404, "User not found", null);
        }
        if (error.message === "Item not found") {
            return baseResponse(res, false, 404, "Item not found", null);
        }
        baseResponse(res, false, 500, error.message || "Server Error", null);
    }
};

exports.payTransaction = async (req, res) => {
    const transactionId = req.params.id;

    try {
        const transaction = await transactionRepository.payTransaction(transactionId);
        baseResponse(res, true, 200, "Payment successful", transaction);
    } catch (error) {
        if (error.message === "Transaction not found") {
            return baseResponse(res, false, 404, "Transaction not found", null);
        }
        if (error.message === "User not found") {
            return baseResponse(res, false, 404, "User not found", null);
        }
        if (error.message === "Not enough balance") {
            return baseResponse(res, false, 400, "Not enough balance", null);
        }
        baseResponse(res, false, 500, "Failed to pay", null); // Updated error message
    }
};

exports.deleteTransaction = async (req, res) => {
    const transactionId = req.params.id;

    try {
        const transaction = await transactionRepository.deleteTransaction(transactionId);
        baseResponse(res, true, 200, "Transaction deleted successfully", transaction);
    } catch (error) {
        if (error.message === "Transaction not found") {
            return baseResponse(res, false, 404, "Transaction not found", null);
        }
        baseResponse(res, false, 500, error.message || "Server Error", null);
    }
};

exports.getTransaction = async (req, res) => {
    try {
        const transaction = await transactionRepository.getTransaction();
        if (!transaction) {
            return baseResponse(res, false, 404, "Transaction not found", null);
        }
        baseResponse(res, true, 200, "Transaction retrieved successfully", transaction);
    } catch (error) {
        baseResponse(res, false, 500, error.message || "Error retrieving transactions", null);
    }
}