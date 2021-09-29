// 21.09.18 이은비
// 라우터 연결
const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');
const RefController = require('../controllers/refController')
const OrderController = require('../controllers/orderController')
const ImnIngrRecipeController = require('../controllers/imnIngrRecipeController')
const BookmarkController = require('../controllers/bookmarkRecipeController')

// CRUD
router.post('/', UserController.createUser);
router.get('/:userNum', UserController.readUser)
router.put('/', UserController.updateUser)
router.delete('/:userNum', UserController.deleteUser)

// API
router.get('/:ownerNum/refs', RefController.readRefsByUser)
router.get('/:ownerNum/ref-nums', RefController.readRefNumsByUser)
router.get('/:ordererNum/orders', OrderController.readOrdersByUser)
router.get('/:userNum/imn-ingr-recipes', ImnIngrRecipeController.readIIRsByUser)
router.get('/:userNum/imn-ingrs', ImnIngrRecipeController.readImnIngrsByUser)
router.get('/:userNum/bookmarks', BookmarkController.readBookmarksByUser)

module.exports = router;