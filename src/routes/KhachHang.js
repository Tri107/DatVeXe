const express = require('express');
const router = express.Router();
const controller = require('../controllers/KhachHang');
const { requireAdmin } = require('../middleware/auth'); 

router.get('/', controller.getAll);
router.get('/:id', controller.getById);

router.get('/find-by-phone/:phone', controller.getByPhone);
router.post('/', requireAdmin, controller.create);
router.put('/:id', requireAdmin, controller.update);
router.delete('/:id', requireAdmin, controller.delete);

module.exports = router;
