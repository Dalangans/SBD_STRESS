const express = require('express');
const router = express.Router();
const storeController = require('../controllers/store.controller');

router.get('/getAll', storeController.getAllStores);
router.post('/register', storeController.createStore);
router.get('/:id', storeController.getID);
router.put('/', storeController.updateStore);
router.delete('/:id', storeController.deleteStore);

module.exports = router;
