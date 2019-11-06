const mongoose = require('mongoose');

const Alocacao = mongoose.model('Alocacao');
const Pessoa = mongoose.model('Pessoa');
const Semana = mongoose.model('Semana');


const tratarTexto = (texto) => {
    if (texto == null) {
        return null;
    }
    let txtarray = texto.split(' ');
    if (txtarray.length == 0) {
        return texto;
    }
    if (txtarray.length == 1) {
        return txtarray[0];
    }
    let legenda = texto.split(' ')[0];
    if (legenda == '[') {
        legenda = texto.split(' ')[1];
    } else {
        legenda = legenda.replace('[', '').replace(']', '');
    }
    return legenda;
}


module.exports = {
    async alocacoes(req, res){
        let alocacoes = [];

        const todassemanas = await Semana.find({});
        // const semanas = [];
        // for (let index = 0; index < todassemanas.length; index++) {
        //     semanas.push({nome: todassemanas[index].nome, dias:[]});
        // }

        const pessoas = await Pessoa.find({});
        for (let index = 0; index < pessoas.length; index++) {
            const pessoa = pessoas[index];
            let alocacao = {nome: pessoa.nome, semanas: []};

            for (let i = 0; i < todassemanas.length; i++) {
                let semana = todassemanas[i];
                let umasemana = {nome: semana.nome, id: semana.id, dias: []};
                const alocacoes = await Alocacao.find({pessoa: pessoa._id, semana: semana._id});
                console.log('find ->', {pessoa: pessoa._id, semana: semana._id}, 'lenght', alocacoes.length);
                for (let j = 0; j < alocacoes.length; j++) {
                    let umaalocacao = alocacoes[j];
                    umasemana.dias.push({dia: umaalocacao.diasemana, atividades: umaalocacao.atividades});
                }
                console.log('alocacao.semanas',alocacao.semanas);
                alocacao.semanas.push(umasemana);
            }
            alocacoes.push(alocacao);
        }
        return res.json(alocacoes);
    },

    async index(req, res){
        const {page = 1} = req.query;//req.query para parâmetros get
        const alocacoes = await Alocacao.find({});
        return res.json(alocacoes);
    },

    async alocacoessemana(req, res){
        const alocacoes = await Alocacao.find({semana: req.query.id});
        console.log(req.query.id);
        return res.json(alocacoes);
    },
};