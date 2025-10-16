const express = require('express');
const router = express.Router();
const { requireAdmin } = require('../middleware/auth');
const TaiKhoan = require('../models/TaiKhoan');
const bcrypt = require('bcrypt');
const LoaiXe = require('../models/LoaiXe');

// Trang login
router.get('/login', (req, res) => {
  if (req.session.user) return res.redirect('/admin');
  res.render('auth/login', { error: null });
});

// Submit login
router.post('/login', async (req, res) => {
  try {
    const { SDT, password } = req.body;
    const tk = await TaiKhoan.getBySDT(String(SDT || '').trim());
    if (!tk) return res.render('auth/login', { error: 'Sai thông tin đăng nhập' });
    const ok = await bcrypt.compare(password, tk.Password_hash);
    if (!ok) return res.render('auth/login', { error: 'Sai thông tin đăng nhập' });
    req.session.user = { SDT: tk.SDT, role: tk.role };
    return res.redirect('/admin');
  } catch (e) {
    return res.render('auth/login', { error: 'Lỗi máy chủ' });
  }
});

// Logout
router.post('/logout', (req, res) => {
  req.session.destroy(() => {
    res.clearCookie('connect.sid');
    res.redirect('/admin/login');
  });
});

// Dashboard (chỉ admin)
router.get('/', requireAdmin, async (req, res) => {
  res.render('dashboard', { user: req.session.user });
});

// ===== Loại Xe CRUD (HTML) =====

// List + form create
router.get('/loaixe', requireAdmin, async (req, res, next) => {
  try {
    const items = await LoaiXe.getAll();
    res.render('loaixe/index', { user: req.session.user, items, error: null });
  } catch (e) { next(e); }
});

// Create
router.post('/loaixe', requireAdmin, async (req, res, next) => {
  try {
    const { LoaiXe_name, Suc_chua } = req.body;
    await LoaiXe.create({ LoaiXe_name, Suc_chua: Number(Suc_chua) });
    res.redirect('/admin/loaixe');
  } catch (e) {
    const items = await LoaiXe.getAll();
    res.render('loaixe/index', { user: req.session.user, items, error: e.message || 'Lỗi tạo loại xe' });
  }
});

// Edit form
router.get('/loaixe/edit/:id', requireAdmin, async (req, res, next) => {
  try {
    const item = await LoaiXe.getById(req.params.id);
    if (!item) return res.redirect('/admin/loaixe');
    res.render('loaixe/edit', { user: req.session.user, item, error: null });
  } catch (e) { next(e); }
});

// Update (method-override)
router.put('/loaixe/:id', requireAdmin, async (req, res, next) => {
  try {
    const { LoaiXe_name, Suc_chua } = req.body;
    await LoaiXe.update(req.params.id, { LoaiXe_name, Suc_chua: Number(Suc_chua) });
    res.redirect('/admin/loaixe');
  } catch (e) {
    const item = await LoaiXe.getById(req.params.id);
    res.render('loaixe/edit', { user: req.session.user, item, error: e.message || 'Lỗi cập nhật' });
  }
});

// Delete (method-override)
router.delete('/loaixe/:id', requireAdmin, async (req, res, next) => {
  try {
    await LoaiXe.delete(req.params.id);
    res.redirect('/admin/loaixe');
  } catch (e) { next(e); }
});

module.exports = router;
