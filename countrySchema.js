const mongoose = require('mongoose');
const { Schema } = mongoose;

const countrySchema = new Schema({
  name: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('country', countrySchema);