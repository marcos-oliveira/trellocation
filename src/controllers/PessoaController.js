const mongoose = require('mongoose');

const Pessoa = mongoose.model('Pessoa');
const Semana = mongoose.model('Semana');
const Alocacao = mongoose.model('Alocacao');
const ClienteTag = mongoose.model('ClienteTag');
const Cliente = mongoose.model('Cliente');

const trello = require('../trello/boards');



const tratarTexto = (texto) => {
    if (texto == null) {
        return '-';
    }

    var str = '';

    let txtarray = texto.split(' ');
    if (txtarray.length == 0) {
        str = texto;
    }
    if (txtarray.length == 1) {
        str = txtarray[0];
    }
    let legenda = texto.split(' ')[0];
    if (legenda == '[') {
        str = texto.split(' ')[1];
    } else {
        str = legenda;
    }

    str = str.toString().replace('[', '').replace(']', '').replace('_', '').replace('`', '').replace('.', '').replace('-', '').split('*').join('').toUpperCase();
    return str;
}

const resumoatividades = (atividades) => {
    if (atividades == null || atividades.length == 0) {
        return '';
    }
    if (atividades.length == 1) {
        return atividades[0];
    }
    let contagem = [];
    for (let index = 0; index < atividades.length; index++) {
        if (contagem[atividades[index]] == null) {
            contagem[atividades[index]] = 1;
        } else {
            contagem[atividades[index]]++;
        }
    }
    var atividadesfiltered = atividades.filter(function (item, pos) {
        return atividades.indexOf(item) == pos;
    });

    let maior = atividadesfiltered[0];
    for (let index = 1; index < atividadesfiltered.length; index++) {
        if (contagem[atividadesfiltered[index]] > contagem[maior]) {
            maior = atividadesfiltered[index];
        } else {
            if (contagem[atividadesfiltered[index]] == contagem[maior] && 'D3' == maior.toUpperCase()) {
                maior = atividadesfiltered[index];
            }
        }

    }
    return maior;
}

const buscarTag = (tagscli, atividades) => {
    if (tagscli == null || tagscli.length == 0) {
        return null;
    }
    if (atividades == null || atividades.length == 0) {
        return null;
    }
    let contagem = [];
    if (atividades.length > 0) {
        for (let t = 0; t < tagscli.length; t++) {
            contagem[tagscli[t].descricao] = 0;
            for (let index = 0; index < atividades.length; index++) {
                if(atividades[index].includes(tagscli[t].descricao)){
                    contagem[tagscli[t].descricao]++;
                }
            }
        }
    }

    let maior = tagscli[0];
    for (let index = 1; index < tagscli.length; index++) {
        if (contagem[tagscli[index].descricao] > contagem[maior.descricao]) {
            maior = tagscli[index];
        } else {
            if (contagem[tagscli[index].descricao] == contagem[maior.descricao] && 'D3' != maior.descricao.toUpperCase()) {
                maior = tagscli[index];
            }
        }

    }
    return maior;
}

const buscarCli = (clientes, atividades) => {
    if (atividades == null || atividades.length == 0) {
        return null;
    }
    let contagem = [];
    if (atividades.length > 0) {
        for (let t = 0; t < clientes.length; t++) {
            contagem[clientes[t].descricao] = 0;
            for (let index = 0; index < atividades.length; index++) {
                if(atividades[index].toUpperCase().includes(clientes[t].descricao)){
                    contagem[clientes[t].descricao]++;
                }
            }
        }
    }

    // console.log('vetor contagem', contagem);
    let maior = clientes[0];
    for (let index = 1; index < clientes.length; index++) {
        if (contagem[clientes[index].descricao] > contagem[maior.descricao]) {
            maior = clientes[index];
        } else {
            if (contagem[clientes[index].descricao] == contagem[maior.descricao] && 'D3' != maior.descricao.toUpperCase()) {
                maior = clientes[index];
            }
        }

    }
    return maior;
}


const obterAtividadesDia = (dia, dias, tratatexto = true) => {
    for (let i = 0; i < dias.length; i++) {
        let element = dias[i];
        if (valores[dia].includes(element.dia.toUpperCase().substring(0, 3))) {
            let atividadestratadas = [];
            for (let index = 0; index < element.atividades.length; index++) {
                if (tratatexto) {
                    atividadestratadas.push(tratarTexto(element.atividades[index]));
                } else {
                    atividadestratadas.push(element.atividades[index]);
                }
            }
            return atividadestratadas;
        }
    };
    return "";
}


const sincronizar = async (semana, apenasnovas = false) => {
    const pessoas = await trello.getCardsFromList(semana.id);
    const tagscli = await ClienteTag.find({});
    const clientes = await Cliente.find({});
    for (let i = 0; i < pessoas.length; i++) {
        let element = pessoas[i];
        let pessoa = await Pessoa.findOne({ nome: element.name });
        if (!pessoa) {
            const { name: nome } = element;
            pessoa = await Pessoa.create({ nome });
        }
        const checklists = await trello.getChecklistFromCard(element.id);
        // console.log('checklists do ', pessoa.nome, checklists.length);
        for (let j = 0; j < checklists.length; j++) {
            // const dia = obterData(checklists[j]);
            // console.log('dia', dia);

            const diasemana = checklists[j].name;
            // console.log('diasemana', diasemana);
            const alocacaodados = { diasemana, pessoa: pessoa._id, semana: semana._id };
            // console.log('find', alocacaodados);
            let alocacao = await Alocacao.findOne(alocacaodados);
            let nova = false;
            if (!alocacao) {
                alocacao = await Alocacao.create(alocacaodados);
                nova = true;
            }
            // console.log('alocacaocriada', alocacao);
            // console.log('alocacaodados', alocacaodados);
            if ((apenasnovas && nova) || (!apenasnovas)) {
                const checkitems = await trello.getCheckitemsFromChecklist(checklists[j].id);
                let atividades = [];
                // let atividadestags = [];
                for (let k = 0; k < checkitems.length; k++) {
                    atividades.push(checkitems[k].name);
                    // atividadestags.push(tratarTexto(checkitems[k].name));
                }
                // let clientestr = resumoatividades(atividadestags);
                // console.log('ATIVIDADES', atividades);
                if (clientes != null || clientes.length >= 0) {
                    let cliente = buscarCli(clientes, atividades);
                    if(cliente){
                        // console.log('achou cliente direto', cliente);
                        await Alocacao.findByIdAndUpdate(alocacao._id, { atividades, cliente }, { new: true });
                    }else{
                        let clientetag = buscarTag(tagscli, atividades);
                        // let clidados = {descricao: clientestr};
                        // clientetag = await ClienteTag.findOne( {descricao: { $regex: new RegExp("^" + clientestr, "i") }} );
                        // if(!clientetag && clientestr!=''){
                        //     let cliente = await Cliente.findOne( {descricao: { $regex: new RegExp("^" + clientestr, "i") }} );
                        //     if(cliente){
                        //         clidados.cliente = cliente;
                        //     }
                        //     clientetag = await ClienteTag.create(clidados);
                        // }
                        // console.log('atividades', atividades);
                        if(clientetag){
                            console.log('procurou nas tags e achou', clientetag);
                            await Alocacao.findByIdAndUpdate(alocacao._id, { atividades, cliente: clientetag.cliente }, { new: true });
                        }else{
                            console.log('procurou nas tags e não achou', clientetag);
                            await Alocacao.findByIdAndUpdate(alocacao._id, { atividades }, { new: true });
                        }
                        // console.log('incluindo');
                    }
                }
            }

            // semana.dias.push({ dia: checklist.name, atividades });
        }
    };
}

module.exports = {
    async index(req, res) {
        const { page = 1 } = req.query;//req.query para parâmetros get
        const pessoas = await Pessoa.find({});
        return res.json(pessoas);
    },

    async store(req, res) {
        const pessoa = await Pessoa.create(req.body);
        return res.json(pessoa);
    },

    async show(req, res) {
        const pessoa = await Pessoa.findById(req.params.id);
        return res.json(pessoa);
    },

    async update(req, res) {
        const pessoa = await Pessoa.findByIdAndUpdate(req.params.id, req.body, { new: true });
        return res.json(pessoa);
    },

    async destroy(req, res) {
        const pessoa = await Pessoa.findByIdAndDelete(req.params.id);
        return res.send();
    },

    async sincronizarAlocacoesSemana(req, res) {
        // const semanatrello = await trello.getList(req.query.id);
        // if (!semanatrello) {
        //     return res.send("semana não encontrada");
        // }
        // console.log('semanatrello', semanatrello);
        let todas = await Semana.find();
        const semana = await Semana.findOne({ id: req.query.id });
        await sincronizar(semana, req.query.apenasnovas);
        return res.send('OK');
        // const retorno
    },

    async sincronizarTodasAlocacoes(req, res) {
        // console.log('semanatrello', semanatrello);
        const semanas = await Semana.find({});
        for (let s = 0; s < semanas.length; s++) {
            let semana = semanas[s];
            await sincronizar(semana, true);
        }
        return res.send('OK');
        // const retorno
    }
};