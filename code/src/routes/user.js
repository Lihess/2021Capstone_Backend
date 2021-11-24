// 21.09.18 이은비
// 라우터 연결
const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');
const RefController = require('../controllers/refController')
const OrderController = require('../controllers/orderController')
const ImnIngrRecipeController = require('../controllers/imnIngrRecipeController')
const BookmarkController = require('../controllers/bookmarkRecipeController');

const { authJWT, authUser} = require('../middlewares/auth');

// Login 관련
router.post('/login', UserController.login)
router.get('/logout/:id', UserController.logout)
router.post('/find-id', UserController.findId)
router.post('/find-pwd', UserController.findPwd)

// API
router.get('/:ownerNum/refs', RefController.readRefsByUser)
router.get('/:ownerNum/ref-nums', RefController.readRefNumsByUser)
router.get('/:ordererNum/orders', OrderController.readOrdersByUser)
router.get('/:userNum/imn-ingr-recipes', ImnIngrRecipeController.readIIRsByUser)
router.get('/:userNum/imn-ingrs', ImnIngrRecipeController.readImnIngrsByUser)
router.get('/:userNum/bookmarks', BookmarkController.readBookmarksByUser)
router.get('/link/:userNum', UserController.linkUser)

// CRUD
router.post('/', UserController.createUser);
router.get('/:userNum', UserController.readUser)
router.put('/', UserController.updateUser)
router.delete('/:userNum', UserController.deleteUser)

module.exports = router;