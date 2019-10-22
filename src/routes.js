const express = require('express');
const routes = express.Router();

const SemanaController = require("./controllers/SemanaController");
const PessoaController = require("./controllers/PessoaController");

routes.get('/semanas', SemanaController.index);
routes.get('/semanas/:id', SemanaController.show);

routes.get('/pessoas', PessoaController.index);
routes.get('/pessoas/:id', PessoaController.show);

routes.get('/teste', SemanaController.sincronizar);

module.exports = routes;