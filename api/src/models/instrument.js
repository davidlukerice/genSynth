var mongoose = require('mongoose');

var model = mongoose.model('Instrument', {
  userId: String,
  json: String,
  created: Date
});

module.exports = model;