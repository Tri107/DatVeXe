const express = require('express');
const router = express.Router();
const controller = require('../controllers/TaiXe');
const { requireAdmin } = require('../middleware/auth');

router.get('/dashboard/:id', controller.getDashboard);
router.get('/chuyen-list/:taixe_id', controller.getChuyenList);
router.get('/chuyen/detail/:chuyen_id', controller.getChuyenDetail);
router.get('/by-phone/:sdt', controller.getByPhone);

router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.post('/', requireAdmin, controller.create);
router.put('/:id', requireAdmin, controller.update);
router.delete('/:id', requireAdmin, controller.delete);

module.exports = router;
