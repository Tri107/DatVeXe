const express = require('express');
const router = express.Router();
const TaiXe = require('../../models/TaiXe');

// Danh sách tài xế
router.get('/', async (req, res, next) => {
  try {
    const list = await TaiXe.getAll();
    res.render('taixe/index', { user: req.session?.user || {}, list, error: null });
  } catch (err) {
    next(err);
  }
});

// Form sửa
router.get('/edit/:id', async (req, res, next) => {
  try {
    const item = await TaiXe.getById(req.params.id);
    if (!item) return res.status(404).send('Không tìm thấy tài xế');
    res.render('taixe/edit', { user: req.session?.user || {}, item, error: null });
  } catch (err) {
    next(err);
  }
});

// Thêm tài xế
router.post('/add', async (req, res, next) => {
  try {
    await TaiXe.create(req.body);
    res.redirect('/admin/taixe');
  } catch (err) {
    const list = await TaiXe.getAll();
    res.render('taixe/index', { 
      user: req.session?.user || {}, 
      list, 
      error: err.message || 'Lỗi thêm tài xế!'
    });
  }
});

// Cập nhật tài xế
router.post('/edit/:id', async (req, res, next) => {
  try {
    await TaiXe.update(req.params.id, req.body);
    res.redirect('/admin/taixe');
  } catch (err) {
    const item = await TaiXe.getById(req.params.id);
    res.render('taixe/edit', { 
      user: req.user || {}, 
      item, 
      error: err.message || 'Lỗi cập nhật tài xế!'
    });
  }
});

// Xóa tài xế
router.post('/delete/:id', async (req, res, next) => {
  try {
    await TaiXe.delete(req.params.id);
    res.redirect('/admin/taixe');
  } catch (err) {
    next(err);
  }
});

module.exports = router;
