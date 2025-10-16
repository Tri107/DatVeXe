const express = require('express');
const router = express.Router();

router.use('/', require('./auth'));       
router.use('/loaixe', require('./loaixe'));
router.use('/tinhthanhpho', require('./TinhThanhPho'));
router.use('/benxe', require('./benxe'));
router.use('/tuyenduong', require('./tuyenduong'));
router.use('/xe', require('./xe'));
router.use('/taikhoan', require('./taikhoan'));
router.use('/khachhang', require('./khachhang'));
router.use('/tramdungchan', require('./tramdungchan'));
router.use('/chuyen', require('./chuyen'));
router.use('/ve', require('./ve'));
router.use('/taixe', require('./taixe'));

module.exports = router;