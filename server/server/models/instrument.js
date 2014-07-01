/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  config = require('../config/config'),
  Schema = mongoose.Schema,
  ObjectId = Schema.ObjectId,
  UserSchema = require('./user').Schema;

/**
 * Instrument Schema
 */
var InstrumentSchema = new Schema({
    created: {
      type: Date,
      default: Date.now
    },
    user: {
      type: ObjectId,
      ref: 'User'
    },
    name: {
      type: String,
      default: '',
      trim: true
    },
    branchedParent: {
      type: ObjectId,
      ref: 'Instrument'
    },
    isPrivate: {
      type: Boolean
    },
    likes: [UserSchema],
    tags: [String],
    id: {
      type: ObjectId,
      unique: true,
      trim: true
    }
  },
  {
    versionKey: false,
    id: true
  }
);

/**
 * Validations
 */
 /*
InstrumentSchema.path('title').validate(function(title) {
  return title.length;
}, 'Title cannot be blank');
*/

/**
 * Statics
 */
/*
InstrumentSchema.statics = {
  // Load static finds by id, populates user nested object
  load: function(id, cb) {
    this.findOne({
      _id: id
    }).populate('user', 'name username').exec(cb);
  },
  // query static finds by other query params, populates user nested object
  query: function (query, cb) {
     this.findOne(query).populate('user', 'name username').exec(cb);
  }
};
*/

mongoose.model('Instrument', InstrumentSchema);

exports.Schema = InstrumentSchema;