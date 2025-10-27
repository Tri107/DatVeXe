const express = require('express');
const router = express.Router();
const veController = require('../controllers/Ve');

router.get('/', veController.getAll);
router.get('/weekly-stats', veController.getWeeklyStats);
router.get('/:id', veController.getById);
router.post('/', veController.create);
router.put('/:id', veController.update);
router.delete('/:id', veController.delete);
router.get('/user/:sdt', veController.getByUserSDT);

router.get('/:id/qr', veController.generateQR);
router.post('/verifyQR', veController.verifyQR);


module.exports = router;
