const db = require('../config/db');

const KhachHang = {
  getAll: async () => {
    const [rows] = await db.query("SELECT * FROM KhachHang");
    return rows;
  },
  getById: async (id) => {
    const [rows] = await db.query("SELECT * FROM KhachHang WHERE MaKhachHang = ?", [id]);
    return rows[0];
  },
  create: async (data) => {
    const { HoTen, GioiTinh, Tuoi } = data;
    const [result] = await db.query(
      "INSERT INTO KhachHang (HoTen, GioiTinh, Tuoi) VALUES (?, ?, ?)",
      [HoTen, GioiTinh, Tuoi]
    );
    return { MaKhachHang: result.insertId, ...data };
  },
  update: async (id, data) => {
    const { HoTen, GioiTinh, Tuoi } = data;
    await db.query(
      "UPDATE KhachHang SET HoTen=?, GioiTinh=?, Tuoi=? WHERE MaKhachHang=?",
      [HoTen, GioiTinh, Tuoi, id]
    );
    return { MaKhachHang: id, ...data };
  },
  delete: async (id) => {
    await db.query("DELETE FROM KhachHang WHERE MaKhachHang = ?", [id]);
    return { message: "Xóa thành công" };
  }
};

module.exports = KhachHang;
