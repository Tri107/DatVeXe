const db = require('../config/db');

const TramDungChan = {
  // Lấy toàn bộ trạm (kèm danh sách chuyến liên kết)
  getAll: async () => {
    const [rows] = await db.query(`
      SELECT tdc.*, GROUP_CONCAT(tcc.MaChuyen) AS DanhSachChuyen
      FROM TramDungChan tdc
      LEFT JOIN TramDungChan_Chuyen tcc ON tdc.MaTram = tcc.MaTram
      GROUP BY tdc.MaTram
    `);
    return rows;
  },

  // Lấy chi tiết 1 trạm theo ID
  getById: async (id) => {
    const [rows] = await db.query(`
      SELECT tdc.*, GROUP_CONCAT(tcc.MaChuyen) AS DanhSachChuyen
      FROM TramDungChan tdc
      LEFT JOIN TramDungChan_Chuyen tcc ON tdc.MaTram = tcc.MaTram
      WHERE tdc.MaTram = ?
      GROUP BY tdc.MaTram
    `, [id]);
    return rows[0];
  },

  // Tạo trạm mới
  create: async (data) => {
    const { TenTram, DiaChiTram, ThoiGianDung } = data;
    const [result] = await db.query(
      "INSERT INTO TramDungChan (TenTram, DiaChiTram, ThoiGianDung) VALUES (?, ?, ?)",
      [TenTram, DiaChiTram, ThoiGianDung]
    );
    return { MaTram: result.insertId, ...data };
  },

  // Cập nhật trạm
  update: async (id, data) => {
    const { TenTram, DiaChiTram, ThoiGianDung } = data;
    await db.query(
      "UPDATE TramDungChan SET TenTram=?, DiaChiTram=?, ThoiGianDung=? WHERE MaTram=?",
      [TenTram, DiaChiTram, ThoiGianDung, id]
    );
    return { MaTram: id, ...data };
  },

  // Xóa trạm
  delete: async (id) => {
    await db.query("DELETE FROM TramDungChan WHERE MaTram=?", [id]);
    return { message: "Xóa trạm dừng chân thành công" };
  },

  // Gán trạm cho chuyến (TramDungChan_Chuyen)
  assignToChuyen: async (MaTram, MaChuyen) => {
    await db.query(
      "INSERT INTO TramDungChan_Chuyen (MaTram, MaChuyen) VALUES (?, ?)",
      [MaTram, MaChuyen]
    );
    return { message: `Đã gán trạm ${MaTram} cho chuyến ${MaChuyen}` };
  }
};

module.exports = TramDungChan;
