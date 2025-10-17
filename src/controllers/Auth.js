const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const TaiKhoan = require('../models/TaiKhoan');
const axios = require('axios');
const qs = require('querystring');

const PHONE_REGEX = /^0\d{9}$/;
const normalizePhone = s => String(s || '').replace(/\s+/g, '').replace(/^\+84/, '0');
const otpStore = {};

module.exports = {
  sendOtp: async (req, res) => {
  try {
    let { SDT } = req.body;
    SDT = normalizePhone(SDT);
    if (!PHONE_REGEX.test(SDT))
      return res.status(400).json({ message: 'SĐT không hợp lệ' });

    const existed = await TaiKhoan.getBySDT(SDT);
    if (existed)
      return res.status(409).json({ message: 'SĐT đã tồn tại' });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    otpStore[SDT] = { otp, expires: Date.now() + 5 * 60 * 1000 };

   const axios = require('axios');

const response = await axios.post(
  'https://rest.esms.vn/MainService.svc/json/SendMultipleMessage_V4_post_json/',
  {
    Phone: SDT,
    Content: `${otp} la ma xac minh dang ky Baotrixemay cua ban`,
   //Content: `Ma OTP xac nhan dang ky cua ban la: ${otp}`,
    ApiKey: process.env.ESMS_API_KEY,
    SecretKey: process.env.ESMS_SECRET_KEY,
    SmsType: '2',
    Brandname: 'Baotrixemay'   
    
  },
  {
    headers: { 'Content-Type': 'application/json' }
  }
);



console.log('📩 eSMS response:', response.data);

    if (String(response.data.CodeResult) !== '100') {
      return res.status(400).json({
        message: 'Gửi OTP thất bại',
        esms: response.data
      });
    }

    return res.json({ message: 'Đã gửi OTP thành công' });
  } catch (err) {
    console.error('❌ Lỗi gửi OTP:',
      err.response?.status,
      err.response?.data || err.message
    );

    return res.status(500).json({
      message: 'Lỗi gửi OTP',
      error: err.response?.data || err.message
    });
  }
},



  verifyOtp: async (req, res) => {
    try {
      let { SDT, password, otp } = req.body;
      SDT = normalizePhone(SDT);

      const record = otpStore[SDT];
      if (!record) return res.status(400).json({ message: 'OTP không tồn tại hoặc đã hết hạn' });
      if (Date.now() > record.expires) return res.status(400).json({ message: 'OTP đã hết hạn' });
      if (record.otp !== otp) return res.status(400).json({ message: 'OTP không chính xác' });

      const hash = await bcrypt.hash(password, 10);
      await TaiKhoan.create({ SDT, Password_hash: hash, role: 'khachhang' });

      delete otpStore[SDT];
      return res.status(201).json({ message: 'Đăng ký thành công', SDT });
    } catch (err) {
      return res.status(500).json({ message: 'Lỗi xác thực OTP', error: err.message });
    }
  },
  register: async (req, res, next) => {
    try {
      let { SDT, password } = req.body;
      SDT = normalizePhone(SDT);
      if (!SDT || !password) return res.status(400).json({ message: 'Thiếu SDT hoặc password' });
      if (!PHONE_REGEX.test(SDT)) return res.status(400).json({ message: 'SDT không hợp lệ' });
      if (String(password).length < 6) return res.status(400).json({ message: 'Password tối thiểu 6 ký tự' });

      const existed = await TaiKhoan.getBySDT(SDT);
      if (existed) return res.status(409).json({ message: 'SDT đã tồn tại' });

      const hash = await bcrypt.hash(password, 10);
      await TaiKhoan.create({ SDT, Password_hash: hash, role: 'khachhang' });
      return res.status(201).json({ SDT, role: 'khachhang', message: 'Đăng ký thành công' });
    } catch (e) {
      return next(e);
    }
  },

  login: async (req, res, next) => {
    try {
      let { SDT, password } = req.body;
      SDT = normalizePhone(SDT);
      if (!SDT || !password) return res.status(400).json({ message: 'Thiếu SDT hoặc password' });

      const tk = await TaiKhoan.getBySDT(SDT);
      if (!tk) return res.status(401).json({ message: 'Sai thông tin đăng nhập' });

      const ok = await bcrypt.compare(password, tk.Password_hash);
      if (!ok) return res.status(401).json({ message: 'Sai thông tin đăng nhập' });

      //  Tạo JWT
      const token = jwt.sign(
        { sdt: tk.SDT, role: tk.role },
        process.env.JWT_SECRET,
        { expiresIn: '2h' }
      );

      //  Lưu vào cookie (httpOnly)
      res.cookie('access_token', token, {
        httpOnly: true,
        sameSite: 'lax',
        secure: false, // true nếu dùng HTTPS
        maxAge: 2 * 60 * 60 * 1000
      });

      return res.json({ message: 'Đăng nhập thành công',token,  user: { SDT: tk.SDT, role: tk.role } });
    } catch (e) {
      return next(e);
    }
  },

  logout: (req, res, next) => {
    res.clearCookie('access_token');
    return res.json({ message: 'Đăng xuất thành công' });
  },

  me: (req, res) => {
    try {
      const token = req.cookies?.access_token;
      if (!token) return res.status(401).json({ message: 'Chưa đăng nhập' });

      const user = jwt.verify(token, process.env.JWT_SECRET);
      return res.json({ user });
    } catch {
      return res.status(401).json({ message: 'Token không hợp lệ hoặc đã hết hạn' });
    }
  }
};