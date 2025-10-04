const Ghe = require('../models/Ghe');

exports.getAll = async (req, res) => {
  try {
    res.json(await Ghe.getAll());
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const data = await Ghe.getById(req.params.id);
    if (!data) return res.status(404).json({ message: "Không tìm thấy ghế" });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    res.status(201).json(await Ghe.create(req.body));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    res.json(await Ghe.update(req.params.id, req.body));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    res.json(await Ghe.delete(req.params.id));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
