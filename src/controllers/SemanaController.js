const mongoose = require('mongoose');

const Semana = mongoose.model('Semana');

const trello = require('../trello/boards');

module.exports = {
    async index(req, res){
        const semanas = await Semana.find({}, {sort: '-inicio'});
        // const semanas = await Semana.find({}, {sort: '-inicio'});
        return res.json(semanas);
    },
    async indexpaginado(req, res){
        let {page = 1, limit = 4} = req.params;//req.query para parâmetros get
        page = parseInt(page);
        limit = parseInt(limit);
        const semanas = await Semana.paginate({}, {page, limit, sort: '-inicio'});
        // const semanas = await Semana.find({}, {sort: '-inicio'});
        return res.json(semanas);
    },

    async store(req, res){
        const semana = await Semana.create(req.body);
        return res.json(semana);
    },

    async show(req, res){
        const semana = await Semana.findById(req.params.id);
        return res.json(semana);
    },

    async update(req, res){
        const semana = await Semana.findByIdAndUpdate(req.params.id, req.body, {new: true});
        return res.json(semana);
    },

    async destroy(req, res){
        const semana = await Semana.findByIdAndDelete(req.params.id);
        return res.send();
    },
    //TODO SALVAR CLIENTE NA SINCRONIZACAO E TESTAR
    async sincronizar(req, res){
        const semanas = await trello.getListsFromBoard('538f872d42bdfee638a6b839');
        for (let i = 0; i < semanas.length; i++) {
            let element = semanas[i];
            const semana = await Semana.findOne({id: element.id});
            if(!semana){
                const {id, name: nome} = element;
                const datas = nome.split(" - ");
                let inicio = null;
                let fim = null;
                if(datas.length == 2){
                    let partes = datas[0].split("/");
                    inicio = new Date(partes[1]+"/"+partes[0]+"/"+partes[2]);
                    partes = datas[1].split("/");
                    fim = new Date(partes[1]+"/"+partes[0]+"/"+partes[2]);
                }
                await Semana.create({id, nome, inicio, fim});
            }
        };
        return res.send(semanas);
        // const retorno
    }
};