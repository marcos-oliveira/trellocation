const mongoose = require('mongoose');

const Cliente = mongoose.model('Cliente');

module.exports = {
    async index(req, res){
        const clientes = await Cliente.find({});
        return res.json(clientes);
    },

    async store(req, res){
        let dados = req.body;
        let cliente = await Cliente.findOne({descricao: dados.descricao});
        if(!cliente){
            cliente = await Cliente.create(dados);
            console.log('create', dados);
        }else{
            console.log('updade', dados);
            cliente = await Cliente.findByIdAndUpdate(cliente._id, dados, {new: true});
        }
        return res.json(cliente);
    },

    async save(req, res){
        let dados = req.body;
        console.log('salvar', dados);
        for (let j = 0; j < dados.length; j++) {
            req.body.descricao = dados[j].descricao;
            req.body.cor = dados[j].cor;
            this.store(req, res);
        }
        return this.index;
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