const Xe = require('../models/Xe');

module.exports = {
  getAll: async (req, res, next) => {
    try { res.json(await Xe.getAll()); }
    catch (err) { next(err); }
  },

  getById: async (req, res, next) => {
    try {
      const item = await Xe.getById(req.params.id);
      if (!item) return res.status(404).json({ message: 'Không tìm thấy xe' });
      res.json(item);
    } catch (err) { next(err); }
  },

  create: async (req, res, next) => {
    try { res.status(201).json(await Xe.create(req.body)); }
    catch (err) { next(err); }
  },

  update: async (req, res, next) => {
    try {
      const updated = await Xe.update(req.params.id, req.body);
      if (!updated) return res.status(404).json({ message: 'Không tìm thấy xe' });
      res.json(updated);
    } catch (err) { next(err); }
  },

  delete: async (req, res, next) => {
    try { await Xe.delete(req.params.id); res.json({ message: 'Xóa xe thành công' }); }
    catch (err) { next(err); }
  }
};
