const storeRepository = require("../repositories/store.repository");
const baseResponse = require("../utils/baseResponse.util");

exports.getAllStores = async (req, res) => {
    try {
        const stores = await storeRepository.getAllStores();
        baseResponse(res, true, 200, "Stores retrieved successfully", stores);
    } catch (error) {
        baseResponse(res, false, 500, "Error retrieving stores", error);
    }
};

exports.createStore = async (req, res) => {
    if(!req.body.name || !req.body.address) {
        return baseResponse(res, false, 400, "Name and address are required");
    }
    try {
        const store = await storeRepository.createStore(req.body);
        baseResponse(res, true, 200, "Store created successfully", store);
    } catch (error) {
        baseResponse(res, false, 500, error.message || "Server Error", error);
    }
};

exports.getID = async (req, res) => {
    const id = req.params.id;
    try {
        const store = await storeRepository.getID(id);
        if(store) {
            baseResponse(res, true, 200, "ID retrieved successfully", store);
        } else {
            baseResponse(res, false, 500, "Store not found");
        }
    } catch (error) {
        baseResponse(res, false, 500, "Error retrieving ID", error);
    }
};

exports.updateStore = async (req, res) => {
    if(!req.body.id || !req.body.name || !req.body.address) {
        return baseResponse(res, false, 400, "ID, name, and address are required");
    }
    try {
        const store = await storeRepository.updateStore(req.body);
        if (store) {
            baseResponse(res, true, 200, "Store updated successfully", store);
        } else {
            baseResponse(res, false, 404, "Store not found");
        }
    } catch (error) {
        baseResponse(res, false, 500, error.message || "Server Error", error);
    }
};

exports.deleteStore = async (req, res) => {
    const id = req.params.id;
    try {
        const store = await storeRepository.deleteStore(id);
        if (store) {
            baseResponse(res, true, 200, "Store deleted successfully", store);
        } else {
            baseResponse(res, false, 404, "Store not found");
        }
    } catch (error) {
        baseResponse(res, false, 500, error.message || "Server Error", error);
    }
};