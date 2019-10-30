const mongoose = require('mongoose');

const Pessoa = mongoose.model('Pessoa');
const Semana = mongoose.model('Semana');
const Alocacao = mongoose.model('Alocacao');

const trello = require('../trello/boards');

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

const obterData = (checklist) => {
    
}

module.exports = {
    async index(req, res){
        const {page = 1} = req.query;//req.query para parâmetros get
        const pessoas = await Pessoa.paginate({}, {page, limit: 10});
        return res.json(pessoas);
    },

    async store(req, res){
        const pessoa = await Pessoa.create(req.body);
        return res.json(pessoa);
    },

    async show(req, res){
        const pessoa = await Pessoa.findById(req.params.id);
        return res.json(pessoa);
    },

    async update(req, res){
        const pessoa = await Pessoa.findByIdAndUpdate(req.params.id, req.body, {new: true});
        return res.json(pessoa);
    },

    async destroy(req, res){
        const pessoa = await Pessoa.findByIdAndDelete(req.params.id);
        return res.send();
    },
    
    async sincronizarAlocacoesSemana(req, res){
        const semanatrello = await trello.getList(req.query.id);
        if(!semanatrello){
            return res.send("semana não encontrada");
        }
        // console.log('semanatrello', semanatrello);
        const semana = await Semana.find({id: semanatrello.id});
        const pessoas = await trello.getCardsFromList(req.query.id);
        for (let i = 0; i < pessoas.length; i++) {
            let element = pessoas[i];
            let pessoa = await Pessoa.findOne({nome: element.name});
            if(!pessoa){
                const {name: nome} = element;
                pessoa = await Pessoa.create({nome});
            }
            const checklists = await trello.getChecklistFromCard(element.id);
            // console.log('checklists do ', pessoa.nome, checklists.length);
            for (let j = 0; j < checklists.length; j++) {
                // const dia = obterData(checklists[j]);
                // console.log('dia', dia);

                const diasemana = checklists[j].name;
                // console.log('diasemana', diasemana);
                const alocacaodados = {diasemana, pessoa: pessoa._id, semana: semana._id};
                // console.log('find', alocacaodados);
                let alocacao = await Alocacao.findOne(alocacaodados);
                if(!alocacao){
                    alocacao = await Alocacao.create(alocacaodados);
                }
                // console.log('alocacaocriada', alocacao);
                const checkitems = await trello.getCheckitemsFromChecklist(checklists[j].id);
                let atividades = [];
                for (let k = 0; k < checkitems.length; k++) {
                    atividades.push(checkitems[k].name);
                }
                // console.log('atividades', atividades);
                await Alocacao.findByIdAndUpdate(alocacao._id, {atividades}, {new: true});

                // semana.dias.push({ dia: checklist.name, atividades });
            }
        };
        return res.send(pessoas);
        // const retorno
    }
};