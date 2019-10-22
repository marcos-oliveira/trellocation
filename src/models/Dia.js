const { Schema, model } = require('mongoose');

const DiaSchema = new Schema({
  nome: {
    type: String,
    required: true,
  },
  dia: {
    enum: [ "DOM", "SEG", "TER", "QUA", "QUI", "SEX", "SAB", null ]
 },
  data: {
    type: Schema.Types.Date,
    required: true
  },
}, {
  timestamps: true,
});

module.exports = model('Dia', DiaSchema);
