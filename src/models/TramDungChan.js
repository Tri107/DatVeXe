const db = require('../config/db');

const TramDungChan = {
  getAll: async () => {
    const [rows] = await db.query(
      "SELECT TramDungChan_id, TramDungChan_name, Thoi_gian_dung FROM TramDungChan ORDER BY TramDungChan_id DESC"
    );
    return rows;
  },

  getById: async (id) => {
    const [rows] = await db.query(
      "SELECT TramDungChan_id, TramDungChan_name, Thoi_gian_dung FROM TramDungChan WHERE TramDungChan_id = ?",
      [id]
    );
    return rows[0];
  },

  create: async (data) => {
    const { TramDungChan_name, Thoi_gian_dung } = data;
    const [result] = await db.query(
      "INSERT INTO TramDungChan (TramDungChan_name, Thoi_gian_dung) VALUES (?, ?)",
      [TramDungChan_name, Thoi_gian_dung]
    );
    return { TramDungChan_id: result.insertId, ...data };
  },

  update: async (id, data) => {
    const fields = [];
    const params = [];
    if (data.TramDungChan_name !== undefined) { fields.push("TramDungChan_name = ?"); params.push(data.TramDungChan_name); }
    if (data.Thoi_gian_dung !== undefined) { fields.push("Thoi_gian_dung = ?"); params.push(data.Thoi_gian_dung); }
    if (!fields.length) return TramDungChan.getById(id);
    params.push(id);
    await db.query(`UPDATE TramDungChan SET ${fields.join(', ')} WHERE TramDungChan_id = ?`, params);
    return TramDungChan.getById(id);
  },

  delete: async (id) => {
    await db.query("DELETE FROM TramDungChan WHERE TramDungChan_id = ?", [id]);
    return { message: "Xóa trạm dừng chân thành công" };
  }
};

module.exports = TramDungChan;
