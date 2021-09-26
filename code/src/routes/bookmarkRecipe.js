// 21.09.26 이은비
// 라우터 연결
const express = require('express');
const router = express.Router();
const BookmarkRecipeCotroller = require('../controllers/bookmarkRecipeController')

// CRUD
router.post('/', BookmarkRecipeCotroller.createBookmark);
router.get('/', BookmarkRecipeCotroller.readBookmark)
router.put('/', BookmarkRecipeCotroller.updateBookmark)
router.delete('/', BookmarkRecipeCotroller.deleteBookmark)

// API
router.get('/user/:userNum', BookmarkRecipeCotroller.readBookmarkByUser)

module.exports = router;