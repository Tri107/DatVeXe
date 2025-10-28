const express = require('express');
const router = express.Router();
const { requireAdmin } = require('../../middleware/auth');
const TaiXe = require('../../models/TaiXe');

// Trang danh sách + form thêm
router.get('/', requireAdmin, async (req, res, next) => {
  try {
    const list = await TaiXe.getAll();           // ⚠️ đặt tên đúng 'list' để khớp EJS
    res.render('taixe/index', { user: req.user, list, error: null });
  } catch (e) { next(e); }
});

//  THÊM MỚI (khớp action="/admin/taixe/add")
router.post('/add', requireAdmin, async (req, res, next) => {
  try {
    const { TaiXe_name, TaiXe_age, TaiXe_BangLai, NgayVaoLam, SDT } = req.body;

    // (tuổi về số nguyên cho chắc)
    const age = parseInt(TaiXe_age, 10);

    await TaiXe.create({
      TaiXe_name,
      TaiXe_age: Number.isNaN(age) ? null : age,
      TaiXe_BangLai,
      // input type="date" dạng YYYY-MM-DD → DB DATE nhận trực tiếp
      NgayVaoLam,
      SDT
    });

    res.redirect('/admin/taixe');
  } catch (e) {
    // Bắt một số lỗi hay gặp để hiển thị đẹp
    let msg = e.message || 'Lỗi tạo tài xế';
    if (e.code === 'ER_DUP_ENTRY') msg = 'SĐT đã tồn tại, vui lòng chọn số khác.';
    try {
      const list = await TaiXe.getAll();
      res.render('taixe/index', { user: req.user, list, error: msg });
    } catch (e2) { next(e2); }
  }
});

// Form sửa
router.get('/edit/:id', requireAdmin, async (req, res, next) => {
  try {
    const item = await TaiXe.getById(req.params.id);
    if (!item) return res.redirect('/admin/taixe');
    res.render('taixe/edit', { user: req.user, item, error: null });
  } catch (e) { next(e); }
});

// Cập nhật (dùng method-override nếu form dùng _method=PUT)
router.put('/:id', requireAdmin, async (req, res, next) => {
  try {
    const { TaiXe_name, TaiXe_age, TaiXe_BangLai, NgayVaoLam, SDT } = req.body;
    await TaiXe.update(req.params.id, {
      TaiXe_name,
      TaiXe_age: parseInt(TaiXe_age, 10),
      TaiXe_BangLai,
      NgayVaoLam,
      SDT
    });
    res.redirect('/admin/taixe');
  } catch (e) {
    const item = await TaiXe.getById(req.params.id);
    res.render('taixe/edit', { user: req.user, item, error: e.message || 'Lỗi cập nhật' });
  }
});

// Xóa (giữ theo EJS của bạn: POST /delete/:id)
router.delete('/delete/:id', requireAdmin, async (req, res, next) => {
  try {
    await TaiXe.delete(req.params.id);
    res.redirect('/admin/taixe');
  } catch (e) { next(e); }
});

module.exports = router;
