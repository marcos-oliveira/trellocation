const express = require('express');
const routes = express.Router();

const SemanaController = require("./controllers/SemanaController");
const PessoaController = require("./controllers/PessoaController");
const AlocacaoController = require("./controllers/AlocacaoController");
const ClienteController = require("./controllers/ClienteController");

routes.get('/semanas', SemanaController.index);
routes.get('/semanas/:id', SemanaController.show);

routes.get('/pessoas', PessoaController.index);
routes.get('/pessoas/:id', PessoaController.show);

routes.get('/sincronizarsemanas', SemanaController.sincronizar);
routes.get('/sincronizaralocacoes', PessoaController.sincronizarAlocacoesSemana);
routes.get('/sincronizartodasalocacoes', PessoaController.sincronizarTodasAlocacoes);

routes.get('/alocacoes', AlocacaoController.index);
routes.get('/alocacoessemana', AlocacaoController.alocacoessemana);
routes.get('/alocacoestabela', AlocacaoController.alocacoes);
routes.get('/alocacoestabelanew', AlocacaoController.alocacoesnew);

routes.get('/clientes', ClienteController.index);
routes.post('/clientes/salvar', ClienteController.store);
routes.post('/clientes/salvarlista', ClienteController.save);

routes.post('/resumo', AlocacaoController.resumo);

module.exports = routes;