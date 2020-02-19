const { Schema, model } = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');

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

SemanaSchema.plugin(mongoosePaginate);
module.exports = model('Semana', SemanaSchema);
