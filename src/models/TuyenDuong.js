const db = require('../config/db');

const TuyenDuong = {
  // Lấy toàn bộ tuyến đường + thông tin bến xe
  getAll: async () => {
    const [rows] = await db.query(`
      SELECT td.*, bx.TenBen, bx.DiaChiBen
      FROM TuyenDuong td
      LEFT JOIN BenXe bx ON td.MaBen = bx.MaBen
    `);
    return rows;
  },

  // Lấy tuyến theo SoTuyen
  getById: async (id) => {
    const [rows] = await db.query(`
      SELECT td.*, bx.TenBen, bx.DiaChiBen
      FROM TuyenDuong td
      LEFT JOIN BenXe bx ON td.MaBen = bx.MaBen
      WHERE td.SoTuyen = ?
    `, [id]);
    return rows[0];
  },

  // Tạo tuyến mới
  create: async (data) => {
    const { TenTuyen, DoDaiDuong, MaBen } = data;
    const [result] = await db.query(
      "INSERT INTO TuyenDuong (TenTuyen, DoDaiDuong, MaBen) VALUES (?, ?, ?)",
      [TenTuyen, DoDaiDuong, MaBen]
    );
    return { SoTuyen: result.insertId, ...data };
  },

  // Cập nhật tuyến
  update: async (id, data) => {
    const { TenTuyen, DoDaiDuong, MaBen } = data;
    await db.query(
      "UPDATE TuyenDuong SET TenTuyen=?, DoDaiDuong=?, MaBen=? WHERE SoTuyen=?",
      [TenTuyen, DoDaiDuong, MaBen, id]
    );
    return { SoTuyen: id, ...data };
  },

  // Xóa tuyến
  delete: async (id) => {
    await db.query("DELETE FROM TuyenDuong WHERE SoTuyen=?", [id]);
    return { message: "Xóa tuyến đường thành công" };
  }
};

module.exports = TuyenDuong;
