const db = require('../config/db');

const LoaiXe = {
  getAll: async () => {
    const [rows] = await db.query("SELECT * FROM LoaiXe");
    return rows;
  },

  getById: async (id) => {
    const [rows] = await db.query("SELECT * FROM LoaiXe WHERE MaLoai = ?", [id]);
    return rows[0];
  },

  create: async (data) => {
    const { TenLoai } = data;
    const [result] = await db.query(
      "INSERT INTO LoaiXe (TenLoai) VALUES (?)",
      [TenLoai]
    );
    return { MaLoai: result.insertId, TenLoai };
  },

  update: async (id, data) => {
    const { TenLoai } = data;
    await db.query("UPDATE LoaiXe SET TenLoai=? WHERE MaLoai=?", [TenLoai, id]);
    return { MaLoai: id, TenLoai };
  },

  delete: async (id) => {
    await db.query("DELETE FROM LoaiXe WHERE MaLoai=?", [id]);
    return { message: "Xóa loại xe thành công" };
  }
};

module.exports = LoaiXe;
