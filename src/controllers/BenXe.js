const BenXe = require('../models/BenXe');

module.exports = {
  getAll: async (req, res, next) => {
    try { res.json(await BenXe.getAll()); }
    catch (err) { next(err); }
  },

  getById: async (req, res, next) => {
    try {
      const item = await BenXe.getById(req.params.id);
      if (!item) return res.status(404).json({ message: 'Không tìm thấy bến xe' });
      res.json(item);
    } catch (err) { next(err); }
  },

  create: async (req, res, next) => {
    try { res.status(201).json(await BenXe.create(req.body)); }
    catch (err) { next(err); }
  },

  update: async (req, res, next) => {
    try {
      const updated = await BenXe.update(req.params.id, req.body);
      if (!updated) return res.status(404).json({ message: 'Không tìm thấy bến xe' });
      res.json(updated);
    } catch (err) { next(err); }
  },

  delete: async (req, res, next) => {
    try { await BenXe.delete(req.params.id); res.json({ message: 'Xóa bến xe thành công' }); }
    catch (err) { next(err); }
  }
};
