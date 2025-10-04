const express = require('express');
const router = express.Router();

// 🔹 Import tất cả route con
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
const gheRoutes = require('./Ghe');
const tramDungChanChuyenRoutes = require('./TramDungChan_Chuyen');
const xeGheRoutes = require('./Xe_Ghe');

// 🔹 Gắn tiền tố /api
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
router.use('/ghe', gheRoutes);
router.use('/tramdungchan_chuyen', tramDungChanChuyenRoutes);
router.use('/xe_ghe', xeGheRoutes);

module.exports = router;
