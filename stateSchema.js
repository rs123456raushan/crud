const mongoose = require('mongoose');
const { Schema } = mongoose;

const stateSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  country: {
    type: String,
    require: true
  },
  countryName: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'country'
  }
});

module.exports = mongoose.model('state', stateSchema);