const { Schema, model } = require('mongoose');

const ClienteSchema = new Schema({
  descricao: {
    type: String,
    required: true,
  },
  cor: {
    type: String,
    default: '#FFF',
    required: true,
  },
  legenda: {
    type: String,
  },
}, {
  timestamps: true,
});

module.exports = model('Cliente', ClienteSchema);
