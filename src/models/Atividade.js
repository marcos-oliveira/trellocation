const { Schema, model } = require('mongoose');

const AtividadeSchema = new Schema({
  descricao: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
});

module.exports = model('Atividade', AtividadeSchema);
