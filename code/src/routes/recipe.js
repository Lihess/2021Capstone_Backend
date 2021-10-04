//라우터 작성
const express = require('express');
const router = express.Router();
const RecipeController = require('../controllers/RecipeController');

//CRUD
router.post('/', RecipeController.createRecipe);
router.get('/:recipeNum', RecipeController.readRecipe)
router.put('/', RecipeController.updateRecipe)
router.delete('/:recipeNum', RecipeController.deleteRecipe)

module.exports = router;