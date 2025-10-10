const db = require('../config/db');

const LoaiXe = {
  getAll: async () => {
    const [rows] = await db.query("SELECT LoaiXe_id, LoaiXe_name, Suc_chua FROM LoaiXe ORDER BY LoaiXe_id DESC");
    return rows;
  },

  getById: async (id) => {
    const [rows] = await db.query("SELECT LoaiXe_id, LoaiXe_name, Suc_chua FROM LoaiXe WHERE LoaiXe_id = ?", [id]);
    return rows[0];
  },

  create: async (data) => {
    const { LoaiXe_name, Suc_chua } = data;
    const [result] = await db.query(
      "INSERT INTO LoaiXe (LoaiXe_name, Suc_chua) VALUES (?, ?)",
      [LoaiXe_name, Suc_chua]
    );
    return { LoaiXe_id: result.insertId, ...data };
  },

  update: async (id, data) => {
    const fields = [];
    const params = [];
    if (data.LoaiXe_name !== undefined) { fields.push("LoaiXe_name = ?"); params.push(data.LoaiXe_name); }
    if (data.Suc_chua !== undefined) { fields.push("Suc_chua = ?"); params.push(data.Suc_chua); }
    if (!fields.length) return LoaiXe.getById(id);
    params.push(id);
    await db.query(`UPDATE LoaiXe SET ${fields.join(', ')} WHERE LoaiXe_id = ?`, params);
    return LoaiXe.getById(id);
  },

  delete: async (id) => {
    await db.query("DELETE FROM LoaiXe WHERE LoaiXe_id = ?", [id]);
    return { message: "Xóa loại xe thành công" };
  }
};

module.exports = LoaiXe;
