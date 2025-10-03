const express = require('express');
const router = express.Router();

// Import cac route 
const loaiXeRoutes = require('./LoaiXe');


// gan tien to
router.use('/loaixe', loaiXeRoutes);


module.exports = router;
