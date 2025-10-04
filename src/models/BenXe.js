const db = require('../config/db');

const BenXe = {
  getAll: async () => {
    const [rows] = await db.query(`
      SELECT bx.*, ttp.TenTinhThanhPho
      FROM BenXe bx
      LEFT JOIN TinhThanhPho ttp ON bx.MaTinhThanhPho = ttp.MaTinhThanhPho
    `);
    return rows;
  },

  getById: async (id) => {
    const [rows] = await db.query(`
      SELECT bx.*, ttp.TenTinhThanhPho
      FROM BenXe bx
      LEFT JOIN TinhThanhPho ttp ON bx.MaTinhThanhPho = ttp.MaTinhThanhPho
      WHERE bx.MaBen = ?
    `, [id]);
    return rows[0];
  },

  create: async (data) => {
    const { TenBen, DiaChiBen, MaTinhThanhPho } = data;
    const [result] = await db.query(
      "INSERT INTO BenXe (TenBen, DiaChiBen, MaTinhThanhPho) VALUES (?, ?, ?)",
      [TenBen, DiaChiBen, MaTinhThanhPho]
    );
    return { MaBen: result.insertId, ...data };
  },

  update: async (id, data) => {
    const { TenBen, DiaChiBen, MaTinhThanhPho } = data;
    await db.query(
      "UPDATE BenXe SET TenBen=?, DiaChiBen=?, MaTinhThanhPho=? WHERE MaBen=?",
      [TenBen, DiaChiBen, MaTinhThanhPho, id]
    );
    return { MaBen: id, ...data };
  },

  delete: async (id) => {
    await db.query("DELETE FROM BenXe WHERE MaBen=?", [id]);
    return { message: "Xóa bến xe thành công" };
  }
};

module.exports = BenXe;
