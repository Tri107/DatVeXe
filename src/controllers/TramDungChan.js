const TramDungChan = require('../models/TramDungChan');

module.exports = {
  getAll: async (req, res, next) => {
    try { res.json(await TramDungChan.getAll()); }
    catch (err) { next(err); }
  },

  getById: async (req, res, next) => {
    try {
      const item = await TramDungChan.getById(req.params.id);
      if (!item) return res.status(404).json({ message: 'Không tìm thấy trạm dừng' });
      res.json(item);
    } catch (err) { next(err); }
  },

  create: async (req, res, next) => {
    try { res.status(201).json(await TramDungChan.create(req.body)); }
    catch (err) { next(err); }
  },

  update: async (req, res, next) => {
    try {
      const updated = await TramDungChan.update(req.params.id, req.body);
      if (!updated) return res.status(404).json({ message: 'Không tìm thấy trạm dừng' });
      res.json(updated);
    } catch (err) { next(err); }
  },

  delete: async (req, res, next) => {
    try { await TramDungChan.delete(req.params.id); res.json({ message: 'Xóa trạm dừng chân thành công' }); }
    catch (err) { next(err); }
  }
};
