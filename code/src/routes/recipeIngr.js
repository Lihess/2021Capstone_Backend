// 21.10.03 이은비
// 라우터 연결
const express = require('express');
const router = express.Router();
const RecipeIngrController = require('../controllers/recipeIngrController');

// CRUD
router.post('/', RecipeIngrController.createRecipeIngr);
router.get('/', RecipeIngrController.readRecipeIngr)
router.put('/',RecipeIngrController.updateRecipeIngr)
router.delete('/', RecipeIngrController.deleteRecipeIngr)

module.exports = router;