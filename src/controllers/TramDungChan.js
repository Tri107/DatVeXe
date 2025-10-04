const TramDungChan = require('../models/TramDungChan');

exports.getAll = async (req, res) => {
  try {
    const data = await TramDungChan.getAll();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const data = await TramDungChan.getById(req.params.id);
    if (!data) return res.status(404).json({ message: "Không tìm thấy trạm dừng chân" });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const data = await TramDungChan.create(req.body);
    res.status(201).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const data = await TramDungChan.update(req.params.id, req.body);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const data = await TramDungChan.delete(req.params.id);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Gán trạm vào chuyến
exports.assignToChuyen = async (req, res) => {
  try {
    const { MaTram, MaChuyen } = req.body;
    const data = await TramDungChan.assignToChuyen(MaTram, MaChuyen);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
