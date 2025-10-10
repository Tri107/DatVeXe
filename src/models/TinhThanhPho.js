const db = require('../config/db');

const TinhThanhPho = {
  getAll: async () => {
    const [rows] = await db.query("SELECT TinhThanhPho_id, TinhThanhPho_name FROM TinhThanhPho ORDER BY TinhThanhPho_name ASC");
    return rows;
  },

  getById: async (id) => {
    const [rows] = await db.query("SELECT TinhThanhPho_id, TinhThanhPho_name FROM TinhThanhPho WHERE TinhThanhPho_id = ?", [id]);
    return rows[0];
  },

  create: async (data) => {
    const { TinhThanhPho_name } = data;
    const [result] = await db.query(
      "INSERT INTO TinhThanhPho (TinhThanhPho_name) VALUES (?)",
      [TinhThanhPho_name]
    );
    return { TinhThanhPho_id: result.insertId, TinhThanhPho_name };
  },

  update: async (id, data) => {
    if (data.TinhThanhPho_name === undefined) return TinhThanhPho.getById(id);
    await db.query("UPDATE TinhThanhPho SET TinhThanhPho_name = ? WHERE TinhThanhPho_id = ?", [data.TinhThanhPho_name, id]);
    return TinhThanhPho.getById(id);
  },

  delete: async (id) => {
    await db.query("DELETE FROM TinhThanhPho WHERE TinhThanhPho_id = ?", [id]);
    return { message: "Xóa tỉnh/thành phố thành công" };
  }
};

module.exports = TinhThanhPho;
