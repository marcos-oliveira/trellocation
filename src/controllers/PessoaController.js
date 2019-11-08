const mongoose = require('mongoose');

const Pessoa = mongoose.model('Pessoa');
const Semana = mongoose.model('Semana');
const Alocacao = mongoose.model('Alocacao');

const trello = require('../trello/boards');

const sincronizar = async (semana, apenasnovas = false) => {
    const pessoas = await trello.getCardsFromList(semana.id);
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
                for (let k = 0; k < checkitems.length; k++) {
                    atividades.push(checkitems[k].name);
                }
                // console.log('atividades', atividades);
                await Alocacao.findByIdAndUpdate(alocacao._id, { atividades }, { new: true });
                // console.log('incluindo');
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