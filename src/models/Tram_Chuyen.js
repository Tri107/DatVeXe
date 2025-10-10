const db = require('../config/db');

const Tram_Chuyen = {
  getAll: async () => {
    const [rows] = await db.query(
      `SELECT tc.Chuyen_id, tc.TramDungChan_id
       FROM Tram_Chuyen tc
       ORDER BY tc.Chuyen_id DESC, tc.TramDungChan_id ASC`
    );
    return rows;
  },

  getOne: async (Chuyen_id, TramDungChan_id) => {
    const [rows] = await db.query(
      "SELECT Chuyen_id, TramDungChan_id FROM Tram_Chuyen WHERE Chuyen_id = ? AND TramDungChan_id = ?",
      [Chuyen_id, TramDungChan_id]
    );
    return rows[0];
  },

  create: async (data) => {
    const { Chuyen_id, TramDungChan_id } = data;
    await db.query(
      "INSERT INTO Tram_Chuyen (Chuyen_id, TramDungChan_id) VALUES (?, ?)",
      [Chuyen_id, TramDungChan_id]
    );
    return { Chuyen_id, TramDungChan_id };
  },

  delete: async (Chuyen_id, TramDungChan_id) => {
    await db.query(
      "DELETE FROM Tram_Chuyen WHERE Chuyen_id = ? AND TramDungChan_id = ?",
      [Chuyen_id, TramDungChan_id]
    );
    return { message: "Xóa liên kết trạm - chuyến thành công" };
  }
};

module.exports = Tram_Chuyen;
