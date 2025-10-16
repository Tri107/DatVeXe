const LoaiXe = require('../models/LoaiXe');

module.exports = {
  getAll: async (req, res, next) => {
    try { res.json(await LoaiXe.getAll()); }
    catch (err) { next(err); }
  },

  getById: async (req, res, next) => {
    try {
      const item = await LoaiXe.getById(req.params.id);
      if (!item) return res.status(404).json({ message: 'Không tìm thấy loại xe' });
      res.json(item);
    } catch (err) { next(err); }
  },

  create: async (req, res, next) => {
    try { res.status(201).json(await LoaiXe.create(req.body)); }
    catch (err) { next(err); }
  },

  update: async (req, res, next) => {
    try {
      const updated = await LoaiXe.update(req.params.id, req.body);
      if (!updated) return res.status(404).json({ message: 'Không tìm thấy loại xe' });
      res.json(updated);
    } catch (err) { next(err); }
  },

  delete: async (req, res, next) => {
    try { await LoaiXe.delete(req.params.id); res.json({ message: 'Xóa loại xe thành công' }); }
    catch (err) { next(err); }
  }
};
