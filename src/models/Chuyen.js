const db = require('../config/db');

const Chuyen = {
  getAll: async () => {
    const [rows] = await db.query(
      `SELECT c.Chuyen_id, c.Chuyen_name, c.Tinh_Trang, c.Ngay_gio,
              c.TuyenDuong_id, c.Xe_id, c.TaiXe_id
       FROM Chuyen c
       ORDER BY c.Ngay_gio DESC`
    );
    return rows;
  },

  getById: async (id) => {
    const [rows] = await db.query(
      `SELECT c.Chuyen_id, c.Chuyen_name, c.Tinh_Trang, c.Ngay_gio,
              c.TuyenDuong_id, c.Xe_id, c.TaiXe_id
       FROM Chuyen c
       WHERE c.Chuyen_id = ?`, [id]
    );
    return rows[0];
  },

  create: async (data) => {
    const { Chuyen_name, Tinh_Trang, Ngay_gio, TuyenDuong_id, Xe_id, TaiXe_id } = data;
    const [result] = await db.query(
      "INSERT INTO Chuyen (Chuyen_name, Tinh_Trang, Ngay_gio, TuyenDuong_id, Xe_id, TaiXe_id) VALUES (?, ?, ?, ?, ?, ?)",
      [Chuyen_name, Tinh_Trang, Ngay_gio, TuyenDuong_id, Xe_id, TaiXe_id]
    );
    return { Chuyen_id: result.insertId, ...data };
  },

  update: async (id, data) => {
    const fields = [];
    const params = [];
    ["Chuyen_name","Tinh_Trang","Ngay_gio","TuyenDuong_id","Xe_id","TaiXe_id"].forEach(k=>{
      if (data[k] !== undefined) { fields.push(`${k} = ?`); params.push(data[k]); }
    });
    if (!fields.length) return Chuyen.getById(id);
    params.push(id);
    await db.query(`UPDATE Chuyen SET ${fields.join(', ')} WHERE Chuyen_id = ?`, params);
    return Chuyen.getById(id);
  },

  delete: async (id) => {
    await db.query("DELETE FROM Chuyen WHERE Chuyen_id = ?", [id]);
    return { message: "Xóa chuyến thành công" };
  }
};

module.exports = Chuyen;
