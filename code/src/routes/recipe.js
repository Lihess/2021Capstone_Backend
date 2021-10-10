//라우터 작성
const express = require('express');
const router = express.Router();
const RecipeController = require('../controllers/recipeController');

//API
router.get('/search-list', RecipeController.searchRecipes)

//CRUD
router.post('/', RecipeController.createRecipe);
router.get('/:recipeNum', RecipeController.readRecipe)
router.put('/', RecipeController.updateRecipe)
router.delete('/:recipeNum', RecipeController.deleteRecipe)

module.exports = router;