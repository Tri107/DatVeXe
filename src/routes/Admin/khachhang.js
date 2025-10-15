const express = require('express');
const router = express.Router();
const { requireAdmin } = require('../../middleware/auth');
const KhachHang = require('../../models/KhachHang');

// 📋 Hiển thị danh sách khách hàng
router.get('/', requireAdmin, async (req, res, next) => {
  try {
    const items = await KhachHang.getAll();
    res.render('khachhang/index', { user: req.user, items, error: null });
  } catch (e) {
    next(e);
  }
});

// ➕ Thêm khách hàng mới
router.post('/', requireAdmin, async (req, res, next) => {
  try {
    const { KhachHang_name, email, SDT } = req.body;
    await KhachHang.create({ KhachHang_name, email, SDT });
    res.redirect('/admin/khachhang');
  } catch (e) {
    const items = await KhachHang.getAll();
    res.render('khachhang/index', { user: req.user, items, error: e.message || 'Lỗi thêm khách hàng' });
  }
});

// ✏️ Form sửa thông tin khách hàng
router.get('/:id/edit', requireAdmin, async (req, res, next) => {
  try {
    const item = await KhachHang.getById(req.params.id);
    if (!item) return res.redirect('/admin/khachhang');
    res.render('khachhang/edit', { user: req.user, item, error: null });
  } catch (e) {
    next(e);
  }
});

// 🔄 Cập nhật khách hàng
router.put('/:id', requireAdmin, async (req, res, next) => {
  try {
    const { KhachHang_name, email, SDT } = req.body;
    await KhachHang.update(req.params.id, { KhachHang_name, email, SDT });
    res.redirect('/admin/khachhang');
  } catch (e) {
    const item = await KhachHang.getById(req.params.id);
    res.render('khachhang/edit', { user: req.user, item, error: e.message || 'Lỗi cập nhật thông tin khách hàng' });
  }
});

// 🗑️ Xóa khách hàng
router.delete('/:id', requireAdmin, async (req, res, next) => {
  try {
    await KhachHang.delete(req.params.id);
    res.redirect('/admin/khachhang');
  } catch (e) {
    next(e);
  }
});

module.exports = router;
