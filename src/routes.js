const express = require('express');
const routes = express.Router();

const SemanaController = require("./controllers/SemanaController");
const PessoaController = require("./controllers/PessoaController");
const AlocacaoController = require("./controllers/AlocacaoController");

routes.get('/semanas', SemanaController.index);
routes.get('/semanas/:id', SemanaController.show);

routes.get('/pessoas', PessoaController.index);
routes.get('/pessoas/:id', PessoaController.show);

routes.get('/sincronizarsemanas', SemanaController.sincronizar);
routes.get('/sincronizaralocacoes', PessoaController.sincronizarAlocacoesSemana);

routes.get('/alocacoes', AlocacaoController.index);
routes.get('/alocacoestabela', AlocacaoController.alocacoes);

module.exports = routes;