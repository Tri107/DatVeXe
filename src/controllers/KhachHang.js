const KhachHang = require('../models/KhachHang');

module.exports = {
  getAll: async (req, res, next) => {
    try {
      const data = await KhachHang.getAll();
      res.json(data);
    } catch (err) { next(err); }
  },

  getById: async (req, res, next) => {
    try {
      const item = await KhachHang.getById(req.params.id);
      if (!item) return res.status(404).json({ message: 'Không tìm thấy khách hàng' });
      res.json(item);
    } catch (err) { next(err); }
  },

  // ✅ Thêm mới
  getByPhone: async (req, res, next) => {
    try {
      const phone = req.params.phone;
      const item = await KhachHang.getByPhone(phone);
      if (!item) return res.status(404).json({ message: 'Không tìm thấy khách hàng' });
      res.json(item);
    } catch (err) { next(err); }
  },

  create: async (req, res, next) => {
    try {
      const created = await KhachHang.create(req.body);
      res.status(201).json(created);
    } catch (err) { next(err); }
  },

  update: async (req, res, next) => {
    try {
      const updated = await KhachHang.update(req.params.id, req.body);
      if (!updated) return res.status(404).json({ message: 'Không tìm thấy khách hàng' });
      res.json(updated);
    } catch (err) { next(err); }
  },

  delete: async (req, res, next) => {
    try {
      await KhachHang.delete(req.params.id);
      res.json({ message: 'Xóa khách hàng thành công' });
    } catch (err) { next(err); }
  }
};
