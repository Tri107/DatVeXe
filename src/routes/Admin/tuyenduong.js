const express = require('express');
const router = express.Router();
const { requireAdmin } = require('../../middleware/auth');
const TuyenDuong = require('../../models/TuyenDuong');
const BenXe = require('../../models/BenXe');

// 📍 Danh sách tuyến đường
router.get('/', requireAdmin, async (req, res, next) => {
  try {
    const list = await TuyenDuong.getAll();
    const benxe = await BenXe.getAll(); // để hiển thị dropdown
    res.render('tuyenduong/index', { user: req.user, list, benxe });
  } catch (err) {
    next(err);
  }
});

// 📍 Form chỉnh sửa
router.get('/edit/:id', requireAdmin, async (req, res, next) => {
  try {
    const item = await TuyenDuong.getById(req.params.id);
    const benxe = await BenXe.getAll();
    if (!item) return res.redirect('/admin/tuyenduong');
    res.render('tuyenduong/edit', { user: req.user, item, benxe });
  } catch (err) {
    next(err);
  }
});

// 📍 Thêm tuyến đường
router.post('/add', requireAdmin, async (req, res, next) => {
  try {
    await TuyenDuong.create(req.body);
    res.redirect('/admin/tuyenduong');
  } catch (err) {
    next(err);
  }
});

// 📍 Cập nhật tuyến đường
router.post('/edit/:id', requireAdmin, async (req, res, next) => {
  try {
    await TuyenDuong.update(req.params.id, req.body);
    res.redirect('/admin/tuyenduong');
  } catch (err) {
    next(err);
  }
});

// 📍 Xóa tuyến đường
router.post('/delete/:id', requireAdmin, async (req, res, next) => {
  try {
    await TuyenDuong.delete(req.params.id);
    res.redirect('/admin/tuyenduong');
  } catch (err) {
    next(err);
  }
});

module.exports = router;
