const db = require('../config/db');

const Xe = {
  getAll: async () => {
    const [rows] = await db.query("SELECT Xe.Xe_id, Xe.Bien_so, Xe.Trang_thai, LoaiXe.LoaiXe_name FROM Xe INNER JOIN LoaiXe ON Xe.LoaiXe_id = LoaiXe.LoaiXe_id ORDER BY Xe.Xe_id DESC");
    return rows;
  },

  getById: async (id) => {
    const [rows] = await db.query("SELECT Xe.Xe_id, Xe.Bien_so, Xe.Trang_thai, LoaiXe.LoaiXe_name FROM Xe INNER JOIN LoaiXe ON Xe.LoaiXe_id = LoaiXe.LoaiXe_id WHERE Xe.Xe_id = ?", [id]);
    return rows[0];
  },

  create: async (data) => {
    const { Bien_so, Trang_thai, LoaiXe_name } = data;
    const [lx] = await db.query("SELECT LoaiXe_id FROM LoaiXe WHERE LoaiXe_name = ?", [LoaiXe_name]);
    if (lx.length === 0) throw new Error(`Không tìm thấy loại xe '${LoaiXe_name}'`);
    const LoaiXe_id = lx[0].LoaiXe_id;
    const [check] = await db.query("SELECT * FROM Xe WHERE Bien_so = ?", [Bien_so]);
    if (check.length > 0) throw new Error(`Biển số ${Bien_so} đã tồn tại!`);
    const [result] = await db.query("INSERT INTO Xe (Bien_so, Trang_thai, LoaiXe_id) VALUES (?, ?, ?)", [Bien_so, Trang_thai, LoaiXe_id]);
    const [rows] = await db.query("SELECT Xe.Xe_id, Xe.Bien_so, Xe.Trang_thai, LoaiXe.LoaiXe_name FROM Xe INNER JOIN LoaiXe ON Xe.LoaiXe_id = LoaiXe.LoaiXe_id WHERE Xe.Xe_id = ?", [result.insertId]);
    return rows[0];
  },

  update: async (id, data) => {
    const fields = [];
    const params = [];
    if (data.Bien_so !== undefined) { fields.push("Bien_so = ?"); params.push(data.Bien_so); }
    if (data.Trang_thai !== undefined) { fields.push("Trang_thai = ?"); params.push(data.Trang_thai); }
    if (data.LoaiXe_name !== undefined) {
      const [lx] = await db.query("SELECT LoaiXe_id FROM LoaiXe WHERE LoaiXe_name = ?", [data.LoaiXe_name]);
      if (lx.length === 0) throw new Error(`Không tìm thấy loại xe '${data.LoaiXe_name}'`);
      fields.push("LoaiXe_id = ?");
      params.push(lx[0].LoaiXe_id);
    }
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
