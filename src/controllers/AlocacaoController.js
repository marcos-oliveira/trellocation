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
                for (let j = 0; j < alocacoes.length; j++) {
                    let umaalocacao = alocacoes[j];
                    umasemana.dias.push({dia: umaalocacao.diasemana, atividades: umaalocacao.atividades});
                }
                alocacao.semanas.push(umasemana);
            }
            alocacoes.push(alocacao);
        }
        return res.json(alocacoes);
    },

    async alocacoesnew(req, res){
        let alocacoes = [];

        const todassemanas = await Semana.find({});

        const pessoas = await Pessoa.find({});
        for (let index = 0; index < pessoas.length; index++) {
            const pessoa = pessoas[index];
            let alocacao = {nome: pessoa.nome, semanas: []};

            for (let i = 0; i < todassemanas.length; i++) {
                let semana = todassemanas[i];
                let umasemana = {nome: semana.nome, id: semana.id, dias: []};
                const alocacoes = await Alocacao.find({pessoa: pessoa._id, semana: semana._id});
                for (let j = 0; j < alocacoes.length; j++) {
                    let umaalocacao = alocacoes[j];
                    umasemana.dias.push({dia: umaalocacao.diasemana, cliente: umaalocacao.cliente, atividades: umaalocacao.atividades});
                }
                alocacao.semanas.push(umasemana);
            }
            alocacoes.push(alocacao);
        }
        return res.json(alocacoes);
    },

    async resumo(req, res){
        //deve retornar resumo objetos: {resumopessoas: [], resumoclientes: []}
                //resumopessoas[..., {nome: string, total: int, disponivel: int, folga: int, ferias: int, licenca: int}]
                //resumoclientes[..., {nome: string, legenda: {descricao, cor}, total: string}]
        let resumopessoas = [];
        let resumoclientes = [];
        const alocacoes = await Alocacao.find({});
        for (let j = 0; j < alocacoes.length; j++) {
            let umaalocacao = alocacoes[j];
            //resumo pessoas
            let k = 0;
            for (; k < resumopessoas.length; k++) {
                if(resumopessoas[k].nome == umaalocacao.pessoa.nome){
                    novo = false;
                }
            }
            if(k == resumopessoas.length){
                let pessoa = {nome: umaalocacao.pessoa.nome, total:0, disponivel:0, folga:0, ferias:0, licenca:0};
                resumopessoas.push(pessoa);
            }
            if(umaalocacao.atividades!=null && umaalocacao.atividades.length>0){
                if("LICENÇA" == umaalocacao.cliente.descricao.toUpperCase()){
                    resumopessoas[k].licenca++;
                }else{
                    if("FÉRIAS" == umaalocacao.cliente.descricao.toUpperCase()){
                        resumopessoas[k].ferias++;
                    }else{
                        if("FOLGA"==umaalocacao.cliente.descricao.toUpperCase()){
                            resumopessoas[k].folga++;
                        }else{
                            resumopessoas[k].total++;
                        }
                    }
                }
            }else{
                resumopessoas[k].disponivel++;
            }
            //resumo clientes
            k = 0;
            for (; k < resumoclientes.length; k++) {
                if(resumoclientes[k].nome == umaalocacao.cliente.descricao){
                    novo = false;
                }
            }
            if(k == resumoclientes.length){
                let cliente = {nome: umaalocacao.cliente.descricao, legenda: {descricao: umaalocacao.cliente.legenda, cor: umaalocacao.cliente.cor}, total:0};
                resumoclientes.push(cliente);
            }
            if(umaalocacao.atividades!=null && umaalocacao.atividades.length>0){
                if(!"LICENÇA FÉRIAS FOLGA".includes(umaalocacao.cliente.descricao.toUpperCase())){
                    resumopessoas[k].total++;
                }
            }else{
                resumoclientes[k].total++;
            }
        }
        return {resumopessoas, resumoclientes};
    },

    async index(req, res){
        const {page = 1} = req.query;//req.query para parâmetros get
        const alocacoes = await Alocacao.find({});
        return res.json(alocacoes);
    },

    async alocacoessemana(req, res){
        const alocacoes = await Alocacao.find({semana: req.query.id});
        return res.json(alocacoes);
    },
};