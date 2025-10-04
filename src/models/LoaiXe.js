const db = require('../config/db');

const LoaiXe = {
  // Lấy toàn bộ loại xe
  getAll: async () => {
    const [rows] = await db.query("SELECT * FROM LoaiXe");
    return rows;
  },

  // Lấy loại xe theo ID
  getById: async (id) => {
    const [rows] = await db.query("SELECT * FROM LoaiXe WHERE MaLoai = ?", [id]);
    return rows[0];
  },

  // Thêm loại xe mới
  create: async (data) => {
    const { TenLoai } = data;
    const [result] = await db.query(
      "INSERT INTO LoaiXe (TenLoai) VALUES (?)",
      [TenLoai]
    );
    return { MaLoai: result.insertId, ...data };
  },

  // Cập nhật loại xe
  update: async (id, data) => {
    const { TenLoai } = data;
    await db.query(
      "UPDATE LoaiXe SET TenLoai = ? WHERE MaLoai = ?",
      [TenLoai, id]
    );
    return { MaLoai: id, ...data };
  },

  // Xóa loại xe
  delete: async (id) => {
    await db.query("DELETE FROM LoaiXe WHERE MaLoai = ?", [id]);
    return { message: "Xóa loại xe thành công" };
  }
};

module.exports = LoaiXe;
