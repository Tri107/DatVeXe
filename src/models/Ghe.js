const db = require('../config/db');

const Ghe = {
  getAll: async () => {
    const [rows] = await db.query("SELECT * FROM Ghe");
    return rows;
  },

  getById: async (id) => {
    const [rows] = await db.query("SELECT * FROM Ghe WHERE SoGhe = ?", [id]);
    return rows[0];
  },

  create: async (data) => {
    const { TrangThai, SoChuyen, LoaiGhe } = data;
    const [result] = await db.query(
      "INSERT INTO Ghe (TrangThai, SoChuyen, LoaiGhe) VALUES (?, ?, ?)",
      [TrangThai, SoChuyen, LoaiGhe]
    );
    return { SoGhe: result.insertId, ...data };
  },

  update: async (id, data) => {
    const { TrangThai, SoChuyen, LoaiGhe } = data;
    await db.query(
      "UPDATE Ghe SET TrangThai=?, SoChuyen=?, LoaiGhe=? WHERE SoGhe=?",
      [TrangThai, SoChuyen, LoaiGhe, id]
    );
    return { SoGhe: id, ...data };
  },

  delete: async (id) => {
    await db.query("DELETE FROM Ghe WHERE SoGhe=?", [id]);
    return { message: "Xóa ghế thành công" };
  }
};

module.exports = Ghe;
