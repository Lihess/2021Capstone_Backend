// 21.09.18 이은비
// 라우터 연결
const express = require('express');
const router = express.Router();
const ImnIngrRecipeController = require('../controllers/imnIngrRecipeController');

// CRUD
router.post('/', ImnIngrRecipeController.createIIR);
router.get('/', ImnIngrRecipeController.readIIR)
router.put('/', ImnIngrRecipeController.updateIIR)
router.delete('/', ImnIngrRecipeController.deleteIIR)

module.exports = router;