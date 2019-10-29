const express = require('express');
const mongoose = require('mongoose');
const requiredir = require('require-dir');
const cors = require('cors');

// Iniciando o app
const app = express();
app.use(express.json());
app.use(cors());

// iniciando o DB
mongoose.connect('mongodb+srv://alocacoes:aloca01@cluster0-sjcrk.mongodb.net/test?retryWrites=true&w=majority', {
  useNewUrlParser: true
});
// mongoose.connect('mongodb://localhost:27017/alocacoes', {useNewUrlParser: true});

requiredir('./src/models');

app.use('/api', require('./src/routes'));

app.listen(3001);