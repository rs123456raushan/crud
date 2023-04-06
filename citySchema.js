const mongoose = require('mongoose');
const { Schema } = mongoose;

const citySchema = new Schema({
  name: {
    type: String,
    required: true
  },
  state: {
    type: String,
    require: true
  },
  stateName: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'state'
  }
});

module.exports = mongoose.model('city', citySchema);