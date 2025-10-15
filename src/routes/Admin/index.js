const express = require('express');
const router = express.Router();

router.use('/', require('./auth'));       
router.use('/loaixe', require('./loaixe'));
router.use('/tinhthanhpho', require('./TinhThanhPho'));
router.use('/benxe', require('./benxe'));
router.use('/tuyenduong', require('./tuyenduong'));


module.exports = router;