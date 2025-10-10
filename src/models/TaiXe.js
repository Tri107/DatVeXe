const db = require('../config/db');

const TaiXe = {
  getAll: async () => {
    const [rows] = await db.query(
      "SELECT TaiXe_id, TaiXe_name, TaiXe_age, TaiXe_BangLai, NgayVaoLam, SDT FROM TaiXe ORDER BY TaiXe_id DESC"
    );
    return rows;
  },

  getById: async (id) => {
    const [rows] = await db.query(
      "SELECT TaiXe_id, TaiXe_name, TaiXe_age, TaiXe_BangLai, NgayVaoLam, SDT FROM TaiXe WHERE TaiXe_id = ?",
      [id]
    );
    return rows[0];
  },

  create: async (data) => {
    const { TaiXe_name, TaiXe_age, TaiXe_BangLai, NgayVaoLam, SDT } = data;
    const [result] = await db.query(
      "INSERT INTO TaiXe (TaiXe_name, TaiXe_age, TaiXe_BangLai, NgayVaoLam, SDT) VALUES (?, ?, ?, ?, ?)",
      [TaiXe_name, TaiXe_age, TaiXe_BangLai, NgayVaoLam, SDT]
    );
    return { TaiXe_id: result.insertId, ...data };
  },

  update: async (id, data) => {
    const fields = [];
    const params = [];
    ["TaiXe_name","TaiXe_age","TaiXe_BangLai","NgayVaoLam","SDT"].forEach(k=>{
      if (data[k] !== undefined) { fields.push(`${k} = ?`); params.push(data[k]); }
    });
    if (!fields.length) return TaiXe.getById(id);
    params.push(id);
    await db.query(`UPDATE TaiXe SET ${fields.join(', ')} WHERE TaiXe_id = ?`, params);
    return TaiXe.getById(id);
  },

  delete: async (id) => {
    await db.query("DELETE FROM TaiXe WHERE TaiXe_id = ?", [id]);
    return { message: "Xóa tài xế thành công" };
  }
};

module.exports = TaiXe;
