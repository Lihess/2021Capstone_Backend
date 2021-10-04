//라우터 작성
const express = require('express');
const router = express.Router();
const PresetIngrController = require('../controllers/presetIngrController');

//CRUD
router.post('/', PresetIngrController.createPresetIngr);
router.get('/:presetIngrNum', PresetIngrController.readPresetIngr)
router.put('/', PresetIngrController.updatePresetIngr)
router.delete('/:presetIngrNum', PresetIngrController.deletePresetIngr)

module.exports = router;