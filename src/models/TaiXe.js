const db = require('../config/db');

const TaiXe = {
  // 🔹 Lấy tất cả tài xế
  getAll: async () => {
    const [rows] = await db.query(
      "SELECT TaiXe_id, TaiXe_name, TaiXe_age, TaiXe_BangLai, NgayVaoLam, SDT FROM TaiXe ORDER BY TaiXe_id DESC"
    );
    return rows;
  },

  // 🔹 Lấy tài xế theo ID
  getById: async (id) => {
    const [rows] = await db.query(
      "SELECT TaiXe_id, TaiXe_name, TaiXe_age, TaiXe_BangLai, NgayVaoLam, SDT FROM TaiXe WHERE TaiXe_id = ?",
      [id]
    );
    return rows[0];
  },

  // 🔹 Thêm tài xế mới
  create: async (data) => {
    const { TaiXe_name, TaiXe_age, TaiXe_BangLai, NgayVaoLam, SDT } = data;

    // ✅ Kiểm tra tuổi (tránh vi phạm CHECK constraint)
    if (TaiXe_age < 25) {
      throw new Error("Tuổi tài xế phải lớn hơn hoặc bằng 25 theo quy định trong database!");
    }

    const [result] = await db.query(
      "INSERT INTO TaiXe (TaiXe_name, TaiXe_age, TaiXe_BangLai, NgayVaoLam, SDT) VALUES (?, ?, ?, ?, ?)",
      [TaiXe_name, TaiXe_age, TaiXe_BangLai, NgayVaoLam, SDT]
    );
    return { TaiXe_id: result.insertId, ...data };
  },

  // 🔹 Cập nhật tài xế
  update: async (id, data) => {
    const fields = [];
    const params = [];
    ["TaiXe_name", "TaiXe_age", "TaiXe_BangLai", "NgayVaoLam", "SDT"].forEach(k => {
      if (data[k] !== undefined) {
        // ✅ Kiểm tra tuổi trong trường hợp có cập nhật
        if (k === "TaiXe_age" && data[k] < 25) {
          throw new Error("Tuổi tài xế phải lớn hơn hoặc bằng 25!");
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
  }
};

module.exports = TaiXe;
