const mongoose = require('mongoose');

const Alocacao = mongoose.model('Alocacao');
const Pessoa = mongoose.model('Pessoa');
const Semana = mongoose.model('Semana');
const AlocacaoCarga = mongoose.model('AlocacaoCarga');
const Cliente = mongoose.model('Cliente');


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
    async alocacoes(req, res) {
        let alocacoes = [];

        const todassemanas = await Semana.find({});
        // const semanas = [];
        // for (let index = 0; index < todassemanas.length; index++) {
        //     semanas.push({nome: todassemanas[index].nome, dias:[]});
        // }

        const pessoas = await Pessoa.find({});
        for (let index = 0; index < pessoas.length; index++) {
            const pessoa = pessoas[index];
            let alocacao = { nome: pessoa.nome, semanas: [] };

            for (let i = 0; i < todassemanas.length; i++) {
                let semana = todassemanas[i];
                let umasemana = { nome: semana.nome, id: semana.id, dias: [] };
                const alocacoes = await Alocacao.find({ pessoa: pessoa._id, semana: semana._id });
                for (let j = 0; j < alocacoes.length; j++) {
                    let umaalocacao = alocacoes[j];
                    umasemana.dias.push({ dia: umaalocacao.diasemana, atividades: umaalocacao.atividades });
                }
                alocacao.semanas.push(umasemana);
            }
            alocacoes.push(alocacao);
        }
        return res.json(alocacoes);
    },

    async alocacoesnew(req, res) {
        let alocacoes = [];

        let {page = 1, limit = 4} = req.params;//req.query para parâmetros get
        page = parseInt(page);
        limit = parseInt(limit);
        const paginas = await Semana.paginate({}, {page, limit, sort: '-inicio'});
        const todassemanas = paginas.docs;
        // const todassemanas = await Semana.find({}, {sort: '-inicio'});

        const pessoas = await Pessoa.find({});
        for (let index = 0; index < pessoas.length; index++) {
            const pessoa = pessoas[index];
            let alocacao = { nome: pessoa.nome, semanas: [] };

            for (let i = 0; i < todassemanas.length; i++) {
                let semana = todassemanas[i];
                let umasemana = { nome: semana.nome, id: semana.id, dias: [] };
                const alocacoes = await Alocacao.find({ pessoa: pessoa._id, semana: semana._id }).populate('cliente');
                for (let j = 0; j < alocacoes.length; j++) {
                    let umaalocacao = alocacoes[j];
                    if(umaalocacao.cliente){
                        umasemana.dias.push({ dia: umaalocacao.diasemana, cliente: umaalocacao.cliente/*, atividades: umaalocacao.atividades*/ });
                    }else{
                        umasemana.dias.push({ dia: umaalocacao.diasemana, atividades: umaalocacao.atividades });
                    }
                }
                alocacao.semanas.push(umasemana);
            }
            alocacoes.push(alocacao);
        }
        return res.json(alocacoes);
    },

    async alocacoescompleto(req, res) {
        let alocacoes = [];

        let {page = 1, limit = 4} = req.params;//req.query para parâmetros get
        page = parseInt(page);
        limit = parseInt(limit);
        const paginas = await Semana.paginate({}, {page, limit, sort: '-inicio'});
        const todassemanas = paginas.docs;
        // const todassemanas = await Semana.find({}, {sort: '-inicio'});

        const pessoas = await Pessoa.find({});
        for (let index = 0; index < pessoas.length; index++) {
            const pessoa = pessoas[index];
            let alocacao = { nome: pessoa.nome, semanas: [] };

            for (let i = 0; i < todassemanas.length; i++) {
                let semana = todassemanas[i];
                let umasemana = { nome: semana.nome, id: semana.id, dias: [] };
                const alocacoes = await Alocacao.find({ pessoa: pessoa._id, semana: semana._id }).populate('cliente');
                for (let j = 0; j < alocacoes.length; j++) {
                    let umaalocacao = alocacoes[j];
                    if(umaalocacao.cliente){
                        umasemana.dias.push({ dia: umaalocacao.diasemana, cliente: umaalocacao.cliente/*, atividades: umaalocacao.atividades*/ });
                    }else{
                        umasemana.dias.push({ dia: umaalocacao.diasemana, atividades: umaalocacao.atividades });
                    }
                }
                alocacao.semanas.push(umasemana);
            }
            alocacoes.push(alocacao);
        }
        const clientes = await Cliente.find({});
        return res.json({alocacoes, semanas: todassemanas, paginas: paginas.pages, clientes});
    },

    async resumo(req, res) {
        //deve retornar resumo objetos: {resumopessoas: [], resumoclientes: []}
        //resumopessoas[..., {nome: string, total: int, disponivel: int, folga: int, ferias: int, licenca: int}]
        //resumoclientes[..., {nome: string, legenda: {descricao, cor}, total: string}]
        let resumopessoas = [];
        let resumoclientes = [];
        const alocacoes = await Alocacao.find({}).populate('pessoa').populate('cliente');
        for (let j = 0; j < alocacoes.length; j++) {
            let umaalocacao = alocacoes[j];
            //resumo pessoas
            let k = 0;
            for (; k < resumopessoas.length; k++) {
                if (resumopessoas[k].idpessoa == umaalocacao.pessoa._id) {
                    break;
                }
            }
            if (k == resumopessoas.length) {
                let pessoa = { idpessoa: umaalocacao.pessoa._id, nome: umaalocacao.pessoa.nome, total: 0, disponivel: 0, folga: 0, ferias: 0, licenca: 0 };
                resumopessoas.push(pessoa);
            }
            if (umaalocacao.atividades != null && umaalocacao.atividades.length > 0) {
                if (!umaalocacao.cliente) {
                    resumopessoas[k].total++;
                    //TODO isso mesmo quando não sabe o cliente?
                } else {
                    if ("LICENÇA" == umaalocacao.cliente.descricao.toUpperCase()) {
                        resumopessoas[k].licenca++;
                    } else {
                        if ("FÉRIAS" == umaalocacao.cliente.descricao.toUpperCase()) {
                            resumopessoas[k].ferias++;
                        } else {
                            if ("FOLGA" == umaalocacao.cliente.descricao.toUpperCase()) {
                                resumopessoas[k].folga++;
                            } else {
                                resumopessoas[k].total++;
                            }
                        }
                    }
                }
            } else {
                resumopessoas[k].disponivel++;
            }
            //resumo clientes
            k = 0;
            if (umaalocacao.cliente) {
                for (; k < resumoclientes.length; k++) {
                    if (resumoclientes[k].nome == umaalocacao.cliente.descricao) {
                        break;
                    }
                }
                if (k == resumoclientes.length) {
                    let cliente = { nome: umaalocacao.cliente.descricao, legenda: { descricao: umaalocacao.cliente.legenda, cor: umaalocacao.cliente.cor }, total: 0 };
                    resumoclientes.push(cliente);
                }
                resumoclientes[k].total++;
            }
        }
        let cargas = await AlocacaoCarga.find({}).populate('cliente');
        for (let l = 0; l < cargas.length; l++) {
            for (let k = 0; k < resumopessoas.length; k++) {
                if(cargas[l].quantidade!=0 && cargas[l].pessoa._id.equals(resumopessoas[k].idpessoa)){
                    if ("LICENÇA" == cargas[l].cliente.descricao.toUpperCase()) {
                        resumopessoas[k].licenca += cargas[l].quantidade;
                    } else {
                        if ("FÉRIAS" == cargas[l].cliente.descricao.toUpperCase()) {
                            resumopessoas[k].ferias += cargas[l].quantidade;
                        } else {
                            if ("FOLGA" == cargas[l].cliente.descricao.toUpperCase()) {
                                resumopessoas[k].folga += cargas[l].quantidade;
                            } else {
                                resumopessoas[k].total += cargas[l].quantidade;
                            }
                        }
                    }
                }
            }
            for (let k = 0; k < resumoclientes.length; k++) {
                if(cargas[l].cliente.descricao == resumoclientes[k].nome){
                    resumoclientes[k].total += cargas[l].quantidade;
                }
            }
        }
        return res.json({ resumopessoas, resumoclientes });
    },

    async index(req, res) {
        const { page = 1 } = req.query;//req.query para parâmetros get
        const alocacoes = await Alocacao.find({});
        return res.json(alocacoes);
    },

    async alocacoessemana(req, res) {
        const alocacoes = await Alocacao.find({ semana: req.query.id });
        return res.json(alocacoes);
    },

    async formatar(req, res) {
        const alocacoes = await Alocacao.deleteMany({});
        return res.json(alocacoes);
    },
};