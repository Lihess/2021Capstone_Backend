// 21.09.25 이은비
// 라우터 연결
const express = require('express');
const router = express.Router();
const OrderProductController = require('../controllers/orderProductController');

// CRUD
router.post('/', OrderProductController.createOrderProduct);
router.get('/', OrderProductController.readOrderProduct)
router.put('/', OrderProductController.updateOrderProduct)
router.delete('/', OrderProductController.deleteOrderProduct)

module.exports = router;