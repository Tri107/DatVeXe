const express = require('express');
const router = express.Router();

// Import cac route 
const loaiXeRoutes = require('./LoaiXe');
const xeRoutes = require('./Xe')

// gan tien to
router.use('/loaixe', loaiXeRoutes);
router.use('/xe', xeRoutes)

module.exports = router;
