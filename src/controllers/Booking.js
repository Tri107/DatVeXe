// src/controllers/Booking.js
const db = require('../config/db'); // mysql2/promise (pool)

//
// GET /api/booking/:veId/summary
// -> Gộp đủ dữ liệu để hiển thị Trip Info + header Payment
//
exports.summary = async (req, res, next) => {
  try {
    const { veId } = req.params;

    const [rows] = await db.query(
      `
      SELECT
        v.Ve_id, v.Ve_gia, v.NgayTao, v.GhiChu, v.KhachHang_id, v.Chuyen_id,
        kh.KhachHang_name, kh.SDT, kh.email,
        c.Chuyen_name, c.Ngay_gio, c.Tinh_Trang, c.TuyenDuong_id, c.Xe_id,
        td.Quang_duong, td.Thoi_gian, td.Ben_di, td.Ben_den,
        bdi.BenXe_name AS BenDi_name,
        bde.BenXe_name AS BenDen_name,
        x.Bien_so, x.LoaiXe_id,
        lx.LoaiXe_name, lx.Suc_chua
      FROM ve v
      JOIN khachhang kh ON kh.KhachHang_id = v.KhachHang_id
      JOIN chuyen c       ON c.Chuyen_id      = v.Chuyen_id
      JOIN tuyenduong td  ON td.TuyenDuong_id = c.TuyenDuong_id
      JOIN benxe bdi      ON bdi.BenXe_id     = td.Ben_di
      JOIN benxe bde      ON bde.BenXe_id     = td.Ben_den
      JOIN xe x           ON x.Xe_id          = c.Xe_id
      JOIN loaixe lx      ON lx.LoaiXe_id     = x.LoaiXe_id
      WHERE v.Ve_id = ?
      LIMIT 1
      `,
      [veId]
    );

    if (!rows.length) return res.status(404).json({ message: 'Ticket not found' });
    const r = rows[0];

    return res.json({
      ticket: { id: r.Ve_id, price: Number(r.Ve_gia), createdAt: r.NgayTao, note: r.GhiChu },
      customer: { id: r.KhachHang_id, name: r.KhachHang_name, phone: r.SDT, email: r.email },
      trip: {
        id: r.Chuyen_id,
        name: r.Chuyen_name,
        departTime: r.Ngay_gio,
        status: r.Tinh_Trang,
        route: {
          distance: Number(r.Quang_duong),
          duration: r.Thoi_gian,
          from: { id: r.Ben_di,  name: r.BenDi_name  },
          to:   { id: r.Ben_den, name: r.BenDen_name },
        }
      },
      vehicle: { plate: r.Bien_so, typeId: r.LoaiXe_id, typeName: r.LoaiXe_name, capacity: r.Suc_chua }
    });
  } catch (e) { next(e); }
};

//
// POST /api/booking/:veId/quote   { coupon?, insurance: boolean }
// -> Tính tạm tính/giảm giá/bảo hiểm trên server
//
exports.quote = async (req, res, next) => {
  try {
    const { veId } = req.params;
    const { coupon, insurance } = req.body ?? {};

    const [rows] = await db.query('SELECT Ve_gia FROM ve WHERE Ve_id=? LIMIT 1', [veId]);
    if (!rows.length) return res.status(404).json({ message: 'Ticket not found' });

    const basePrice = Number(rows[0].Ve_gia) || 0;
    let discount = 0;
    if (coupon === 'GIAM10') discount = Math.round(basePrice * 0.10);
    if (coupon === 'SALE20') discount = Math.round(basePrice * 0.20);

    const insuranceFee = insurance ? 10000 : 0;
    const total = Math.max(basePrice - discount + insuranceFee, 0);

    return res.json({ basePrice, discount, insuranceFee, total, appliedCoupon: coupon || null, currency: 'VND' });
  } catch (e) { next(e); }
};

//
// POST /api/booking/:veId/checkout  { coupon?, insurance, method: 'qr'|'card' }
// -> Demo thanh toán (thực tế: tích hợp cổng thanh toán + lưu DB)
//
exports.checkout = async (req, res, next) => {
  try {
    const { veId } = req.params;
    const { coupon, insurance, method } = req.body ?? {};

    const [rows] = await db.query('SELECT Ve_gia FROM ve WHERE Ve_id=? LIMIT 1', [veId]);
    if (!rows.length) return res.status(404).json({ message: 'Ticket not found' });

    const basePrice = Number(rows[0].Ve_gia) || 0;
    let discount = 0;
    if (coupon === 'GIAM10') discount = Math.round(basePrice * 0.10);
    if (coupon === 'SALE20') discount = Math.round(basePrice * 0.20);
    const insuranceFee = insurance ? 10000 : 0;
    const total = Math.max(basePrice - discount + insuranceFee, 0);

    // TODO: tích hợp Momo/VNPAY/Stripe + idempotency + lưu bảng payments
    return res.json({
      status: 'PAID',
      paymentId: 'pay_demo_' + Date.now(),
      method: method || 'qr',
      amount: total,
      currency: 'VND',
      message: 'Thanh toán thành công (demo)'
    });
  } catch (e) { next(e); }
};
