// 21.10.03 이은비
// 라우터 연결
const express = require('express');
const router = express.Router();
const RecipeProcController = require('../controllers/recipeProcController');

// CRUD
router.post('/', RecipeProcController.createRecipeProc);
router.get('/', RecipeProcController.readRecipeProc)
router.put('/',RecipeProcController.updateRecipeProc)
router.delete('/', RecipeProcController.deleteRecipeProc)

module.exports = router;