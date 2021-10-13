const express = require('express');
const refresh = require('../middlewares/refresh');
const router  = express.Router()

router.get('/jwt', refresh)

module.exports = router;