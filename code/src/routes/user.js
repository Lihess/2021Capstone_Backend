// 21.09.18 이은비
// 라우터 연결
const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');
const RefController = require('../controllers/refController')
const OrderController = require('../controllers/orderController')
const ImnIngrRecipeController = require('../controllers/imnIngrRecipeController')
const BookmarkController = require('../controllers/bookmarkRecipeController');
const refresh = require('../middlewares/refresh');

// CRUD
router.post('/', UserController.createUser);
router.get('/:userNum', UserController.readUser)
router.put('/', UserController.updateUser)
router.delete('/:userNum', UserController.deleteUser)

// Login 관련
router.post('/login', UserController.login)
router.get('/logout/:id', UserController.logout)

// API
router.get('/:ownerNum/refs', RefController.readRefByUser)
router.get('/:ownerNum/ref-nums', RefController.readRefNumsByUser)
router.get('/:ordererNum/orders', OrderController.readOrderByUser)
router.get('/:userNum/imn-ingr-recipes', ImnIngrRecipeController.readIIRByUser)
router.get('/:userNum/imn-ingrs', ImnIngrRecipeController.readOnlyIngrByUser)
router.get('/:userNum/bookmarks', BookmarkController.readBookmarkByUser)

module.exports = router;