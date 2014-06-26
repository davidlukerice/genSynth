var mongoose = require('mongoose'),
    Instrument = require('./instrument');

var schema = new mongoose.Schema({
  authUserId: String,
  instruments: [Instrument.Schema],
  likes: [Instrument.Schema],
  created: Date
});

var model = mongoose.model('User', schema);

module.exports.Schema = schema;
module.exports.Model = model;