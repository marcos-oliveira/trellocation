const { Schema, model } = require('mongoose');

const AlocacaoSchema = new Schema({
  dia: [{
    type: Schema.Types.ObjectId,
    ref: 'Dia',
  }],
  pessoa: [{
    type: Schema.Types.ObjectId,
    ref: 'Pessoa',
  }],
  atividade: [{
    type: Schema.Types.ObjectId,
    ref: 'Atividade',
  }],
}, {
  timestamps: true,
});

module.exports = model('Alocacao', AlocacaoSchema);
