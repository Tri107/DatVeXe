const express = require('express');
const router = express.Router();
const Ve = require('../../models/Ve');
const Chuyen = require('../../models/Chuyen');
const KhachHang = require('../../models/KhachHang');

// Danh sách vé
router.get('/', async (req, res, next) => {
  try {
    const list = await Ve.getAll();
    const chuyen = await Chuyen.getAll();
    const khach = await KhachHang.getAll();
    res.render('ve/index', { user: req.session?.user || {}, list, chuyen, khach });
  } catch (err) {
    next(err);
  }
});

// Thêm vé
router.post('/add', async (req, res, next) => {
  try {
    await Ve.create(req.body);
    res.redirect('/admin/ve');
  } catch (err) {
    next(err);
  }
});

// Trang sửa vé
router.get('/edit/:id', async (req, res, next) => {
  try {
    const item = await Ve.getById(req.params.id);
    const chuyen = await Chuyen.getAll();
    const khach = await KhachHang.getAll();
    res.render('ve/edit', { user: req.session?.user || {}, item, chuyen, khach });
  } catch (err) {
    next(err);
  }
});

// Cập nhật vé
router.post('/edit/:id', async (req, res, next) => {
  try {
    await Ve.update(req.params.id, req.body);
    res.redirect('/admin/ve');
  } catch (err) {
    next(err);
  }
});

// Xóa vé
router.post('/delete/:id', async (req, res, next) => {
  try {
    await Ve.delete(req.params.id);
    res.redirect('/admin/ve');
  } catch (err) {
    next(err);
  }
});

module.exports = router;
