// 21.09.18 이은비
// 라우터 연결
const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');

// CRUD
router.post('/', UserController.createUser);
router.get('/:userNum', UserController.readUser)
router.put('/', UserController.updateUser)
router.delete('/:userNum', UserController.deleteUser)

module.exports = router;