const express = require('express');
const routes = express.Router();

const SemanaController = require("../controllers/SemanaController");
const PessoaController = require("../controllers/PessoaController");
const AlocacaoController = require("../controllers/AlocacaoController");
const ClienteController = require("../controllers/ClienteController");
const AlocacaoCargaController = require("../controllers/AlocacaoCargaController");

routes.get('/semanas', SemanaController.index);
routes.get('/semanaspaginada/:page/:limit', SemanaController.indexpaginado);
routes.get('/semanas/:id', SemanaController.show);

routes.get('/pessoas', PessoaController.index);
routes.get('/pessoas/:id', PessoaController.show);
routes.post('/pessoas/formatar', PessoaController.formatar);

routes.get('/sincronizarsemanas', SemanaController.sincronizar);
routes.get('/sincronizaralocacoes', PessoaController.sincronizarAlocacoesSemana);
routes.get('/sincronizartodasalocacoes', PessoaController.sincronizarTodasAlocacoes);
routes.get('/sincronizarcompleto', PessoaController.sincronizarcompleto);
routes.get('/sincronizarpaginaatual/:page/:limit', PessoaController.sincronizarPagina);

routes.get('/alocacoes', AlocacaoController.index);
routes.get('/alocacoessemana', AlocacaoController.alocacoessemana);
routes.get('/alocacoestabela', AlocacaoController.alocacoes);
routes.get('/alocacoestabelanew/:page/:limit', AlocacaoController.alocacoesnew);
routes.get('/alocacoestabelacompleto/:page/:limit', AlocacaoController.alocacoescompleto);

routes.get('/clientes', ClienteController.index);
routes.post('/clientes/salvar', ClienteController.store);
routes.post('/clientes/salvarlista', ClienteController.save);
routes.post('/clientes/inicializar', ClienteController.inicializar);
routes.post('/clientes/formatar', ClienteController.formatar);

routes.post('/clientes/salvartag', ClienteController.storetag);
routes.get('/clientes/indextags', ClienteController.indextags);


routes.get('/carga', AlocacaoCargaController.index);
routes.post('/carga/salvar', AlocacaoCargaController.store);
routes.post('/carga/formatar', AlocacaoCargaController.formatar);

routes.get('/resumo', AlocacaoController.resumo);
routes.post('/formatar', AlocacaoController.formatar);

module.exports = routes;