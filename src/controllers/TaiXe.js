const TaiXe = require('../models/TaiXe');

module.exports = {
  getAll: async (req, res, next) => {
    try { res.json(await TaiXe.getAll()); }
    catch (err) { next(err); }
  },

  getById: async (req, res, next) => {
    try {
      const item = await TaiXe.getById(req.params.id);
      if (!item) return res.status(404).json({ message: 'Không tìm thấy tài xế' });
      res.json(item);
    } catch (err) { next(err); }
  },

  create: async (req, res, next) => {
    try { res.status(201).json(await TaiXe.create(req.body)); }
    catch (err) { next(err); }
  },

  update: async (req, res, next) => {
    try {
      const updated = await TaiXe.update(req.params.id, req.body);
      if (!updated) return res.status(404).json({ message: 'Không tìm thấy tài xế' });
      res.json(updated);
    } catch (err) { next(err); }
  },

  delete: async (req, res, next) => {
    try { await TaiXe.delete(req.params.id); res.json({ message: 'Xóa tài xế thành công' }); }
    catch (err) { next(err); }
  }
};
