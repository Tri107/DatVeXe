const express = require('express');
const router = express.Router();
const controller = require('../controllers/Chuyen');
const { requireAdmin } = require('../middleware/auth'); 

router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.get('/:id/diemdon', controller.getDiemDon);
router.get('/:id/diemtra', controller.getDiemTra);


router.post('/',requireAdmin, controller.create);
router.put('/:id',requireAdmin, controller.update);
router.delete('/:id',requireAdmin, controller.delete);

module.exports = router;
