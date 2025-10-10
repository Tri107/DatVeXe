const bcrypt = require('bcrypt');
const TaiKhoan = require('../models/TaiKhoan');

module.exports = {
  getAll: async (req, res, next) => {
    try {
      const data = await TaiKhoan.getAll();
      res.json(data);
    } catch (err) { next(err); }
  },

  // Khóa chính là SDT
  getBySDT: async (req, res, next) => {
    try {
      const { sdt } = req.params;
      const item = await TaiKhoan.getBySDT(sdt);
      if (!item) return res.status(404).json({ message: 'Không tìm thấy tài khoản' });
      res.json(item);
    } catch (err) { next(err); }
  },

  create: async (req, res, next) => {
    try {
      const { SDT, password, role } = req.body;
      if (!SDT || !password) return res.status(400).json({ message: 'Thiếu SDT hoặc password' });
      const hash = await bcrypt.hash(password, 10);
      const created = await TaiKhoan.create({ SDT, Password_hash: hash, role: role || 'khachhang' });
      res.status(201).json(created);
    } catch (err) { next(err); }
  },

  update: async (req, res, next) => {
    try {
      const { sdt } = req.params;
      const { password, role } = req.body;
      const payload = {};
      if (password !== undefined) payload.Password_hash = await bcrypt.hash(password, 10);
      if (role !== undefined) payload.role = role;
      const updated = await TaiKhoan.update(sdt, payload);
      if (!updated) return res.status(404).json({ message: 'Không tìm thấy tài khoản' });
      res.json(updated);
    } catch (err) { next(err); }
  },

  delete: async (req, res, next) => {
    try {
      const { sdt } = req.params;
      await TaiKhoan.delete(sdt);
      res.json({ message: 'Xóa tài khoản thành công' });
    } catch (err) { next(err); }
  }
};
