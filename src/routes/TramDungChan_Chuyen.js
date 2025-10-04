const express = require('express');
const router = express.Router();
const controller = require('../controllers/TramDungChan_Chuyen');

router.get('/', controller.getAll);
router.post('/', controller.create);
router.delete('/:MaTram/:MaChuyen', controller.delete);

module.exports = router;
