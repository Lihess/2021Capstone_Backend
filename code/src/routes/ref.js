// 21.09.18 이은비
// 라우터 연결
const express = require('express');
const router = express.Router();
const RefController = require('../controllers/refController');

// CRUD
router.post('/', RefController.createRef);
router.get('/:refNum', RefController.readRef)
router.put('/', RefController.updateRef)
router.delete('/:refNum', RefController.deleteRef)

// API
router.get('/user/:ownerNum', RefController.readRefbyUser)

module.exports = router;