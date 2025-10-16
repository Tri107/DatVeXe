const express = require('express');
const router = express.Router();

const Chuyen = require('../../models/Chuyen');
const TuyenDuong = require('../../models/TuyenDuong');
const Xe = require('../../models/Xe');
const TaiXe = require('../../models/TaiXe');

// Danh sách chuyến
router.get('/', async (req, res, next) => {
  try {
    const list = await Chuyen.getAll();
    const tuyen = await TuyenDuong.getAll();
    const xe = await Xe.getAll();
    const taixe = await TaiXe.getAll();
    res.render('chuyen/index', { user: req.session?.user || {}, list, tuyen, xe, taixe });
  } catch (err) {
    next(err);
  }
});

// Thêm chuyến
router.post('/add', async (req, res, next) => {
  try {
    await Chuyen.create(req.body);
    res.redirect('/admin/chuyen');
  } catch (err) {
    next(err);
  }
});

// Trang sửa chuyến
router.get('/edit/:id', async (req, res, next) => {
  try {
    const item = await Chuyen.getById(req.params.id);
    const tuyen = await TuyenDuong.getAll();
    const xe = await Xe.getAll();
    const taixe = await TaiXe.getAll();
    res.render('chuyen/edit', { user: req.session?.user || {}, item, tuyen, xe, taixe });
  } catch (err) {
    next(err);
  }
});

// Cập nhật chuyến
router.post('/edit/:id', async (req, res, next) => {
  try {
    await Chuyen.update(req.params.id, req.body);
    res.redirect('/admin/chuyen');
  } catch (err) {
    next(err);
  }
});

// Xóa chuyến
router.post('/delete/:id', async (req, res, next) => {
  try {
    await Chuyen.delete(req.params.id);
    res.redirect('/admin/chuyen');
  } catch (err) {
    next(err);
  }
});

module.exports = router;
