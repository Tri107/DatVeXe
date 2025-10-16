const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const TaiKhoan = require('../../models/TaiKhoan');
const { requireAdmin } = require('../../middleware/auth');

// GET login
router.get('/login', (req, res) => {
  res.render('auth/login', { error: null });
});

// POST login
router.post('/login', async (req, res) => {
  const { SDT, password } = req.body;
  const tk = await TaiKhoan.getBySDT(String(SDT || '').trim());
  if (!tk) return res.render('auth/login', { error: 'Sai thông tin đăng nhập' });

  const ok = await bcrypt.compare(password, tk.Password_hash);
  if (!ok) return res.render('auth/login', { error: 'Sai thông tin đăng nhập' });

  // Tạo JWT
  const token = jwt.sign(
    { sdt: tk.SDT, role: tk.role },
    process.env.JWT_SECRET,
    { expiresIn: '2h' }
  );

  res.cookie('access_token', token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: false, 
    maxAge: 2 * 60 * 60 * 1000,
  });

  res.redirect('/admin');
});

// Đăng xuất
router.post('/logout', (req, res) => {
  res.clearCookie('access_token');
  res.redirect('/admin/login');
});

// Dashboard
router.get('/', requireAdmin, (req, res) => {
  res.render('dashboard', { user: req.user });
});

module.exports = router;