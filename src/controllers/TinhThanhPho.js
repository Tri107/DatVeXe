const TinhThanhPho = require('../models/TinhThanhPho');

module.exports = {
  getAll: async (req, res, next) => {
    try { res.json(await TinhThanhPho.getAll()); }
    catch (err) { next(err); }
  },

  getById: async (req, res, next) => {
    try {
      const item = await TinhThanhPho.getById(req.params.id);
      if (!item) return res.status(404).json({ message: 'Không tìm thấy tỉnh/thành' });
      res.json(item);
    } catch (err) { next(err); }
  },

  create: async (req, res, next) => {
    try { res.status(201).json(await TinhThanhPho.create(req.body)); }
    catch (err) { next(err); }
  },

  update: async (req, res, next) => {
    try {
      const updated = await TinhThanhPho.update(req.params.id, req.body);
      if (!updated) return res.status(404).json({ message: 'Không tìm thấy tỉnh/thành' });
      res.json(updated);
    } catch (err) { next(err); }
  },

  delete: async (req, res, next) => {
    try { await TinhThanhPho.delete(req.params.id); res.json({ message: 'Xóa tỉnh/thành phố thành công' }); }
    catch (err) { next(err); }
  }
};
