const { Schema, model } = require('mongoose');

const PessoaSchema = new Schema({
  nome: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
});

module.exports = model('Pessoa', PessoaSchema);