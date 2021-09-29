// 21.09.25 이은비
// 라우터 연결
const express = require('express');
const router = express.Router();
const OrderController = require('../controllers/orderController');

// CRUD
router.post('/', OrderController.createOrder);
router.get('/:orderNum', OrderController.readOrder)
router.put('/', OrderController.updateOrder)
router.delete('/:orderNum', OrderController.deleteOrder)

module.exports = router;