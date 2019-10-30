const { Schema, model } = require('mongoose');

const AlocacaoSchema = new Schema({
  dia: {
    type: Schema.Types.Date
  },
  diasemana: {
    type: Schema.Types.String
  },
  pessoa: {
    type: Schema.Types.ObjectId,
    ref: 'Pessoa',
  },
  semana: {
    type: Schema.Types.ObjectId,
    ref: 'Semana',
  },
  cliente: {
    type: Schema.Types.ObjectId,
    ref: 'Cliente',
  },
  atividades: [{
      type: String
    }
  ],
}, {
  timestamps: true,
});

module.exports = model('Alocacao', AlocacaoSchema);
