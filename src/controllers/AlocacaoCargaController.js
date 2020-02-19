const mongoose = require('mongoose');

const AlocacaoCarga = mongoose.model('AlocacaoCarga');
const Pessoa = mongoose.model('Pessoa');
const Cliente = mongoose.model('Cliente');


module.exports = {

    async index(req, res) {
        const pessoas = await Pessoa.find({}).sort('nome');
        const clientes = await Cliente.find({}).sort('descricao');
        const alocacoes = [];
        for (let j = 0; j < pessoas.length; j++) {
            let pessoa = pessoas[j];
            let clientespessoa = [];
            const porpessoa = await AlocacaoCarga.find({pessoa: pessoa._id});
            for (let k = 0; k < clientes.length; k++) {
                let novocli = true;
                for (let l = 0; l < porpessoa.length; l++) {
                    if(porpessoa[l].cliente._id.equals(clientes[k]._id)){
                        novocli = false;
                        clientespessoa.push({id: porpessoa[l]._id, cliente: clientes[k].descricao, alterado:false, quantidade: porpessoa[l].quantidade});
                        break;
                    }
                }
                if(novocli){
                    let alocacao = await AlocacaoCarga.create({pessoa: pessoa, cliente: clientes[k], quantidade: 0});
                    clientespessoa.push({id: alocacao._id, cliente: clientes[k].descricao, alterado:false, quantidade: 0});
                }
            }
            alocacoes.push({id: pessoas[j]._id, pessoa: pessoa.nome, clientes: clientespessoa});
        }
        //const alocacoes = await AlocacaoCarga.find({});//.populate('cliente').populate('pessoa');
        const retorno = {alocacoes, clientes};
        return res.json(retorno);
    },

    async store(req, res){
        let dados = req.body.params.carga;
        for (let j = 0; j < dados.length; j++) {
            // let res = await AlocacaoCarga.findByIdAndUpdate(dados[j]);
            for (let k = 0; k < dados[j].clientes.length; k++) {
                if(dados[j].clientes[k].alterado){
                    await AlocacaoCarga.findByIdAndUpdate(dados[j].clientes[k].id, {quantidade: dados[j].clientes[k].quantidade});
                }
            }
        }
        return res.json(dados.length);
    },

    async formatar(req, res) {
        const alocacoes = await AlocacaoCarga.deleteMany({});
        return res.json(alocacoes);
    },
    
};