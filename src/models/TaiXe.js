const db = require('../config/db');

const TaiXe = {
  // 🔹 Lấy tất cả tài xế
  getAll: async () => {
    const [rows] = await db.query(`
      SELECT TaiXe_id, TaiXe_name, TaiXe_age, TaiXe_BangLai, NgayVaoLam, SDT
      FROM TaiXe
      ORDER BY TaiXe_id DESC
    `);
    return rows;
  },

  // 🔹 Lấy tài xế theo ID
  getById: async (id) => {
    const [rows] = await db.query(`
      SELECT TaiXe_id, TaiXe_name, TaiXe_age, TaiXe_BangLai, NgayVaoLam, SDT
      FROM TaiXe
      WHERE TaiXe_id = ?
    `, [id]);
    return rows[0];
  },

  // 🔹 Thêm tài xế mới
  create: async (data) => {
    const { TaiXe_name, TaiXe_age, TaiXe_BangLai, NgayVaoLam, SDT } = data;

    if (TaiXe_age < 25) {
      throw new Error("Tuổi tài xế phải >= 25!");
    }

    const [result] = await db.query(`
      INSERT INTO TaiXe (TaiXe_name, TaiXe_age, TaiXe_BangLai, NgayVaoLam, SDT)
      VALUES (?, ?, ?, ?, ?)
    `, [TaiXe_name, TaiXe_age, TaiXe_BangLai, NgayVaoLam, SDT]);

    return { TaiXe_id: result.insertId, ...data };
  },

  // 🔹 Cập nhật tài xế
  update: async (id, data) => {
    const fields = [];
    const params = [];

    ["TaiXe_name", "TaiXe_age", "TaiXe_BangLai", "NgayVaoLam", "SDT"].forEach(k => {
      if (data[k] !== undefined) {
        if (k === "TaiXe_age" && data[k] < 25) {
          throw new Error("Tuổi tài xế phải >= 25!");
        }
        fields.push(`${k} = ?`);
        params.push(data[k]);
      }
    });

    if (!fields.length) return TaiXe.getById(id);
    params.push(id);

    await db.query(`UPDATE TaiXe SET ${fields.join(', ')} WHERE TaiXe_id = ?`, params);
    return TaiXe.getById(id);
  },

  // 🔹 Xóa tài xế
  delete: async (id) => {
    await db.query("DELETE FROM TaiXe WHERE TaiXe_id = ?", [id]);
    return { message: "Xóa tài xế thành công" };
  },



  // 🔸 Dashboard: Thông tin tài xế + chuyến hiện tại
  getDashboardData: async (taiXeId) => {
    const [driver] = await db.query(`
      SELECT TaiXe_id, TaiXe_name, TaiXe_BangLai, SDT, NgayVaoLam
      FROM TaiXe WHERE TaiXe_id = ?
    `, [taiXeId]);

    const [currentTrip] = await db.query(`
      SELECT c.*, x.Bien_so, bd.BenXe_name AS Ben_di_name, be.BenXe_name AS Ben_den_name
      FROM Chuyen c
      JOIN Xe x ON c.Xe_id = x.Xe_id
      JOIN TuyenDuong t ON c.TuyenDuong_id = t.TuyenDuong_id
      JOIN BenXe bd ON t.Ben_di = bd.BenXe_id
      JOIN BenXe be ON t.Ben_den = be.BenXe_id
      WHERE c.TaiXe_id = ? AND c.Tinh_Trang IN ('Đang chạy', 'Sắp khởi hành')
      ORDER BY c.Ngay_gio ASC LIMIT 1
    `, [taiXeId]);

    return { driver: driver[0], currentTrip: currentTrip[0] || null };
  },

  // 🔸 Danh sách chuyến được giao cho tài xế
  getChuyenListByTaiXe: async (taiXeId) => {
    const [rows] = await db.query(`
      SELECT c.Chuyen_id, c.Chuyen_name, c.Ngay_gio, c.Tinh_Trang,
             x.Bien_so, bd.BenXe_name AS Ben_di_name, be.BenXe_name AS Ben_den_name
      FROM Chuyen c
      JOIN Xe x ON c.Xe_id = x.Xe_id
      JOIN TuyenDuong t ON c.TuyenDuong_id = t.TuyenDuong_id
      JOIN BenXe bd ON t.Ben_di = bd.BenXe_id
      JOIN BenXe be ON t.Ben_den = be.BenXe_id
      WHERE c.TaiXe_id = ?
      ORDER BY c.Ngay_gio DESC
    `, [taiXeId]);
    return rows;
  },

  // 🔸 Chi tiết chuyến (xe, tuyến, trạm, hành khách)
  getChuyenDetail: async (chuyenId) => {
    const [chuyen] = await db.query(`
      SELECT c.*, x.Bien_so, bd.BenXe_name AS Ben_di_name, be.BenXe_name AS Ben_den_name
      FROM Chuyen c
      JOIN Xe x ON c.Xe_id = x.Xe_id
      JOIN TuyenDuong t ON c.TuyenDuong_id = t.TuyenDuong_id
      JOIN BenXe bd ON t.Ben_di = bd.BenXe_id
      JOIN BenXe be ON t.Ben_den = be.BenXe_id
      WHERE c.Chuyen_id = ?
    `, [chuyenId]);

    const [tram] = await db.query(`
      SELECT tdc.TramDungChan_name, tdc.Thoi_gian_dung
      FROM Tram_Chuyen tc
      JOIN TramDungChan tdc ON tc.TramDungChan_id = tdc.TramDungChan_id
      WHERE tc.Chuyen_id = ?
    `, [chuyenId]);

    const [khach] = await db.query(`
      SELECT kh.KhachHang_name, kh.SDT, v.Ve_id
      FROM Ve v
      JOIN KhachHang kh ON v.KhachHang_id = kh.KhachHang_id
      WHERE v.Chuyen_id = ?
    `, [chuyenId]);

    return { chuyen: chuyen[0], tram, khach };
  },

  // 🔸 Tìm tài xế theo số điện thoại
  getByPhone: async (sdt) => {
    const [rows] = await db.query(
      "SELECT * FROM TaiXe WHERE SDT = ?",
      [sdt]
    );
    return rows[0];
  },
};

module.exports = TaiXe;
