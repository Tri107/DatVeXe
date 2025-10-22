const db = require('../config/db');

const KhachHang = {
  getAll: async () => {
    const [rows] = await db.query("SELECT KhachHang_id, KhachHang_name, email, SDT FROM KhachHang ORDER BY KhachHang_id DESC");
    return rows;
  },

  getById: async (id) => {
    const [rows] = await db.query("SELECT KhachHang_id, KhachHang_name, email, SDT FROM KhachHang WHERE KhachHang_id = ?", [id]);
    return rows[0];
  },

  getByPhone: async (phone) => {
    const [rows] = await db.query(
      "SELECT KhachHang_id, KhachHang_name, email, SDT FROM KhachHang WHERE SDT = ?",
      [phone]
    );
    return rows[0];
  },

  create: async (data) => {
    const { KhachHang_name, email, SDT } = data;
    const [result] = await db.query(
      "INSERT INTO KhachHang (KhachHang_name, email, SDT) VALUES (?, ?, ?)",
      [KhachHang_name, email, SDT]
    );
    return { KhachHang_id: result.insertId, KhachHang_name, email, SDT };
  },

  update: async (id, data) => {
    // Validate if customer exists first
    const customer = await KhachHang.getById(id);
    if (!customer) return null;

    const fields = [];
    const params = [];
    
    // Add validation for each field
    if (data.KhachHang_name) {
      if (typeof data.KhachHang_name !== 'string' || data.KhachHang_name.length < 2) {
        throw new Error('Tên khách hàng không hợp lệ');
      }
      fields.push("KhachHang_name = ?");
      params.push(data.KhachHang_name);
    }
    
    if (data.email) {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
        throw new Error('Email không hợp lệ');
      }
      fields.push("email = ?");
      params.push(data.email);
    }
    
    if (data.SDT) {
      if (!/^\d{10,11}$/.test(data.SDT)) {
        throw new Error('Số điện thoại không hợp lệ');
      }
      fields.push("SDT = ?");
      params.push(data.SDT);
    }

    if (!fields.length) return customer;
    
    params.push(id);
    await db.query(`UPDATE KhachHang SET ${fields.join(', ')} WHERE KhachHang_id = ?`, params);
    return KhachHang.getById(id);
  },

  delete: async (id) => {
    await db.query("DELETE FROM KhachHang WHERE KhachHang_id = ?", [id]);
    return { message: "Xóa khách hàng thành công" };
  }
};

module.exports = KhachHang;
