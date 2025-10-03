const Xe = require('../models/Xe')

exports.getAll = async (req, res) => {
    try {
        res.json(await Xe.getAll());
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};

exports.getByBienSo = async (req, res) => {
    try {
        const data = await Xe.getByBienSo(req.params.bienso)
        if(!data){
            return res.status(404).json({message: "Not found"});
        }
        res.json(data)
    } catch (error) {
        res.status(500).json({ error: err.message });
    }
};

exports.create = async (req, res) =>{
    try {
        res.status(201).json(await Xe.create(req.body))
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

exports.update = async (req, res) =>{
    try {
        res.status(200).json(await Xe.update(req.params.bienso,req.body))
    } catch (error) {
        res.status(500).json({ error: err.message });
    }
}

exports.delete = async (req, res) =>{
    try {
        res.status(200).json(await Xe.delete(req.params.bienso))
    } catch (error) {
        res.status(500).json({ error: err.message });
    }
}
