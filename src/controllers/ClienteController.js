const mongoose = require('mongoose');

const Cliente = mongoose.model('Cliente');

module.exports = {
    async index(req, res){
        const {page = 1} = req.query;//req.query para parâmetros get
        const clientes = await Cliente.paginate({}, {page, limit: 10});
        return res.json(clientes);
    },

    async store(req, res){
        const cliente = await Cliente.create(req.body);
        return res.json(cliente);
    },

    async show(req, res){
        const cliente = await Cliente.findById(req.params.id);
        return res.json(cliente);
    },

    async update(req, res){
        const cliente = await Cliente.findByIdAndUpdate(req.params.id, req.body, {new: true});
        return res.json(cliente);
    },

    async destroy(req, res){
        const cliente = await Cliente.findByIdAndDelete(req.params.id);
        return res.send();
    }
};