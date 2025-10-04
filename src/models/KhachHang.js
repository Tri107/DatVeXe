const db = require('../config/db');

const KhachHang = {
  // Lấy toàn bộ khách hàng
  getAll: async () => {
    const [rows] = await db.query(`
      SELECT kh.*, tk.Email
      FROM KhachHang kh
      LEFT JOIN TaiKhoan tk ON kh.MaTaiKhoan = tk.ID
    `);
    return rows;
  },

  // Lấy khách hàng theo ID
  getById: async (id) => {
    const [rows] = await db.query(`
      SELECT kh.*, tk.Email
      FROM KhachHang kh
      LEFT JOIN TaiKhoan tk ON kh.MaTaiKhoan = tk.ID
      WHERE kh.MaKhachHang = ?
    `, [id]);
    return rows[0];
  },

  // Tạo mới khách hàng
  create: async (data) => {
    const { MaTaiKhoan, HoTen, GioiTinh, Tuoi } = data;
    const [result] = await db.query(
      "INSERT INTO KhachHang (MaTaiKhoan, HoTen, GioiTinh, Tuoi) VALUES (?, ?, ?, ?)",
      [MaTaiKhoan, HoTen, GioiTinh, Tuoi]
    );
    return { MaKhachHang: result.insertId, ...data };
  },

  // Cập nhật khách hàng
  update: async (id, data) => {
    const { MaTaiKhoan, HoTen, GioiTinh, Tuoi } = data;
    await db.query(
      "UPDATE KhachHang SET MaTaiKhoan=?, HoTen=?, GioiTinh=?, Tuoi=? WHERE MaKhachHang=?",
      [MaTaiKhoan, HoTen, GioiTinh, Tuoi, id]
    );
    return { MaKhachHang: id, ...data };
  },

  // Xóa khách hàng
  delete: async (id) => {
    await db.query("DELETE FROM KhachHang WHERE MaKhachHang=?", [id]);
    return { message: "Xóa khách hàng thành công" };
  }
};

module.exports = KhachHang;
