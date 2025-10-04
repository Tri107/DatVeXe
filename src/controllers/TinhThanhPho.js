const TinhThanhPho = require('../models/TinhThanhPho');

exports.getAll = async (req, res) => {
  try {
    res.json(await TinhThanhPho.getAll());
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const data = await TinhThanhPho.getById(req.params.id);
    if (!data) return res.status(404).json({ message: "Không tìm thấy tỉnh/thành phố" });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const data = await TinhThanhPho.create(req.body);
    res.status(201).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    res.json(await TinhThanhPho.update(req.params.id, req.body));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    res.json(await TinhThanhPho.delete(req.params.id));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
