const Tram_Chuyen = require('../models/Tram_Chuyen');

module.exports = {
  getAll: async (req, res, next) => {
    try { res.json(await Tram_Chuyen.getAll()); }
    catch (err) { next(err); }
  },

  getOne: async (req, res, next) => {
    try {
      const { chuyenId, tramId } = req.params;
      const item = await Tram_Chuyen.getOne(chuyenId, tramId);
      if (!item) return res.status(404).json({ message: 'Không tìm thấy liên kết trạm - chuyến' });
      res.json(item);
    } catch (err) { next(err); }
  },

  create: async (req, res, next) => {
    try {
      const { Chuyen_id, TramDungChan_id } = req.body;
      if (!Chuyen_id || !TramDungChan_id) return res.status(400).json({ message: 'Thiếu Chuyen_id hoặc TramDungChan_id' });
      const created = await Tram_Chuyen.create({ Chuyen_id, TramDungChan_id });
      res.status(201).json(created);
    } catch (err) { next(err); }
  },

  delete: async (req, res, next) => {
    try {
      const { chuyenId, tramId } = req.params;
      await Tram_Chuyen.delete(chuyenId, tramId);
      res.json({ message: 'Xóa liên kết trạm - chuyến thành công' });
    } catch (err) { next(err); }
  }
};
