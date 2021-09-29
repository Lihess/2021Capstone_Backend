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

// API
router.get('/user/:userNum', ImnIngrRecipeController.readIIRByUser)
router.get('/ingrsByUser/:userNum', ImnIngrRecipeController.readOnlyIngrByUser)

module.exports = router;