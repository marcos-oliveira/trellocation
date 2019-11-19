const mongoose = require('mongoose');

const Cliente = mongoose.model('Cliente');

const salvar = async (dadoscli) => {
    console.log('salvar', dadoscli);
    let {descricao, cor} = dadoscli;
    let dados = {descricao, cor};
    let cliente = null;
    if(dadoscli._id){
        cliente = await Cliente.findOne({_id: dadoscli._id});
    }
    if(!cliente){
        cliente = await Cliente.findOne({descricao: dadoscli.descricao});
    }
    if(!cliente){
        cliente = await Cliente.create(dados);
    }else{
        cliente = await Cliente.findByIdAndUpdate(cliente._id, dados, {new: true});
    }
    return cliente;
}

module.exports = {
    async index(req, res){
        const clientes = await Cliente.find({});
        return res.json(clientes);
    },

    async store(req, res){
        let dados = req.body;
        let cliente = await salvar(dados);
        return res.json(cliente);
    },

    async save(req, res){
        let dados = req.body.params.clientes;
        for (let j = 0; j < dados.length; j++) {
            await salvar(dados[j]);
        }
        const clientes = await Cliente.find({});
        return res.json(clientes);
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