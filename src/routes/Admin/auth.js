const express = require('express');
const router = express.Router();
const { requireAdmin } = require('../../middleware/auth');
const TaiKhoan = require('../../models/TaiKhoan');
const bcrypt = require('bcrypt');

router.get('/login', (req, res) => {
  if (req.session.user) return res.redirect('/admin');
  res.render('auth/login', { error: null });
});

router.post('/login', async (req, res) => {
  const { SDT, password } = req.body;
  const tk = await TaiKhoan.getBySDT(String(SDT||'').trim());
  if (!tk) return res.render('auth/login', { error: 'Sai thông tin đăng nhập' });
  const ok = await bcrypt.compare(password, tk.Password_hash);
  if (!ok) return res.render('auth/login', { error: 'Sai thông tin đăng nhập' });
  req.session.user = { SDT: tk.SDT, role: tk.role };
  res.redirect('/admin');
});

router.post('/logout', (req, res) => {
  req.session.destroy(() => {
    res.clearCookie('connect.sid');
    res.redirect('/admin/login');
  });
});

router.get('/', requireAdmin, (req, res) => {
  res.render('dashboard', { user: req.session.user });
});

module.exports = router;
