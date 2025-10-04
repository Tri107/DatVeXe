const db = require('../config/db');

const TramDungChan_Chuyen = {
  // Lấy tất cả liên kết trạm ↔ chuyến
  getAll: async () => {
    const [rows] = await db.query(`
      SELECT tdc.MaTram, tdc.MaChuyen, tc.TenTram
      FROM TramDungChan_Chuyen tdc
      JOIN TramDungChan tc ON tdc.MaTram = tc.MaTram
      JOIN Chuyen c ON tdc.MaChuyen = c.MaChuyen
    `);
    return rows;
  },

  // Tạo liên kết mới
  create: async (data) => {
    const { MaTram, MaChuyen } = data;
    await db.query(
      "INSERT INTO TramDungChan_Chuyen (MaTram, MaChuyen) VALUES (?, ?)",
      [MaTram, MaChuyen]
    );
    return { message: "Đã thêm trạm vào chuyến", MaTram, MaChuyen };
  },

  // Xóa liên kết
  delete: async (MaTram, MaChuyen) => {
    await db.query(
      "DELETE FROM TramDungChan_Chuyen WHERE MaTram = ? AND MaChuyen = ?",
      [MaTram, MaChuyen]
    );
    return { message: "Đã xóa trạm khỏi chuyến" };
  },
};

module.exports = TramDungChan_Chuyen;
