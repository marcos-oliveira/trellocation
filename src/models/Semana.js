const { Schema, model } = require('mongoose');

const SemanaSchema = new Schema({
  id: {
    type: String,
    required: true,
  },
  nome: {
    type: String,
    required: true,
  },
  inicio: {
    type: Schema.Types.Date
  },
  fim: {
    type: Schema.Types.Date
  }
}, {
  timestamps: true,
});

module.exports = model('Semana', SemanaSchema);
