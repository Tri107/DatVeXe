const TuyenDuong = require('../models/TuyenDuong');

module.exports = {
  getAll: async (req, res, next) => {
    try { res.json(await TuyenDuong.getAll()); }
    catch (err) { next(err); }
  },

  getById: async (req, res, next) => {
    try {
      const item = await TuyenDuong.getById(req.params.id);
      if (!item) return res.status(404).json({ message: 'Không tìm thấy tuyến đường' });
      res.json(item);
    } catch (err) { next(err); }
  },

  create: async (req, res, next) => {
    try { res.status(201).json(await TuyenDuong.create(req.body)); }
    catch (err) { next(err); }
  },

  update: async (req, res, next) => {
    try {
      const updated = await TuyenDuong.update(req.params.id, req.body);
      if (!updated) return res.status(404).json({ message: 'Không tìm thấy tuyến đường' });
      res.json(updated);
    } catch (err) { next(err); }
  },

  delete: async (req, res, next) => {
    try { await TuyenDuong.delete(req.params.id); res.json({ message: 'Xóa tuyến đường thành công' }); }
    catch (err) { next(err); }
  }
};
