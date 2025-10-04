const express = require('express');
const router = express.Router();
const controller = require('../controllers/Xe_Ghe');

router.get('/', controller.getAll);
router.post('/', controller.create);
router.delete('/:BienSo/:SoGhe', controller.delete);

module.exports = router;
