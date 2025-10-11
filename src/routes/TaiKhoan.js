const express = require('express');
const router = express.Router();
const controller = require('../controllers/TaiKhoan');
const { requireAdmin } = require('../middleware/auth'); 

router.use(requireAdmin); 

router.get('/', controller.getAll);
router.get('/:sdt', controller.getBySDT);
router.post('/', controller.create);     
router.put('/:sdt', controller.update);
router.delete('/:sdt', controller.delete);

module.exports = router;
