const db = require('../config/db');

const TaiKhoan = {
  getAll: async () => {
    const [rows] = await db.query("SELECT ID, Email, Loai FROM TaiKhoan");
    return rows;
  },

  getById: async (id) => {
    const [rows] = await db.query("SELECT * FROM TaiKhoan WHERE ID=?", [id]);
    return rows[0];
  },

  create: async (data) => {
    const { Email, MatKhau, Loai } = data;
    const [result] = await db.query(
      "INSERT INTO TaiKhoan (Email, MatKhau, Loai) VALUES (?, ?, ?)",
      [Email, MatKhau, Loai]
    );
    return { ID: result.insertId, ...data };
  },

  update: async (id, data) => {
    const { Email, MatKhau, Loai } = data;
    await db.query(
      "UPDATE TaiKhoan SET Email=?, MatKhau=?, Loai=? WHERE ID=?",
      [Email, MatKhau, Loai, id]
    );
    return { ID: id, ...data };
  },

  delete: async (id) => {
    await db.query("DELETE FROM TaiKhoan WHERE ID=?", [id]);
    return { message: "Xóa tài khoản thành công" };
  }
};

module.exports = TaiKhoan;
