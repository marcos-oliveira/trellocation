const { Schema, model } = require('mongoose');

const ClienteSchema = new Schema({
  descricao: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
});

module.exports = model('Cliente', ClienteSchema);
