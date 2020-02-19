const client = require ('../trello');

const normalizeFullResponse = (data) => {

    return {
        // id: data.id,
        // name: data.nome,
        // address: {
        //     city: endereco.cidade,
        //     district: endereco.bairro,
        //     state: endereco.estado,
        //     complement: endereco.complemento,
        //     publicPlace: endereco.logradouro,
        //     number: endereco.numero,
        // },
        // imageUrl: data.urlImagem,
        // features: map(data.caracteristicas, (caracteristica) => ({
        //     key: caracteristica.chave,
        //     value: caracteristica.valor,
        // })),
        // unities: map(data.unidades, (unidade) => ({
        //     id: unidade.id,
        //     number: unidade.numero,
        //     price: unidade.valorParcela,
        //     floor: unidade.andar,
        //     block: unidade.bloco,
        //     features: map(unidade.caracteristicas, (caracteristica) => ({
        //         key: caracteristica.chave,
        //         value: caracteristica.valor,
        //     })),
        //     campaigns: map(unidade.campanhas, (campanha) => ({
        //         title: campanha.titulo,
        //     })),
        // })),
    };
};


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
        legenda = legenda.replace('*', '').replace('[', '').replace(']', '');
    }
    return legenda;
}

function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
async function sleep(fn, ...args) {
    await timeout(3000);
    return fn(...args);
}

module.exports = {

  async getBoard(boardId){
    try {
        const url = client.urlTrello('boards', boardId);
        const { data } = await client.get(url);

        return data;
    } catch (err) {
        if (err.response && err.response.status === 404) {
            return null;
        }
        throw err;
    }
},


async getListsFromBoard(boardId){
    try {

        const url = client.urlTrello('boards', boardId, 'lists');
        console.log('sincronizar', url);
        const { data } = await client.get(url);

        return data;
    } catch (err) {
        if (err.response && err.response.status === 404) {
            return null;
        }
        throw err;
    }
},


async getCardsFromList(listId){
    try {
        const url = client.urlTrello('lists', listId, 'cards');
        const { data } = await client.get(url);

        return data;
    } catch (err) {
        if (err.response && err.response.status === 404) {
            return null;
        }
        throw err;
    }
},


async getChecklistFromCard(cardId){
    try {
        const url = client.urlTrello('cards', cardId, 'checklists');
        const { data } = await client.get(url);

        return data;
    } catch (err) {
        if (err.response && err.response.status === 404) {
            return null;
        }
        throw err;
    }
},


async getChecklist(checklistId){
   try {
       const url = client.urlTrello('checklists', checklistId);
       const { data } = await client.get(url);

       return data;
   } catch (err) {
       if (err.response && err.response.status === 404) {
           return null;
       }
       throw err;
   }
},


async getList(listId){
   try {
       const url = client.urlTrello('lists', listId);
       const { data } = await client.get(url);

       return data;
   } catch (err) {
       if (err.response && err.response.status === 404) {
           return null;
       }
       throw err;
   }
},


async getCheckitemsFromChecklist(checklistId){
    try {
        const url = client.urlTrello('checklists', checklistId, 'checkItems');
        const { data } = await client.get(url);

        return data;
    } catch (err) {
        if (err.response && err.response.status === 404) {
            return null;
        }
        throw err;
    }
},


async getActionsFromBoard(boardId) {
    try {
        const url = client.urlTrello('boards', boardId, 'actions');
        const { data } = await client.get(url);

        return data;
    } catch (err) {
        if (err.response && err.response.status === 404) {
            return null;
        }
        throw err;
    }
},


async getAlocations() {
    // const board = await getBoard('538f872d42bdfee638a6b839');
    // console.log(board);
    // console.log("----------------LISTS---------------------");
    const lists = await getListsFromBoard('538f872d42bdfee638a6b839');
    // const actions = await getActionsFromBoard('538f872d42bdfee638a6b839');
    // console.log(actions);
    // console.log(lists);
    let alocacoes = [];
    let semanaslistadas = [];
    // lists.map(async (list) => {
    for (let i = 0; i < 5; i++) {
        let list = lists[i];

        // let listaexistente = await Semana.findOne({ nome: list.name });
        // if (listaexistente) {
        // }else{
        //     let semanacriada = Semana.create({nome: list.name});
        //     console.log('semana criada banco', semanacriada);
        // }

        const cards = await getCardsFromList(list.id);
        // console.log(cards);
        let i = 0;
        for (let index = 0; index < cards.length; index++) {
            const card = cards[index];
            let semana = { titulo: list.name, dias: [] };
            const checklists = await getChecklistFromCard(card.id);
            // console.log(checklists);
            let semanalistada = semanaslistadas.find((element) => {
                return element == list.name;
            });
            if (typeof semanalistada === 'undefined') {
                semanaslistadas.push(list.name);
            }
            for (let j = 0; j < checklists.length; j++) {
                const checklist = checklists[j];

                const checkitems = await getCheckitemsFromChecklist(checklist.id);
                let atividades = [];
                for (let k = 0; k < checkitems.length; k++) {
                    const checkitem = checkitems[k];
                    let atv = tratarTexto(checkitem.name);
                    atividades.push(atv);
                }

                semana.dias.push({ dia: checklist.name, atividades });
            }
            let alocacao = alocacoes.find((element) => {
                return element.nome == [card.name];
            });
            if (alocacao == null) {
                alocacao = { nome: card.name, semanas: new Array() };
                alocacoes.push(alocacao);
                console.log('nao existe essa alocação'+alocacao.nome);
            }else{
                console.log('já existe essa alocação'+alocacao.nome);
            }
            alocacao.semanas.push(semana);
            // await timeout(10000);
            // console.log('semanasafterpush'+alocacao.nome,alocacoes);
        }
    }
    // });
    let dados = { alocacoes, semanaslistadas };
    return dados;
}
};


