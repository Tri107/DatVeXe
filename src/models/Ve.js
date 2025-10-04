const db = require('../config/db');

const Ve = {
  // Lấy toàn bộ vé kèm thông tin khách hàng + chuyến
  getAll: async () => {
    const [rows] = await db.query(`
      SELECT v.*, kh.HoTen, c.ThoiGianKhoiHanh, td.TenTuyen
      FROM Ve v
      LEFT JOIN KhachHang kh ON v.MaKhachHang = kh.MaKhachHang
      LEFT JOIN Chuyen c ON v.MaChuyen = c.MaChuyen
      LEFT JOIN TuyenDuong td ON c.SoTuyen = td.SoTuyen
    `);
    return rows;
  },

  // Lấy chi tiết 1 vé
  getById: async (id) => {
    const [rows] = await db.query(`
      SELECT v.*, kh.HoTen, kh.GioiTinh, kh.Tuoi,
             c.ThoiGianKhoiHanh, c.DuKienKhoiHanh, td.TenTuyen
      FROM Ve v
      LEFT JOIN KhachHang kh ON v.MaKhachHang = kh.MaKhachHang
      LEFT JOIN Chuyen c ON v.MaChuyen = c.MaChuyen
      LEFT JOIN TuyenDuong td ON c.SoTuyen = td.SoTuyen
      WHERE v.SoVe = ?
    `, [id]);
    return rows[0];
  },

  // Tạo vé mới
  create: async (data) => {
    const { MaKhachHang, MaChuyen, GiaVe, PhuongThucThanhToan, GhiChu } = data;
    const [result] = await db.query(
      "INSERT INTO Ve (MaKhachHang, MaChuyen, GiaVe, PhuongThucThanhToan, GhiChu) VALUES (?, ?, ?, ?, ?)",
      [MaKhachHang, MaChuyen, GiaVe, PhuongThucThanhToan, GhiChu]
    );
    return { SoVe: result.insertId, ...data };
  },

  // Cập nhật vé
  update: async (id, data) => {
    const { MaKhachHang, MaChuyen, GiaVe, PhuongThucThanhToan, GhiChu } = data;
    await db.query(
      "UPDATE Ve SET MaKhachHang=?, MaChuyen=?, GiaVe=?, PhuongThucThanhToan=?, GhiChu=? WHERE SoVe=?",
      [MaKhachHang, MaChuyen, GiaVe, PhuongThucThanhToan, GhiChu, id]
    );
    return { SoVe: id, ...data };
  },

  // Xóa vé
  delete: async (id) => {
    await db.query("DELETE FROM Ve WHERE SoVe=?", [id]);
    return { message: "Xóa vé thành công" };
  }
};

module.exports = Ve;
