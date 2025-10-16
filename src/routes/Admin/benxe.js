const express = require('express');
const router = express.Router();
const { requireAdmin } = require('../../middleware/auth');
const BenXe = require('../../models/BenXe');
const TinhThanhPho = require('../../models/TinhThanhPho');

// Danh sách bến xe
router.get('/', requireAdmin, async (req, res, next) => {
  try {
    const list = await BenXe.getAll();
    const tinhthanh = await TinhThanhPho.getAll();
    res.render('benxe/index', { user: req.user, list, tinhthanh });
  } catch (err) {
    next(err);
  }
});

// Trang chỉnh sửa
router.get('/edit/:id', requireAdmin, async (req, res, next) => {
  try {
    const item = await BenXe.getById(req.params.id);
    const tinhthanh = await TinhThanhPho.getAll();
    if (!item) return res.redirect('/admin/benxe');
    res.render('benxe/edit', { user: req.user, item, tinhthanh });
  } catch (err) {
    next(err);
  }
});

// Thêm mới
router.post('/add', requireAdmin, async (req, res, next) => {
  try {
    await BenXe.create(req.body);
    res.redirect('/admin/benxe');
  } catch (err) {
    next(err);
  }
});

// Cập nhật
router.post('/edit/:id', requireAdmin, async (req, res, next) => {
  try {
    await BenXe.update(req.params.id, req.body);
    res.redirect('/admin/benxe');
  } catch (err) {
    next(err);
  }
});

// Xóa
router.post('/delete/:id', requireAdmin, async (req, res, next) => {
  try {
    await BenXe.delete(req.params.id);
    res.redirect('/admin/benxe');
  } catch (err) {
    next(err);
  }
});

module.exports = router;
