const express = require('express');
const router = express.Router();
const { requireAdmin } = require('../../middleware/auth');
const Xe = require('../../models/Xe');
const LoaiXe = require('../../models/LoaiXe');

// 📋 Hiển thị danh sách xe
router.get('/', requireAdmin, async (req, res, next) => {
  try {
    const items = await Xe.getAll();
    const loaiXeList = await LoaiXe.getAll();
    res.render('xe/index', { user: req.user, items, loaiXeList, error: null });
  } catch (e) { next(e); }
});

// ➕ Thêm xe mới
router.post('/', requireAdmin, async (req, res, next) => {
  try {
    const { Bien_so, Trang_thai, LoaiXe_name } = req.body;
    await Xe.create({ Bien_so, Trang_thai, LoaiXe_name });
    res.redirect('/admin/xe');
  } catch (e) {
    const items = await Xe.getAll();
    const loaiXeList = await LoaiXe.getAll();
    res.render('xe/index', { user: req.user, items, loaiXeList, error: e.message || 'Lỗi tạo xe' });
  }
});

// ✏️ Form sửa xe
router.get('/:id/edit', requireAdmin, async (req, res, next) => {
  try {
    const item = await Xe.getById(req.params.id);
    if (!item) return res.redirect('/admin/xe');
    const loaiXeList = await LoaiXe.getAll();
    res.render('xe/edit', { user: req.user, item, loaiXeList, error: null });
  } catch (e) { next(e); }
});

// 🔄 Cập nhật xe
router.put('/:id', requireAdmin, async (req, res, next) => {
  try {
    const { Bien_so, Trang_thai, LoaiXe_name } = req.body;
    await Xe.update(req.params.id, { Bien_so, Trang_thai, LoaiXe_name });
    res.redirect('/admin/xe');
  } catch (e) {
    const item = await Xe.getById(req.params.id);
    const loaiXeList = await LoaiXe.getAll();
    res.render('xe/edit', { user: req.user, item, loaiXeList, error: e.message || 'Lỗi cập nhật xe' });
  }
});

// 🗑️ Xóa xe
router.delete('/:id', requireAdmin, async (req, res, next) => {
  try {
    await Xe.delete(req.params.id);
    res.redirect('/admin/xe');
  } catch (e) { next(e); }
});

module.exports = router;
