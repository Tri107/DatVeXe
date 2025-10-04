const db = require('../config/db');

const Xe = {
  // Lấy toàn bộ xe kèm tên loại xe
  getAll: async () => {
    const [rows] = await db.query(`
      SELECT x.*, lx.TenLoai
      FROM Xe x
      LEFT JOIN LoaiXe lx ON x.MaLoai = lx.MaLoai
    `);
    return rows;
  },

  // Lấy chi tiết 1 xe theo biển số
  getById: async (bienSo) => {
    const [rows] = await db.query(`
      SELECT x.*, lx.TenLoai
      FROM Xe x
      LEFT JOIN LoaiXe lx ON x.MaLoai = lx.MaLoai
      WHERE x.BienSo = ?
    `, [bienSo]);
    return rows[0];
  },

  // Thêm xe mới
  create: async (data) => {
    const { BienSo, TenXe, SucChua, MaLoai } = data;
    const [result] = await db.query(
      "INSERT INTO Xe (BienSo, TenXe, SucChua, MaLoai) VALUES (?, ?, ?, ?)",
      [BienSo, TenXe, SucChua, MaLoai]
    );
    return { BienSo, ...data };
  },

  // Cập nhật thông tin xe
  update: async (bienSo, data) => {
    const { TenXe, SucChua, MaLoai } = data;
    await db.query(
      "UPDATE Xe SET TenXe=?, SucChua=?, MaLoai=? WHERE BienSo=?",
      [TenXe, SucChua, MaLoai, bienSo]
    );
    return { BienSo: bienSo, ...data };
  },

  // Xóa xe
  delete: async (bienSo) => {
    await db.query("DELETE FROM Xe WHERE BienSo=?", [bienSo]);
    return { message: "Xóa xe thành công" };
  }
};

module.exports = Xe;
