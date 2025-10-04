const Xe_Ghe = require('../models/Xe_Ghe');

exports.getAll = async (req, res) => {
  try {
    res.json(await Xe_Ghe.getAll());
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    res.status(201).json(await Xe_Ghe.create(req.body));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const { BienSo, SoGhe } = req.params;
    res.json(await Xe_Ghe.delete(BienSo, SoGhe));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
