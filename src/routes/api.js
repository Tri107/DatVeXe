const express = require('express');
const router = express.Router();

// Import tất cả route con
const loaiXeRoutes = require('./LoaiXe');
const xeRoutes = require('./Xe');
const veRoutes = require('./Ve');
const taiKhoanRoutes = require('./TaiKhoan');
const khachHangRoutes = require('./KhachHang');
const chuyenRoutes = require('./Chuyen');
const tramDungChanRoutes = require('./TramDungChan');
const tuyenDuongRoutes = require('./TuyenDuong');
const benXeRoutes = require('./BenXe');
const tinhThanhPhoRoutes = require('./TinhThanhPho');
const taiXeRoutes = require('./TaiXe')
const tramChuyenRoutes = require('./Tram_Chuyen');
const authRoutes = require('./Auth'); 
const paymentRoutes = require('./Payment');
const emailRoutes = require('./Email');

// Gắn tiền tố /api
router.use('/loaixe', loaiXeRoutes);
router.use('/xe', xeRoutes);
router.use('/ve', veRoutes);
router.use('/taikhoan', taiKhoanRoutes);
router.use('/khachhang', khachHangRoutes);
router.use('/chuyen', chuyenRoutes);
router.use('/tramdungchan', tramDungChanRoutes);
router.use('/tuyenduong', tuyenDuongRoutes);
router.use('/benxe', benXeRoutes);
router.use('/tinhthanhpho', tinhThanhPhoRoutes);
router.use('/tram_chuyen', tramChuyenRoutes);
router.use('/taixe',taiXeRoutes);
router.use('/auth', authRoutes);
router.use('/payment',paymentRoutes) 
router.use('/email', emailRoutes);
module.exports = router;
