const Ve = require('../models/Ve');
const QRCode = require('qrcode');

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
      console.error('Lỗi khi tải vé người dùng:', err);
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
    try {
      await Ve.delete(req.params.id);
      res.json({ message: 'Xóa vé thành công' });
    } catch (err) { next(err); }
  },

  generateQR: async (req, res, next) => {
    try {
      const { id } = req.params;
      const ve = await Ve.getById(id);
      if (!ve) return res.status(404).json({ message: 'Không tìm thấy vé' });

      const qrData = JSON.stringify({
        Ve_id: ve.Ve_id,
        KhachHang: ve.KhachHang_name,
        Chuyen_id: ve.Chuyen_id,
        Tuyen: `${ve.Ben_di_name} - ${ve.Ben_den_name}`,
        Ngay_gio: ve.Ngay_gio,
        Gia_ve: ve.Ve_gia,
      });

      const qrCode = await QRCode.toDataURL(qrData);

      res.json({ ve_id: ve.Ve_id, qrCode });
    } catch (err) {
      console.error('Lỗi tạo QR:', err);
      next(err);
    }
  },

  verifyQR: async (req, res, next) => {
    try {
      const { ve_id } = req.body;
      const ve = await Ve.getById(ve_id);

      if (!ve) {
        return res.status(404).json({ message: 'Mã QR không hợp lệ hoặc vé không tồn tại' });
      }

      res.json({
        message: 'Vé hợp lệ - điểm danh thành công',
        ve_id: ve.Ve_id,
        khach: ve.KhachHang_name,
        tuyen: `${ve.Ben_di_name} - ${ve.Ben_den_name}`,
        ngay_gio: ve.Ngay_gio
      });
    } catch (err) {
      console.error('Lỗi xác minh QR:', err);
      next(err);
    }
  },
};
