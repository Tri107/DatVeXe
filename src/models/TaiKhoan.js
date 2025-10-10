const db = require('../config/db');

const TaiKhoan = {
  getAll: async () => {
    const [rows] = await db.query("SELECT SDT, role FROM TaiKhoan");
    return rows;
  },

  getBySDT: async (SDT) => {
    const [rows] = await db.query("SELECT SDT, Password_hash, role FROM TaiKhoan WHERE SDT = ?", [SDT]);
    return rows[0];
  },

  create: async (data) => {
    const { SDT, Password_hash, role = 'khachhang' } = data;
    await db.query(
      "INSERT INTO TaiKhoan (SDT, Password_hash, role) VALUES (?, ?, ?)",
      [SDT, Password_hash, role]
    );
    return { SDT, role };
  },

  update: async (SDT, data) => {
    const fields = [];
    const params = [];
    if (data.Password_hash !== undefined) { fields.push("Password_hash = ?"); params.push(data.Password_hash); }
    if (data.role !== undefined) { fields.push("role = ?"); params.push(data.role); }
    if (!fields.length) return TaiKhoan.getBySDT(SDT);
    params.push(SDT);
    await db.query(`UPDATE TaiKhoan SET ${fields.join(', ')} WHERE SDT = ?`, params);
    return TaiKhoan.getBySDT(SDT);
  },

  delete: async (SDT) => {
    await db.query("DELETE FROM TaiKhoan WHERE SDT = ?", [SDT]);
    return { message: "Xóa tài khoản thành công" };
  }
};

module.exports = TaiKhoan;
