var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    User = require('./user');

var schema = new Schema({
  user: {type: Schema.ObjectId, res: 'User'},
  json: String,
  created: Date,
  branchedParent: {type: Schema.ObjectId, res: 'Instrument'},
  isPrivate: Boolean,
  likes: [User.Schema],
  tags: String
});

var model = mongoose.model('Instrument', schema);

module.exports.Schema = schema;
module.exports.Model = model;