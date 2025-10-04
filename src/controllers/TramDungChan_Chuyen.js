const TramDungChan_Chuyen = require('../models/TramDungChan_Chuyen');

exports.getAll = async (req, res) => {
  try {
    res.json(await TramDungChan_Chuyen.getAll());
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    res.status(201).json(await TramDungChan_Chuyen.create(req.body));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const { MaTram, MaChuyen } = req.params;
    res.json(await TramDungChan_Chuyen.delete(MaTram, MaChuyen));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
