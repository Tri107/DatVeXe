const TaiKhoan = require('../models/TaiKhoan');
const bcrypt = require('bcrypt');

exports.getAll = async (req, res) => {
  try {
    res.json(await TaiKhoan.getAll());
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const data = await TaiKhoan.getById(req.params.id);
    if (!data) return res.status(404).json({ message: "Không tìm thấy tài khoản" });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const hashed = await bcrypt.hash(req.body.MatKhau, 10);
    const tk = await TaiKhoan.create({ ...req.body, MatKhau: hashed });
    res.status(201).json(tk);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const hashed = await bcrypt.hash(req.body.MatKhau, 10);
    const tk = await TaiKhoan.update(req.params.id, { ...req.body, MatKhau: hashed });
    res.json(tk);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    res.json(await TaiKhoan.delete(req.params.id));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
