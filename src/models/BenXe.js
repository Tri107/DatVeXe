const db = require('../config/db');

const BenXe = {
  getAll: async () => {
    const [rows] = await db.query(
      `SELECT b.BenXe_id, b.BenXe_name, b.TinhThanhPho_id, t.TinhThanhPho_name
       FROM BenXe b
       JOIN TinhThanhPho t ON t.TinhThanhPho_id = b.TinhThanhPho_id
       ORDER BY b.BenXe_name ASC`
    );
    return rows;
  },

  getById: async (id) => {
    const [rows] = await db.query(
      `SELECT b.BenXe_id, b.BenXe_name, b.TinhThanhPho_id, t.TinhThanhPho_name
       FROM BenXe b
       JOIN TinhThanhPho t ON t.TinhThanhPho_id = b.TinhThanhPho_id
       WHERE b.BenXe_id = ?`, [id]
    );
    return rows[0];
  },

  create: async (data) => {
    const { BenXe_name, TinhThanhPho_id } = data;
    const [result] = await db.query(
      "INSERT INTO BenXe (BenXe_name, TinhThanhPho_id) VALUES (?, ?)",
      [BenXe_name, TinhThanhPho_id]
    );
    return { BenXe_id: result.insertId, ...data };
  },

  update: async (id, data) => {
    const fields = [];
    const params = [];
    if (data.BenXe_name !== undefined) { fields.push("BenXe_name = ?"); params.push(data.BenXe_name); }
    if (data.TinhThanhPho_id !== undefined) { fields.push("TinhThanhPho_id = ?"); params.push(data.TinhThanhPho_id); }
    if (!fields.length) return BenXe.getById(id);
    params.push(id);
    await db.query(`UPDATE BenXe SET ${fields.join(', ')} WHERE BenXe_id = ?`, params);
    return BenXe.getById(id);
  },

  delete: async (id) => {
    await db.query("DELETE FROM BenXe WHERE BenXe_id = ?", [id]);
    return { message: "Xóa bến xe thành công" };
  }
};

module.exports = BenXe;
