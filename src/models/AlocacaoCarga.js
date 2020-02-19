const { Schema, model } = require('mongoose');

const AlocacaoCargaSchema = new Schema({
  pessoa: {
    type: Schema.Types.ObjectId,
    ref: 'Pessoa',
  },
  cliente: {
    type: Schema.Types.ObjectId,
    ref: 'Cliente',
  },
  quantidade: {
    type: Number
  }
}, {
  timestamps: true,
});

module.exports = model('AlocacaoCarga', AlocacaoCargaSchema);
