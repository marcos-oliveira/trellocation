const mongoose = require('mongoose');

const Pessoa = mongoose.model('Pessoa');

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
    
    async sincronizar(req, res){
        const semanas = await trello.getListsFromBoard('538f872d42bdfee638a6b839');
        for (let i = 0; i < semanas.length; i++) {
            let element = semanas[i];
            const semana = await Semana.findById(element.id);
            if(semana==null){
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