const db = require('../config/db');

const Xe = {
  getAll: async () => {
    const [rows] = await db.query("SELECT Xe_id, Bien_so, Trang_thai, LoaiXe_id FROM Xe ORDER BY Xe_id DESC");
    return rows;
  },

  getById: async (id) => {
    const [rows] = await db.query("SELECT Xe_id, Bien_so, Trang_thai, LoaiXe_id FROM Xe WHERE Xe_id = ?", [id]);
    return rows[0];
  },

  create: async (data) => {
    const { Bien_so, Trang_thai, LoaiXe_id } = data;
    const [result] = await db.query(
      "INSERT INTO Xe (Bien_so, Trang_thai, LoaiXe_id) VALUES (?, ?, ?)",
      [Bien_so, Trang_thai, LoaiXe_id]
    );
    return { Xe_id: result.insertId, ...data };
  },

  update: async (id, data) => {
    const fields = [];
    const params = [];
    if (data.Bien_so !== undefined) { fields.push("Bien_so = ?"); params.push(data.Bien_so); }
    if (data.Trang_thai !== undefined) { fields.push("Trang_thai = ?"); params.push(data.Trang_thai); }
    if (data.LoaiXe_id !== undefined) { fields.push("LoaiXe_id = ?"); params.push(data.LoaiXe_id); }
    if (!fields.length) return Xe.getById(id);
    params.push(id);
    await db.query(`UPDATE Xe SET ${fields.join(', ')} WHERE Xe_id = ?`, params);
    return Xe.getById(id);
  },

  delete: async (id) => {
    await db.query("DELETE FROM Xe WHERE Xe_id = ?", [id]);
    return { message: "Xóa xe thành công" };
  }
};

module.exports = Xe;
