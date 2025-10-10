const bcrypt = require('bcrypt');
const TaiKhoan = require('../models/TaiKhoan');

module.exports = {
  getAll: async (req, res, next) => {
    try {
      const data = await TaiKhoan.getAll();
      res.json(data);
    } catch (err) {
      next(err);
    }
  },
  getBySDT: async (req, res, next) => {
    try {
      const { sdt } = req.params;
      const item = await TaiKhoan.getBySDT(sdt);
      if (!item) {
        return res.status(404).json({ message: 'Không tìm thấy tài khoản' });
      }
      res.json(item);
    } catch (err) {
      next(err);
    }
  },
  create: async (req, res, next) => {
    try {
      
      const { SDT, Password_hash, role } = req.body;

      if (!SDT || !Password_hash) {
        return res.status(400).json({ message: 'Thiếu SDT hoặc Password_hash' });
      }
      const hash = await bcrypt.hash(Password_hash, 10);
      const created = await TaiKhoan.create({
        SDT,
        Password_hash: hash,
        role: role || 'khachhang'
      });

      res.status(201).json({
        message: 'Tạo tài khoản thành công',
        data: created
      });
    } catch (err) {
      console.error(err);
      next(err);
    }
  },
 update: async (req, res, next) => {
    try {
      const { sdt } = req.params;
      const { Password_hash, role } = req.body;

      const payload = {};
      if (Password_hash) payload.Password_hash = await bcrypt.hash(Password_hash, 10);
      if (role) payload.role = role;

      const updated = await TaiKhoan.update(sdt, payload);
      if (!updated) {
        return res.status(404).json({ message: 'Không tìm thấy tài khoản' });
      }

      res.json({
        message: 'Cập nhật tài khoản thành công',
        data: updated
      });
    } catch (err) {
      next(err);
    }
  },

  delete: async (req, res, next) => {
    try {
      const { sdt } = req.params;
      await TaiKhoan.delete(sdt);
      res.json({ message: 'Xóa tài khoản thành công' });
    } catch (err) {
      next(err);
    }
  }
};
