const TaiXe = require('../models/TaiXe');
const danhSachDiemDanh = new Map();

module.exports = {
  // 🔹 Lấy tất cả tài xế
  getAll: async (req, res, next) => {
    try {
      const data = await TaiXe.getAll();
      res.json(data);
    } catch (err) {
      next(err);
    }
  },

  // 🔹 Lấy tài xế theo ID
  getById: async (req, res, next) => {
    try {
      const id = req.params.id;
      const item = await TaiXe.getById(id);
      if (!item)
        return res.status(404).json({ message: 'Không tìm thấy tài xế' });
      res.json(item);
    } catch (err) {
      next(err);
    }
  },

  // 🔹 Thêm tài xế mới
  create: async (req, res, next) => {
    try {
      const result = await TaiXe.create(req.body);
      res.status(201).json(result);
    } catch (err) {
      next(err);
    }
  },

  // 🔹 Cập nhật tài xế
  update: async (req, res, next) => {
    try {
      const id = req.params.id;
      const updated = await TaiXe.update(id, req.body);
      if (!updated)
        return res.status(404).json({ message: 'Không tìm thấy tài xế' });
      res.json(updated);
    } catch (err) {
      next(err);
    }
  },

  // 🔹 Xóa tài xế
  delete: async (req, res, next) => {
    try {
      const id = req.params.id;
      await TaiXe.delete(id);
      res.json({ message: 'Xóa tài xế thành công' });
    } catch (err) {
      next(err);
    }
  },

  // 🔸 Dashboard: Thông tin tài xế + chuyến hiện tại
  getDashboard: async (req, res, next) => {
    try {
      const taiXeId = req.params.id;
      const data = await TaiXe.getDashboardData(taiXeId);
      res.json(data);
    } catch (err) {
      next(err);
    }
  },

  // 🔸 Danh sách chuyến xe theo tài xế
  getChuyenList: async (req, res, next) => {
    try {
      const taiXeId = req.params.taixe_id;

      const list = await TaiXe.getChuyenListByTaiXe(taiXeId);

      res.json(list);
    } catch (err) {
      console.error("Lỗi getChuyenList:", err);
      next(err);
    }
  },

  // 🔸 Chi tiết chuyến xe
  getChuyenDetail: async (req, res, next) => {
    try {
      const chuyenId = req.params.chuyen_id;

      const detail = await TaiXe.getChuyenDetail(chuyenId);
      res.json(detail);
    } catch (err) {
      console.error("Lỗi getChuyenDetail:", err);
      next(err);
    }
  },

  // 🔸 Tìm tài xế theo số điện thoại
  getByPhone: async (req, res, next) => {
    try {
      const { sdt } = req.params;
      const taiXe = await TaiXe.getByPhone(sdt);

      if (!taiXe)
        return res.status(404).json({ message: 'Không tìm thấy tài xế với số điện thoại này' });

      res.json(taiXe);
    } catch (err) {
      next(err);
    }
  },

  // 🔸 Lưu điểm danh tạm (cho tài xế tick "Có mặt" / "Vắng")
  diemDanhTam: async (req, res, next) => {
    try {
      const { chuyen_id, ve_id, coMat } = req.body;

      if (!chuyen_id || !ve_id)
        return res.status(400).json({ message: 'Thiếu chuyen_id hoặc ve_id' });

      if (!danhSachDiemDanh.has(chuyen_id))
        danhSachDiemDanh.set(chuyen_id, new Map());

      const veMap = danhSachDiemDanh.get(chuyen_id);
      veMap.set(ve_id, !!coMat); // true = có mặt, false = vắng

      res.json({
        message: 'Cập nhật trạng thái thành công',
        data: { chuyen_id, ve_id, coMat },
      });
    } catch (err) {
      next(err);
    }
  },

  // 🔸 Lấy danh sách điểm danh tạm của chuyến
  getDiemDanhTam: async (req, res, next) => {
    try {
      const { chuyen_id } = req.params;
      const veMap = danhSachDiemDanh.get(Number(chuyen_id)) || new Map();

      const danhSach = Array.from(veMap.entries()).map(([ve_id, coMat]) => ({
        ve_id,
        coMat,
      }));

      res.json({ chuyen_id, danhSach });
    } catch (err) {
      next(err);
    }
  },
};
