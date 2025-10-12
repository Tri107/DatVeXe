const express = require('express');
const router = express.Router();
const { requireAdmin } = require('../../middleware/auth');
const LoaiXe = require('../../models/LoaiXe');

router.get('/', requireAdmin, async (req, res, next) => {
  try {
    const items = await LoaiXe.getAll();
    res.render('loaixe/index', { user: req.session.user, items, error: null });
  } catch (e) { next(e); }
});

router.post('/', requireAdmin, async (req, res, next) => {
  try {
    const { LoaiXe_name, Suc_chua } = req.body;
    await LoaiXe.create({ LoaiXe_name, Suc_chua: Number(Suc_chua) });
    res.redirect('/admin/loaixe');
  } catch (e) {
    const items = await LoaiXe.getAll();
    res.render('loaixe/index', { user: req.session.user, items, error: e.message || 'Lỗi tạo loại xe' });
  }
});

router.get('/:id/edit', requireAdmin, async (req, res, next) => {
  try {
    const item = await LoaiXe.getById(req.params.id);
    if (!item) return res.redirect('/admin/loaixe');
    res.render('loaixe/edit', { user: req.session.user, item, error: null });
  } catch (e) { next(e); }
});

router.put('/:id', requireAdmin, async (req, res, next) => {
  try {
    const { LoaiXe_name, Suc_chua } = req.body;
    await LoaiXe.update(req.params.id, { LoaiXe_name, Suc_chua: Number(Suc_chua) });
    res.redirect('/admin/loaixe');
  } catch (e) {
    const item = await LoaiXe.getById(req.params.id);
    res.render('loaixe/edit', { user: req.session.user, item, error: e.message || 'Lỗi cập nhật' });
  }
});

router.delete('/:id', requireAdmin, async (req, res, next) => {
  try { await LoaiXe.delete(req.params.id); res.redirect('/admin/loaixe'); }
  catch (e) { next(e); }
});

module.exports = router;
