var mongoose = require('mongoose');

var schema = new mongoose.Schema({
  userId: String,
  json: String,
  created: Date
});
schema.virtual('id').get(function() {
  return this._id;
});

var model = mongoose.model('Instrument', schema);

module.exports = model;