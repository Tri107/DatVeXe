const db = require('../config/db');

const Chuyen = {
  // Lấy toàn bộ chuyến (kèm thông tin tuyến)
  getAll: async () => {
    const [rows] = await db.query(`
      SELECT c.*, td.TenTuyen, td.DoDaiDuong
      FROM Chuyen c
      LEFT JOIN TuyenDuong td ON c.SoTuyen = td.SoTuyen
    `);
    return rows;
  },

  // Lấy chi tiết chuyến theo MaChuyen
  getById: async (id) => {
    const [rows] = await db.query(`
      SELECT c.*, td.TenTuyen, td.DoDaiDuong
      FROM Chuyen c
      LEFT JOIN TuyenDuong td ON c.SoTuyen = td.SoTuyen
      WHERE c.MaChuyen = ?
    `, [id]);
    return rows[0];
  },

  // Tạo chuyến mới
  create: async (data) => {
    const { SoTuyen, ThoiGianKhoiHanh, DuKienKhoiHanh } = data;
    const [result] = await db.query(
      "INSERT INTO Chuyen (SoTuyen, ThoiGianKhoiHanh, DuKienKhoiHanh) VALUES (?, ?, ?)",
      [SoTuyen, ThoiGianKhoiHanh, DuKienKhoiHanh]
    );
    return { MaChuyen: result.insertId, ...data };
  },

  // Cập nhật chuyến
  update: async (id, data) => {
    const { SoTuyen, ThoiGianKhoiHanh, DuKienKhoiHanh } = data;
    await db.query(
      "UPDATE Chuyen SET SoTuyen=?, ThoiGianKhoiHanh=?, DuKienKhoiHanh=? WHERE MaChuyen=?",
      [SoTuyen, ThoiGianKhoiHanh, DuKienKhoiHanh, id]
    );
    return { MaChuyen: id, ...data };
  },

  // Xóa chuyến
  delete: async (id) => {
    await db.query("DELETE FROM Chuyen WHERE MaChuyen=?", [id]);
    return { message: "Xóa chuyến thành công" };
  }
};

module.exports = Chuyen;
