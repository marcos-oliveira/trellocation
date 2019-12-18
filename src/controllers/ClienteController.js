const mongoose = require('mongoose');

const Cliente = mongoose.model('Cliente');
const ClienteTag = mongoose.model('ClienteTag');

const inicializar = async () => {
    const clientes_ini = [
        {descricao: 'D3', legenda: 'A'},
        {descricao: 'MRV', legenda: 'T'},
        {descricao: 'NUBANK', legenda: 'I'},
        {descricao: 'CVC', legenda: 'X'},
        {descricao: 'ZAG', legenda: 'B'},
        {descricao: 'AURA', legenda: 'C'},
        {descricao: 'MESA e CADEIRA', legenda: 'E'},
        {descricao: 'MESA e CADEIRA', legenda: 'S'},
        {descricao: 'KYW', legenda: 'D'},
        {descricao: 'FOLGA', legenda: '-'},
        {descricao: 'DISPONÍVEL', legenda: '!'}

    ];
    Cliente.insertMany(clientes_ini);
    let cliente = await Cliente.create({descricao: 'FÉRIAS', legenda: '#'});
    ClienteTag.create({descricao: 'FERIAS', cliente});
    cliente = await Cliente.create({descricao: 'LICENÇA', legenda: ';'});
    ClienteTag.create({descricao: 'LICENCA', cliente});
    ClienteTag.create({descricao: 'ATESTADO', cliente});
    ClienteTag.create({descricao: 'MÉDICO', cliente});
    cliente = await Cliente.create({descricao: 'BP', legenda: 'G'});
    ClienteTag.create({descricao: 'BRASIL', cliente});
    ClienteTag.create({descricao: 'BB', cliente});
    ClienteTag.create({descricao: 'PREV', cliente});
}

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

    async formatar(req, res) {
        const alocacoes = await Alocacao.deleteMany({});
        return res.json(alocacoes);
    },
    async store(req, res){
        let dados = req.body;
        let cliente = await salvar(dados);
        return res.json(cliente);
    },
    
    async storetag(req, res){
        let dados = req.body;
        let cliente = await Cliente.findById(dados.cliente);
        cliente = ClienteTag.create({descricao: dados.descricao, cliente});
        return res.json(cliente);
    },

    async indextags(req, res){
        const clientes = await ClienteTag.find({});
        return res.json(clientes);
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
    },

    async inicializar(req, res){
        const clientes = await inicializar();
        return res.send(clientes);
    },

    async formatar(req, res) {
        const cli = await ClienteTag.deleteMany({});
        const cli = await Cliente.deleteMany({});
        return res.json(cli);
    },
};