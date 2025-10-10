const express = require('express');
const router = express.Router();
const controller = require('../controllers/Tram_Chuyen');

router.get('/', controller.getAll);
router.get('/:chuyenId/:tramId', controller.getOne);
router.post('/', controller.create);
router.delete('/:chuyenId/:tramId', controller.delete);

module.exports = router;
