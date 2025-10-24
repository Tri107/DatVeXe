const Ve = require('../models/Ve');

module.exports = {
  getAll: async (req, res, next) => {
    try { res.json(await Ve.getAll()); }
    catch (err) { next(err); }
  },

  getById: async (req, res, next) => {
    try {
      const item = await Ve.getById(req.params.id);
      if (!item) return res.status(404).json({ message: 'Không tìm thấy vé' });
      res.json(item);
    } catch (err) { next(err); }
  },
   getByUserSDT: async (req, res, next) => {
    try {
      const { sdt } = req.params;
      const data = await Ve.getByUserSDT(sdt);
      res.json(data);
    } catch (err) {
      console.error(' Lỗi khi tải vé người dùng:', err);
      next(err);
    }
  },

  create: async (req, res, next) => {
    try { res.status(201).json(await Ve.create(req.body)); }
    catch (err) { next(err); }
  },

  update: async (req, res, next) => {
    try {
      const updated = await Ve.update(req.params.id, req.body);
      if (!updated) return res.status(404).json({ message: 'Không tìm thấy vé' });
      res.json(updated);
    } catch (err) { next(err); }
  },

  delete: async (req, res, next) => {
    try { await Ve.delete(req.params.id); res.json({ message: 'Xóa vé thành công' }); }
    catch (err) { next(err); }
  }
};
