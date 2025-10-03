const express = require("express")
const router = express.Router();
const controller = require("../controllers/Xe")

router.get('/',controller.getAll)
router.get('/:bienso',controller.getByBienSo)
router.post('/',controller.create)
router.put('/:bienso',controller.update)
router.delete('/:bienso',controller.delete)

module.exports = router