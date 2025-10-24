const db = require('../config/db');

const Ve = {
  // Lấy tất cả vé cùng thông tin chuyến + khách hàng
  getAll: async () => {
    const [rows] = await db.query(`
      SELECT 
        v.Ve_id, v.Ve_gia, v.NgayTao, v.GhiChu,
        c.Chuyen_id, c.Chuyen_name,
        kh.KhachHang_id, kh.KhachHang_name
      FROM Ve v
      JOIN Chuyen c ON c.Chuyen_id = v.Chuyen_id
      JOIN KhachHang kh ON kh.KhachHang_id = v.KhachHang_id
      ORDER BY v.Ve_id DESC
    `);
    return rows;
  },

  getById: async (id) => {
  const [rows] = await db.query(`
    SELECT 
      v.Ve_id,
      v.Ve_gia,
      v.NgayTao,
      v.GhiChu,
      v.KhachHang_id,
      v.Chuyen_id,
      kh.KhachHang_name,
      kh.SDT,
      c.Chuyen_name,
      c.Ngay_gio,
      td.TuyenDuong_id,
      td.Quang_duong,
      td.Thoi_gian,
      bdi.BenXe_name AS Ben_di_name,
      bden.BenXe_name AS Ben_den_name
    FROM Ve v
    JOIN KhachHang kh ON v.KhachHang_id = kh.KhachHang_id
    JOIN Chuyen c      ON v.Chuyen_id = c.Chuyen_id
    JOIN TuyenDuong td ON c.TuyenDuong_id = td.TuyenDuong_id
    JOIN BenXe bdi     ON td.Ben_di = bdi.BenXe_id
    JOIN BenXe bden    ON td.Ben_den = bden.BenXe_id
    WHERE v.Ve_id = ?
  `, [id]);
  return rows[0];
},


  create: async (data) => {
    const { Ve_gia, NgayTao, GhiChu, KhachHang_id, Chuyen_id } = data;
    const [result] = await db.query(
      "INSERT INTO Ve (Ve_gia, NgayTao, GhiChu, KhachHang_id, Chuyen_id) VALUES (?, ?, ?, ?, ?)",
      [Ve_gia, NgayTao, GhiChu, KhachHang_id, Chuyen_id]
    );
    return { Ve_id: result.insertId, ...data };
  },

  update: async (id, data) => {
    const fields = [];
    const params = [];
    ["Ve_gia", "NgayTao", "GhiChu", "KhachHang_id", "Chuyen_id"].forEach(k => {
      if (data[k] !== undefined) {
        fields.push(`${k} = ?`);
        params.push(data[k]);
      }
    });
    if (!fields.length) return Ve.getById(id);
    params.push(id);
    await db.query(`UPDATE Ve SET ${fields.join(', ')} WHERE Ve_id = ?`, params);
    return Ve.getById(id);
  },

  delete: async (id) => {
    await db.query("DELETE FROM Ve WHERE Ve_id = ?", [id]);
    return { message: "Xóa vé thành công" };
  },
  getByUserSDT: async (sdt) => {
  const [rows] = await db.query(`
    SELECT 
      v.Ve_id,
      v.Ve_gia,
      v.NgayTao,
      v.GhiChu,
      c.Chuyen_name,
      c.Ngay_gio,
      td.TuyenDuong_id,
      CONCAT(bdi.BenXe_name, ' - ', bden.BenXe_name) AS TuyenDuong_name,
      x.Bien_So,
      kh.KhachHang_name,
      kh.SDT
    FROM Ve v
    JOIN KhachHang kh ON v.KhachHang_id = kh.KhachHang_id
    JOIN Chuyen c ON v.Chuyen_id = c.Chuyen_id
    JOIN Xe x ON c.Xe_id = x.Xe_id
    JOIN TuyenDuong td ON c.TuyenDuong_id = td.TuyenDuong_id
    JOIN BenXe bdi ON td.Ben_di = bdi.BenXe_id
    JOIN BenXe bden ON td.Ben_den = bden.BenXe_id
    WHERE kh.SDT = ?
    ORDER BY v.NgayTao DESC
  `, [sdt]);
  return rows;
}

};

module.exports = Ve;
