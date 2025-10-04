const express = require('express');
const router = express.Router();
const controller = require('../controllers/TramDungChan');

// CRUD
router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.delete('/:id', controller.delete);

// Gán trạm cho chuyến
router.post('/gan-tram', controller.assignToChuyen);

module.exports = router;
