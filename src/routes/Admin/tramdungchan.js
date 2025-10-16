const express = require('express');
const router = express.Router();
const { requireAdmin } = require('../../middleware/auth');
const TramDungChan = require('../../models/TramDungChan');

// 📋 Hiển thị danh sách trạm dừng chân
router.get('/', requireAdmin, async (req, res, next) => {
  try {
    const items = await TramDungChan.getAll();
    res.render('tramdungchan/index', { user: req.user, items, error: null });
  } catch (e) {
    next(e);
  }
});

// ➕ Thêm trạm dừng chân mới
router.post('/', requireAdmin, async (req, res, next) => {
  try {
    const { TramDungChan_name, Thoi_gian_dung } = req.body;
    await TramDungChan.create({ TramDungChan_name, Thoi_gian_dung });
    res.redirect('/admin/tramdungchan');
  } catch (e) {
    const items = await TramDungChan.getAll();
    res.render('tramdungchan/index', { user: req.user, items, error: e.message || 'Lỗi thêm trạm dừng chân' });
  }
});

// Form sửa trạm dừng chân
router.get('/edit/:id', requireAdmin, async (req, res, next) => {
  try {
    const item = await TramDungChan.getById(req.params.id);
    if (!item) return res.redirect('/admin/tramdungchan');
    res.render('tramdungchan/edit', { user: req.user, item, error: null });
  } catch (e) {
    next(e);
  }
});

// Cập nhật trạm dừng chân
router.put('/:id', requireAdmin, async (req, res, next) => {
  try {
    const { TramDungChan_name, Thoi_gian_dung } = req.body;
    await TramDungChan.update(req.params.id, { TramDungChan_name, Thoi_gian_dung });
    res.redirect('/admin/tramdungchan');
  } catch (e) {
    const item = await TramDungChan.getById(req.params.id);
    res.render('tramdungchan/edit', { user: req.user, item, error: e.message || 'Lỗi cập nhật trạm dừng chân' });
  }
});

// 🗑️ Xóa trạm dừng chân
router.delete('/:id', requireAdmin, async (req, res, next) => {
  try {
    await TramDungChan.delete(req.params.id);
    res.redirect('/admin/tramdungchan');
  } catch (e) {
    next(e);
  }
});

module.exports = router;
