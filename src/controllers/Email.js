const nodemailer = require("nodemailer");
const db = require("../config/db");
require("dotenv").config();

exports.sendTicketEmail = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Thiếu email người nhận" });

    // 🔹 Lấy thông tin vé của khách theo email
    const [rows] = await db.query(`
      SELECT 
        v.Ve_id,
        v.Ve_gia,
        v.NgayTao,
        v.GhiChu,
        c.Chuyen_name,
        c.Ngay_gio,
        CONCAT(bdi.BenXe_name, ' - ', bden.BenXe_name) AS TuyenDuong_name,
        x.Bien_So,
        kh.KhachHang_name,
        kh.Email
      FROM Ve v
      JOIN KhachHang kh ON v.KhachHang_id = kh.KhachHang_id
      JOIN Chuyen c ON v.Chuyen_id = c.Chuyen_id
      JOIN Xe x ON c.Xe_id = x.Xe_id
      JOIN TuyenDuong td ON c.TuyenDuong_id = td.TuyenDuong_id
      JOIN BenXe bdi ON td.Ben_di = bdi.BenXe_id
      JOIN BenXe bden ON td.Ben_den = bden.BenXe_id
      WHERE kh.Email = ?
      ORDER BY v.NgayTao DESC
      LIMIT 1
    `, [email]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "Không tìm thấy vé cho email này" });
    }

    const ve = rows[0];
    console.log("🎟️ Vé truy vấn từ DB:", ve);

    // 🔹 Cấu hình Gmail transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    // 🔹 Mẫu email HTML — chuẩn format VNĐ, ngày giờ tiếng Việt
    const mailOptions = {
      from: `"Hệ thống Vé Xe" <${process.env.MAIL_USER}>`,
      to: ve.Email,
      subject: "Xác nhận thanh toán & thông tin vé xe",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 24px; background-color: #f7fafc;">
          <div style="max-width: 600px; margin: auto; background: white; border-radius: 10px; padding: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
            <h2 style="color: #2c7a7b; text-align: center;">VeXeSmart</h2>
            <p>Xin chào <b>${ve.KhachHang_name}</b>,</p>
            <p>Bạn đã đặt vé thành công trên hệ thống <b>Đặt Vé Xe</b>.</p>
            <hr style="margin: 16px 0; border: none; border-top: 1px solid #e2e8f0;">
            <h3 style="color: #2b6cb0;">🚌 Thông tin vé:</h3>
            <ul style="line-height: 1.6; font-size: 15px;">
              <li><b>Tuyến đường:</b> ${ve.TuyenDuong_name}</li>
              <li><b>Biển số xe:</b> ${ve.Bien_So}</li>
              <li><b>Giờ khởi hành:</b> ${new Date(ve.Ngay_gio).toLocaleString("vi-VN", {hour: "2-digit",minute: "2-digit",day: "2-digit",month: "2-digit",year: "numeric",})}</li>
              <li><b>Giá vé:</b> ${Number(ve.Ve_gia).toLocaleString("vi-VN")} ₫</li>
              <li><b>Ngày đặt:</b> ${new Date(ve.NgayTao).toLocaleString("vi-VN", {hour: "2-digit",minute: "2-digit",second: "2-digit",day: "2-digit",month: "2-digit",year: "numeric",})}</li>
            </ul>

            <hr style="margin: 20px 0; border: none; border-top: 1px solid #e2e8f0;">
            <p style="color: #4a5568;">Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi ❤️</p>
            <p style="color: #718096; font-size: 13px;">Mọi thắc mắc vui lòng liên hệ tổng đài: <b>1900 8888</b></p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Email đã gửi đến ${ve.Email}`);
    res.json({ message: "Gửi email thành công", email: ve.Email });
  } catch (err) {
    console.error("❌ Lỗi gửi email:", err);
    res.status(500).json({ message: "Lỗi gửi email", error: String(err) });
  }
};
