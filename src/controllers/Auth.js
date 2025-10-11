const bcrypt = require('bcrypt');
const TaiKhoan = require('../models/TaiKhoan');

const PHONE_REGEX = /^0\d{9}$/;
const normalizePhone = s => String(s||'').replace(/\s+/g,'').replace(/^\+84/, '0');

module.exports = {
  register: async (req, res, next) => {
    try {
      let { SDT, password } = req.body;
      SDT = normalizePhone(SDT);
      if (!SDT || !password) return res.status(400).json({ message: 'Thiếu SDT hoặc password' });
      if (!PHONE_REGEX.test(SDT)) return res.status(400).json({ message: 'SDT không hợp lệ' });
      if (String(password).length < 6) return res.status(400).json({ message: 'Password tối thiểu 6 ký tự' });

      const existed = await TaiKhoan.getBySDT(SDT);
      if (existed) return res.status(409).json({ message: 'SDT đã tồn tại' });

      const hash = await bcrypt.hash(password, 10);
      await TaiKhoan.create({ SDT, Password_hash: hash, role: 'khachhang' });
      return res.status(201).json({ SDT, role: 'khachhang', message: 'Đăng ký thành công' });
    } catch (e) { return next(e); }
  },

  login: async (req, res, next) => {
    try {
      let { SDT, password } = req.body;
      SDT = normalizePhone(SDT);
      if (!SDT || !password) return res.status(400).json({ message: 'Thiếu SDT hoặc password' });

      const tk = await TaiKhoan.getBySDT(SDT);
      if (!tk) return res.status(401).json({ message: 'Sai thông tin đăng nhập' });

      const ok = await bcrypt.compare(password, tk.Password_hash);
      if (!ok) return res.status(401).json({ message: 'Sai thông tin đăng nhập' });

      // Lưu user vào session
      req.session.user = { SDT: tk.SDT, role: tk.role };
      return res.json({ message: 'Đăng nhập thành công', user: req.session.user });
    } catch (e) { return next(e); }
  },

  logout: (req, res, next) => {
    req.session.destroy(err => {
      if (err) return next(err);
      res.clearCookie('connect.sid'); // cookie mặc định của express-session
      return res.json({ message: 'Đăng xuất thành công' });
    });
  },

  me: (req, res) => {
    if (!req.session?.user) return res.status(401).json({ message: 'Chưa đăng nhập' });
    return res.json({ user: req.session.user });
  }
};
