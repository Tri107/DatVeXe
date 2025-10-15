const express = require('express');
const router = express.Router();
const { requireAdmin } = require('../../middleware/auth');
const TinhThanhPho = require('../../models/TinhThanhPho');

// Trang danh sách tỉnh/thành
router.get('/', requireAdmin, async (req, res, next) => {
  try {
    const list = await TinhThanhPho.getAll();
    res.render('tinhthanhpho/index', { user: req.user, list });
  } catch (err) {
    next(err);
  }
});

// Trang chỉnh sửa
router.get('/edit/:id', requireAdmin, async (req, res, next) => {
  try {
    const item = await TinhThanhPho.getById(req.params.id);
    if (!item) return res.redirect('/admin/tinhthanhpho');
    res.render('tinhthanhpho/edit', { user: req.user, item });
  } catch (err) {
    next(err);
  }
});

// Thêm mới
router.post('/add', requireAdmin, async (req, res, next) => {
  try {
    await TinhThanhPho.create(req.body);
    res.redirect('/admin/tinhthanhpho');
  } catch (err) {
    next(err);
  }
});

// Cập nhật
router.post('/edit/:id', requireAdmin, async (req, res, next) => {
  try {
    await TinhThanhPho.update(req.params.id, req.body);
    res.redirect('/admin/tinhthanhpho');
  } catch (err) {
    next(err);
  }
});

// Xóa
router.post('/delete/:id', requireAdmin, async (req, res, next) => {
  try {
    await TinhThanhPho.delete(req.params.id);
    res.redirect('/admin/tinhthanhpho');
  } catch (err) {
    next(err);
  }
});

module.exports = router;
