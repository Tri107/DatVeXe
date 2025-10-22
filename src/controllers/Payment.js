const crypto = require("crypto");
const moment = require("moment");

// ✅ Hàm sắp xếp object theo key alphabet
function sortObject(obj) {
  const sorted = {};
  Object.keys(obj)
    .sort()
    .forEach((k) => (sorted[k] = obj[k]));
  return sorted;
}

exports.createPayment = async (req, res) => {
  try {
    const { amount, veId } = req.body;
    if (!amount || !veId) {
      return res.status(400).json({ message: "amount và veId là bắt buộc" });
    }

    // --- ENV cấu hình ---
    const tmnCode = (process.env.VNP_TMN_CODE || "").trim();
    const secretKey = (process.env.VNP_HASH_SECRET || "").trim();
    const vnpUrl =
      process.env.VNP_URL ||
      "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
    const returnUrl =
      process.env.VNP_RETURN_URL ||
      "https://sandbox.vnpayment.vn/VnPayReturn";

    // --- Tạo các tham số thời gian ---
    const now = new Date();
    const createDate = moment(now).format("YYYYMMDDHHmmss");
    const expireDate = moment(now).add(15, "minutes").format("YYYYMMDDHHmmss");
    const ipAddr =
      req.headers["x-forwarded-for"] ||
      req.socket?.remoteAddress ||
      "127.0.0.1";

    // --- Mã đơn hàng duy nhất ---
    const orderId = `${veId}_${Date.now()}`;

    // --- Tạo tham số thanh toán ---
    let vnp_Params = {
      vnp_Version: "2.1.0",
      vnp_Command: "pay",
      vnp_TmnCode: tmnCode,
      vnp_Amount: Math.round(Number(amount) * 100),
      vnp_CreateDate: createDate,
      vnp_ExpireDate: expireDate,
      vnp_CurrCode: "VND",
      vnp_IpAddr: ipAddr,
      vnp_Locale: "vn",
      vnp_OrderInfo: `Thanh toan ve ${veId}`,
      vnp_OrderType: "other",
      vnp_ReturnUrl: returnUrl,
      vnp_TxnRef: orderId,
    };

    // --- Sắp xếp key alphabet ---
    vnp_Params = sortObject(vnp_Params);

    // --- Ghép query string thủ công ---
    const searchParams = new URLSearchParams();
    for (const [key, value] of Object.entries(vnp_Params)) {
      if (value !== undefined && value !== null && value !== "") {
        searchParams.append(key, value.toString());
      }
    }

    // --- Lấy chuỗi dữ liệu ký ---
    const signData = searchParams.toString();

    // --- Tạo chữ ký SHA512 (đúng chuẩn VNPay) ---
    const signed = crypto
      .createHmac("sha512", secretKey)
      .update(Buffer.from(signData, "utf-8"))
      .digest("hex");

    // --- Thêm hash vào query ---
    searchParams.append("vnp_SecureHashType", "HMACSHA512");
    searchParams.append("vnp_SecureHash", signed);

    // --- Tạo link thanh toán ---
    const paymentUrl = `${vnpUrl}?${searchParams.toString()}`;

    console.log("✅ SIGN DATA:", signData);
    console.log("✅ HASH:", signed);
    console.log("✅ VNPay URL:", paymentUrl);

    return res.json({ paymentUrl, veId });
  } catch (err) {
    console.error("❌ Lỗi createPayment:", err);
    return res
      .status(500)
      .json({ message: "Lỗi tạo thanh toán", error: String(err) });
  }
};

// ✅ Callback khi thanh toán xong
exports.vnpayReturn = (req, res) => {
  const ok = req.query.vnp_ResponseCode === "00";
  res.send(`
    <div style="font-family:sans-serif; text-align:center; padding:40px">
      <h2 style="color:${ok ? "green" : "crimson"}">
        ${ok ? "✅ Thanh toán thành công!" : "❌ Thanh toán thất bại!"}
      </h2>
      <p>Mã tham chiếu: <b>${req.query.vnp_TxnRef || ""}</b></p>
      <p>Số tiền: <b>${
        req.query.vnp_Amount ? Number(req.query.vnp_Amount) / 100 : 0
      } VND</b></p>
    </div>
  `);
};
