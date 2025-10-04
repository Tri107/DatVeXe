const express = require('express');
const router = express.Router();
const controller = require('../controllers/Xe');

// CRUD
router.get('/', controller.getAll);
router.get('/:id', controller.getById);       // id = biển số
router.post('/', controller.create);
router.put('/:id', controller.update);
router.delete('/:id', controller.delete);

module.exports = router;
