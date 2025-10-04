const db = require('../config/db');

const TinhThanhPho = {
  getAll: async () => {
    const [rows] = await db.query("SELECT * FROM TinhThanhPho");
    return rows;
  },

  getById: async (id) => {
    const [rows] = await db.query("SELECT * FROM TinhThanhPho WHERE MaTinhThanhPho = ?", [id]);
    return rows[0];
  },

  create: async (data) => {
    const { TenTinhThanhPho } = data;
    const [result] = await db.query(
      "INSERT INTO TinhThanhPho (TenTinhThanhPho) VALUES (?)",
      [TenTinhThanhPho]
    );
    return { MaTinhThanhPho: result.insertId, ...data };
  },

  update: async (id, data) => {
    const { TenTinhThanhPho } = data;
    await db.query(
      "UPDATE TinhThanhPho SET TenTinhThanhPho = ? WHERE MaTinhThanhPho = ?",
      [TenTinhThanhPho, id]
    );
    return { MaTinhThanhPho: id, ...data };
  },

  delete: async (id) => {
    await db.query("DELETE FROM TinhThanhPho WHERE MaTinhThanhPho = ?", [id]);
    return { message: "Xóa tỉnh/thành phố thành công" };
  }
};

module.exports = TinhThanhPho;
