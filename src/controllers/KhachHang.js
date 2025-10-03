const KhachHang = require('../models/KhachHang');

exports.getAll = async (req, res) => {
  try {
    res.json(await KhachHang.getAll());
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const data = await KhachHang.getById(req.params.id);
    if (!data) return res.status(404).json({ message: "Không tìm thấy" });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    res.status(201).json(await KhachHang.create(req.body));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    res.json(await KhachHang.update(req.params.id, req.body));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    res.json(await KhachHang.delete(req.params.id));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
