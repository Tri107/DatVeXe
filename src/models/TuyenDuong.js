const db = require('../config/db');

const TuyenDuong = {
  // Lấy toàn bộ tuyến đường (hiển thị rõ bến đi - bến đến)
  getAll: async () => {
    const [rows] = await db.query(`
      SELECT 
        td.TuyenDuong_id, 
        td.Quang_duong, 
        td.Thoi_gian,
        td.Ben_di, 
        b1.BenXe_name AS BenDi_name,
        td.Ben_den, 
        b2.BenXe_name AS BenDen_name,
        CONCAT(b1.BenXe_name, ' → ', b2.BenXe_name) AS TuyenDuong_name
      FROM TuyenDuong td
      JOIN BenXe b1 ON b1.BenXe_id = td.Ben_di
      JOIN BenXe b2 ON b2.BenXe_id = td.Ben_den
      ORDER BY td.TuyenDuong_id DESC
    `);
    return rows;
  },

  // Lấy tuyến đường theo ID
  getById: async (id) => {
    const [rows] = await db.query(`
      SELECT 
        td.TuyenDuong_id, 
        td.Quang_duong, 
        td.Thoi_gian,
        td.Ben_di, 
        b1.BenXe_name AS BenDi_name,
        td.Ben_den, 
        b2.BenXe_name AS BenDen_name,
        CONCAT(b1.BenXe_name, ' → ', b2.BenXe_name) AS TuyenDuong_name
      FROM TuyenDuong td
      JOIN BenXe b1 ON b1.BenXe_id = td.Ben_di
      JOIN BenXe b2 ON b2.BenXe_id = td.Ben_den
      WHERE td.TuyenDuong_id = ?
    `, [id]);
    return rows[0];
  },

  // Tạo mới tuyến đường
  create: async (data) => {
    const { Quang_duong, Thoi_gian, Ben_di, Ben_den } = data;
    const [result] = await db.query(
      `INSERT INTO TuyenDuong (Quang_duong, Thoi_gian, Ben_di, Ben_den)
       VALUES (?, ?, ?, ?)`,
      [Quang_duong, Thoi_gian, Ben_di, Ben_den]
    );
    return { TuyenDuong_id: result.insertId, ...data };
  },

  // Cập nhật tuyến đường
  update: async (id, data) => {
    const fields = [];
    const params = [];
    ["Quang_duong","Thoi_gian","Ben_di","Ben_den"].forEach(k => {
      if (data[k] !== undefined) { fields.push(`${k} = ?`); params.push(data[k]); }
    });
    if (!fields.length) return TuyenDuong.getById(id);
    params.push(id);
    await db.query(`UPDATE TuyenDuong SET ${fields.join(', ')} WHERE TuyenDuong_id = ?`, params);
    return TuyenDuong.getById(id);
  },

  // Xóa tuyến đường
  delete: async (id) => {
    await db.query("DELETE FROM TuyenDuong WHERE TuyenDuong_id = ?", [id]);
    return { message: "Xóa tuyến đường thành công" };
  }
};

module.exports = TuyenDuong;
