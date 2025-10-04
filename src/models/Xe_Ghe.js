const db = require('../config/db');

const Xe_Ghe = {
  getAll: async () => {
    const [rows] = await db.query(`
      SELECT xg.BienSo, xg.SoGhe, x.TenXe, g.TrangThai
      FROM Xe_Ghe xg
      JOIN Xe x ON xg.BienSo = x.BienSo
      JOIN Ghe g ON xg.SoGhe = g.SoGhe
    `);
    return rows;
  },

  create: async (data) => {
    const { BienSo, SoGhe } = data;
    await db.query(
      "INSERT INTO Xe_Ghe (BienSo, SoGhe) VALUES (?, ?)",
      [BienSo, SoGhe]
    );
    return { message: "Đã thêm ghế vào xe", BienSo, SoGhe };
  },

  delete: async (BienSo, SoGhe) => {
    await db.query(
      "DELETE FROM Xe_Ghe WHERE BienSo = ? AND SoGhe = ?",
      [BienSo, SoGhe]
    );
    return { message: "Đã xóa ghế khỏi xe" };
  },
};

module.exports = Xe_Ghe;
