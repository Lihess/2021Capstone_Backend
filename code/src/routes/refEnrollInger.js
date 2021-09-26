// 21.09.25 이은비
// 라우터 연결
const express = require('express');
const router = express.Router();
const RefEIController = require('../controllers/refEIController');

// CRUD
router.post('/', RefEIController.createRefEI);
router.get('/', RefEIController.readRefEI)
router.put('/', RefEIController.updateRefEI)
router.delete('/', RefEIController.deleteRefEI)

module.exports = router;