const Chuyen = require('../models/Chuyen');

module.exports = {
  // Lấy tất cả chuyến
  getAll: async (req, res, next) => {
    try {
      res.json(await Chuyen.getAll());
    } catch (err) {
      next(err);
    }
  },

  // Lấy chuyến theo ID
  getById: async (req, res, next) => {
    try {
      const item = await Chuyen.getById(req.params.id);
      if (!item) return res.status(404).json({ message: 'Không tìm thấy chuyến' });
      res.json(item);
    } catch (err) {
      next(err);
    }
  },

  //  Lấy danh sách điểm đón theo chuyến
  getDiemDon: async (req, res, next) => {
    try {
      const data = await Chuyen.getDiemDon(req.params.id);
      if (!data || data.length === 0) {
        return res.status(404).json({ message: 'Không tìm thấy điểm đón cho chuyến này' });
      }
      res.json(data);
    } catch (err) {
      next(err);
    }
  },

  //  Lấy danh sách điểm trả theo chuyến
  getDiemTra: async (req, res, next) => {
    try {
      const data = await Chuyen.getDiemTra(req.params.id);
      if (!data || data.length === 0) {
        return res.status(404).json({ message: 'Không tìm thấy điểm trả cho chuyến này' });
      }
      res.json(data);
    } catch (err) {
      next(err);
    }
  },

  // Tạo chuyến mới
  create: async (req, res, next) => {
    try {
      res.status(201).json(await Chuyen.create(req.body));
    } catch (err) {
      next(err);
    }
  },

  // Cập nhật chuyến
  update: async (req, res, next) => {
    try {
      const updated = await Chuyen.update(req.params.id, req.body);
      if (!updated) return res.status(404).json({ message: 'Không tìm thấy chuyến' });
      res.json(updated);
    } catch (err) {
      next(err);
    }
  },

  // Xóa chuyến
  delete: async (req, res, next) => {
    try {
      await Chuyen.delete(req.params.id);
      res.json({ message: 'Xóa chuyến thành công' });
    } catch (err) {
      next(err);
    }
  }
};
