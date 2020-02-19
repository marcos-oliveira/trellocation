const config = require("config");const express = require('express');
const mongoose = require('mongoose');
const requiredir = require('require-dir');
const cors = require('cors');
const authmiddleware = require('./src/middleware/auth');

// Iniciando o app
const app = express();
app.use(express.json());
app.use(cors());


//use config module to get the privatekey, if no private key set, end the application
if (!config.get("myprivatekey")) {
    console.error("FATAL ERROR: myprivatekey is not defined.");
    process.exit(1);
  }

// iniciando o DB
// mongoose.connect('mongodb+srv://alocacoes:aloca01@cluster0-sjcrk.mongodb.net/test?retryWrites=true&w=majority', {
//   useNewUrlParser: true
// });
// let bok = mongoose.connect('mongodb://alocacoesd3:alocacoes123@mongo_alocacoesd3:27017/alocacoesd3', {useNewUrlParser: true, useFindAndModify: true});
// console.log('mongodb', bok)
mongoose.connect('mongodb://localhost:27017/alocacoes', {useNewUrlParser: true, useFindAndModify: true});

requiredir('./src/models');

app.use('/api/users', require('./src/routes/user.routes'));
app.use('/api', authmiddleware, require('./src/routes/routes'));

// app.listen(3000);
app.listen(3001);