const { Schema, model } = require('mongoose');

const ClienteTagSchema = new Schema({
  descricao: {
    type: String,
    required: true,
  },
  cliente: {
    type: Schema.Types.ObjectId,
    ref: 'Cliente',
  }
}, {
  timestamps: true,
});

module.exports = model('ClienteTag', ClienteTagSchema);
