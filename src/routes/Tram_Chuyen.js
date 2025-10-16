const express = require('express');
const router = express.Router();
const controller = require('../controllers/Tram_Chuyen');
const { requireAdmin } = require('../middleware/auth'); 

router.get('/', controller.getAll);
router.get('/:chuyenId/:tramId', controller.getOne);

router.post('/',requireAdmin, controller.create);
router.delete('/:chuyenId/:tramId',requireAdmin, controller.delete);

module.exports = router;
