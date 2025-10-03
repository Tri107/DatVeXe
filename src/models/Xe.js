const db = require('../config/db');

const Xe = {
  getAll: async () => {
    const [rows] = await db.query(`
      SELECT Xe.BienSo, Xe.TenXe, Xe.SucChua, LoaiXe.TenLoai
      FROM Xe
      JOIN LoaiXe ON Xe.MaLoai = LoaiXe.MaLoai
    `);
    return rows;
  },

  getByBienSo: async (bienSo) => {
    const [rows] = await db.query(`
      SELECT Xe.BienSo, Xe.TenXe, Xe.SucChua, LoaiXe.TenLoai
      FROM Xe
      JOIN LoaiXe ON Xe.MaLoai = LoaiXe.MaLoai
      WHERE Xe.BienSo = ?
    `, [bienSo]);
    return rows[0];
  },

  create: async (data) => {
    const { BienSo, TenXe, SucChua, MaLoai } = data;
    await db.query(
      "INSERT INTO Xe (BienSo, TenXe, SucChua, MaLoai) VALUES (?, ?, ?, ?)",
      [BienSo, TenXe, SucChua, MaLoai]
    );
    return data;
  },

  update: async (bienSo, data) => {
    const { TenXe, SucChua, MaLoai } = data;
    await db.query(
      "UPDATE Xe SET TenXe=?, SucChua=?, MaLoai=? WHERE BienSo=?",
      [TenXe, SucChua, MaLoai, bienSo]
    );
    return { BienSo, ...data };
  },

  delete: async (bienSo) => {
    await db.query("DELETE FROM Xe WHERE BienSo=?", [bienSo]);
    return { message: "Xóa xe thành công" };
  }
};

module.exports = Xe;
