const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');

router.get('/getAll', userController.getAllUsers);
router.post('/register', userController.createUser);
router.put('/', userController.updateUser);
router.delete('/:id', userController.deleteUser);
router.get('/:email', userController.getUserByEmail);
router.post('/login', userController.login);
router.post('/topup', userController.topUp);

module.exports = router;
