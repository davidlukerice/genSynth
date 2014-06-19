var mongoose = require('mongoose'),
    User = require('');

var schema = new mongoose.Schema({
  user: String,
  json: String,
  created: Date,
  branchedParent: String,
  isPrivate: Boolean,
  likes: [User],
  tags: String
});
schema.virtual('id').get(function() {
  return this._id;
});

var model = mongoose.model('Instrument', schema);

module.exports = model;