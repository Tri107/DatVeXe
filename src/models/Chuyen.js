const db = require('../config/db');

const Chuyen = {
  // 🔹 Lấy tất cả chuyến 
  getAll: async () => {
    const [rows] = await db.query(`
      SELECT 
        c.Chuyen_id, 
        c.Chuyen_name, 
        c.Tinh_Trang, 
        c.Ngay_gio,
        td.TuyenDuong_id, 
        CONCAT(b1.BenXe_name, ' - ', b2.BenXe_name) AS TuyenDuong_name,

        b1.BenXe_name AS Ben_di_name,
        b2.BenXe_name AS Ben_den_name,

        x.Xe_id, 
        x.Bien_so, 
        lx.LoaiXe_name,
        t.TaiXe_id, 
        t.TaiXe_name,

        ttp1.TinhThanhPho_name AS DiemDi,
        ttp2.TinhThanhPho_name AS DiemDen

      FROM Chuyen c
      JOIN TuyenDuong td ON td.TuyenDuong_id = c.TuyenDuong_id
      JOIN BenXe b1 ON b1.BenXe_id = td.Ben_di
      JOIN BenXe b2 ON b2.BenXe_id = td.Ben_den
      JOIN Xe x ON x.Xe_id = c.Xe_id
      JOIN LoaiXe lx ON lx.LoaiXe_id = x.LoaiXe_id
      JOIN TaiXe t ON t.TaiXe_id = c.TaiXe_id
      JOIN TinhThanhPho ttp1 ON b1.TinhThanhPho_id = ttp1.TinhThanhPho_id 
      JOIN TinhThanhPho ttp2 ON b2.TinhThanhPho_id = ttp2.TinhThanhPho_id 
      ORDER BY c.Ngay_gio DESC
    `);
    return rows;
  },

  // 🔹 Lấy chuyến theo ID
  getById: async (id) => {
    const [rows] = await db.query(`
      SELECT 
        c.Chuyen_id, 
        c.Chuyen_name, 
        c.Tinh_Trang, 
        c.Ngay_gio,
        td.TuyenDuong_id, 
        CONCAT(b1.BenXe_name, ' - ', b2.BenXe_name) AS TuyenDuong_name,


        b1.BenXe_name AS Ben_di_name,
        b2.BenXe_name AS Ben_den_name,

        x.Xe_id, 
        x.Bien_so, 
        lx.LoaiXe_name,
        t.TaiXe_id, 
        t.TaiXe_name,

        ttp1.TinhThanhPho_name AS DiemDi,
        ttp2.TinhThanhPho_name AS DiemDen

      FROM Chuyen c
      JOIN TuyenDuong td ON td.TuyenDuong_id = c.TuyenDuong_id
      JOIN BenXe b1 ON b1.BenXe_id = td.Ben_di
      JOIN BenXe b2 ON b2.BenXe_id = td.Ben_den
      JOIN Xe x ON x.Xe_id = c.Xe_id
      JOIN LoaiXe lx ON lx.LoaiXe_id = x.LoaiXe_id
      JOIN TaiXe t ON t.TaiXe_id = c.TaiXe_id
      JOIN TinhThanhPho ttp1 ON b1.TinhThanhPho_id = ttp1.TinhThanhPho_id 
      JOIN TinhThanhPho ttp2 ON b2.TinhThanhPho_id = ttp2.TinhThanhPho_id 
      WHERE c.Chuyen_id = ?
      ORDER BY c.Ngay_gio DESC
    `, [id]);
    return rows[0];
  },


  getDiemDon: async (chuyenId) => {
    const [rows] = await db.query(`
      SELECT 
        'benxe' AS type,
        bx.BenXe_name AS name,
        ttp.TinhThanhPho_name AS diaChi,
        NULL AS time
      FROM Chuyen c
      JOIN TuyenDuong td ON c.TuyenDuong_id = td.TuyenDuong_id
      JOIN BenXe bx ON bx.BenXe_id = td.Ben_di
      JOIN TinhThanhPho ttp ON ttp.TinhThanhPho_id = bx.TinhThanhPho_id
      WHERE c.Chuyen_id = ?

      UNION ALL

      SELECT 
        'tram' AS type,
        tdc.TramDungChan_name AS name,
        NULL AS diaChi,
        tdc.Thoi_gian_dung AS time
      FROM Tram_Chuyen tc
      JOIN TramDungChan tdc ON tc.TramDungChan_id = tdc.TramDungChan_id
      WHERE tc.Chuyen_id = ?

      ORDER BY type DESC
    `, [chuyenId, chuyenId]);
    return rows;
  },


  getDiemTra: async (chuyenId) => {
    const [rows] = await db.query(`
      SELECT 
        'benxe' AS type,
        bx.BenXe_name AS name,
        ttp.TinhThanhPho_name AS diaChi,
        NULL AS time
      FROM Chuyen c
      JOIN TuyenDuong td ON c.TuyenDuong_id = td.TuyenDuong_id
      JOIN BenXe bx ON bx.BenXe_id = td.Ben_den
      JOIN TinhThanhPho ttp ON ttp.TinhThanhPho_id = bx.TinhThanhPho_id
      WHERE c.Chuyen_id = ?

      UNION ALL

      SELECT 
        'tram' AS type,
        tdc.TramDungChan_name AS name,
        NULL AS diaChi,
        tdc.Thoi_gian_dung AS time
      FROM Tram_Chuyen tc
      JOIN TramDungChan tdc ON tc.TramDungChan_id = tdc.TramDungChan_id
      WHERE tc.Chuyen_id = ?

      ORDER BY type DESC
    `, [chuyenId, chuyenId]);
    return rows;
  },

  // 🔹 Tạo chuyến mới
  create: async (data) => {
    const { Chuyen_name, Tinh_Trang, Ngay_gio, TuyenDuong_id, Xe_id, TaiXe_id } = data;
    const [result] = await db.query(
      `INSERT INTO Chuyen (Chuyen_name, Tinh_Trang, Ngay_gio, TuyenDuong_id, Xe_id, TaiXe_id)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [Chuyen_name, Tinh_Trang, Ngay_gio, TuyenDuong_id, Xe_id, TaiXe_id]
    );
    return { Chuyen_id: result.insertId, ...data };
  },

  // 🔹 Cập nhật chuyến
  update: async (id, data) => {
    const fields = [];
    const params = [];
    ["Chuyen_name", "Tinh_Trang", "Ngay_gio", "TuyenDuong_id", "Xe_id", "TaiXe_id"].forEach(k => {
      if (data[k] !== undefined) {
        fields.push(`${k} = ?`);
        params.push(data[k]);
      }
    });
    if (!fields.length) return Chuyen.getById(id);
    params.push(id);
    await db.query(`UPDATE Chuyen SET ${fields.join(', ')} WHERE Chuyen_id = ?`, params);
    return Chuyen.getById(id);
  },

  // 🔹 Xóa chuyến
  delete: async (id) => {
    await db.query("DELETE FROM Chuyen WHERE Chuyen_id = ?", [id]);
    return { message: "Xóa chuyến thành công" };
  }
};

module.exports = Chuyen;
