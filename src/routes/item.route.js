const express = require('express');
const itemController = require('../controllers/item.controller');
const upload = require('../database/pg.database').upload;

const router = express.Router();

router.post('/create', upload.single('image'), itemController.createItem);

router.get('/', itemController.getItems);

router.get('/byId/:id', itemController.getItemsById);

router.get('/byStoreId/:store_id', itemController.getItemsByStoreId);

router.put('/', upload.single('image'), itemController.updateItem);

router.delete('/:id', itemController.deleteItem);

module.exports = router;
