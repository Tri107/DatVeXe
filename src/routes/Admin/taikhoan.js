const express = require('express');
const router = express.Router();
const { requireAdmin } = require('../../middleware/auth');
const TaiKhoan = require('../../models/TaiKhoan');

//Hiển thị danh sách tài khoản
router.get('/', requireAdmin, async (req, res, next) => {
  try {
    const items = await TaiKhoan.getAll();
    res.render('taikhoan/index', { user: req.user, items, error: null });
  } catch (e) { next(e); }
});

// Thêm tài khoản mới
router.post('/', requireAdmin, async (req, res, next) => {
  try {
    const { SDT, Password_hash, role } = req.body;
    await TaiKhoan.create({ SDT, Password_hash, role });
    res.redirect('/admin/taikhoan');
  } catch (e) {
    const items = await TaiKhoan.getAll();
    res.render('taikhoan/index', { user: req.user, items, error: e.message || 'Lỗi tạo tài khoản' });
  }
});

// Form sửa tài khoản (chỉ cho sửa role)
router.get('/edit/:SDT', requireAdmin, async (req, res, next) => {
  try {
    const item = await TaiKhoan.getBySDT(req.params.SDT);
    if (!item) return res.redirect('/admin/taikhoan');
    res.render('taikhoan/edit', { user: req.user, item, error: null });
  } catch (e) { next(e); }
});

// Cập nhật tài khoản (chỉ cập nhật role)
router.put('/:SDT', requireAdmin, async (req, res, next) => {
  try {
    const { role } = req.body;
    await TaiKhoan.update(req.params.SDT, { role });
    res.redirect('/admin/taikhoan');
  } catch (e) {
    const item = await TaiKhoan.getBySDT(req.params.SDT);
    res.render('taikhoan/edit', { user: req.user, item, error: e.message || 'Lỗi cập nhật vai trò' });
  }
});

// Xóa tài khoản
router.delete('/:SDT', requireAdmin, async (req, res, next) => {
  try {
    await TaiKhoan.delete(req.params.SDT);
    res.redirect('/admin/taikhoan');
  } catch (e) { next(e); }
});

module.exports = router;
