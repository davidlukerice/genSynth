/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  ObjectId = Schema.ObjectId,
  mongooseRandom = require('mongoose-simple-random');

/**
 * Instrument Schema
 */
var InstrumentSchema = new Schema({
    created: {
      type: Date,
      default: Date.now,
      index: true
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
    json: {
      type: String,
      trim: true
    },
    branchedParent: {
      type: ObjectId,
      ref: 'Instrument'
    },
    branchedGeneration: {
      type: Number,
      default: 0
    },
    branchedChildren: [{
      type: ObjectId,
      ref: 'Instrument'
    }],
    branchedChildrenCount: {
      type: Number,
      default: 0,
      index: true
    },
    isPrivate: {
      type: Boolean,
      default: true
    },
    stars: [{
      type: ObjectId,
      ref: 'User'
    }],
    starsCount: {
      type: Number,
      default: 0,
      index: true
    },
    tags: {
      type: String,
      trim: true,
      default: ''
    }
  },
  {
    versionKey: false,
    id: true,
    autoIndex: false
  }
);

InstrumentSchema.index({
  'starsCount': -1,
  'created': -1
});

InstrumentSchema.index({
  'branchedChildrenCount': -1,
  'created': -1
});

InstrumentSchema.plugin(mongooseRandom);

var model = mongoose.model('Instrument', InstrumentSchema);
model.collection.ensureIndex({
  name: 'text',
  tags: 'text'
}, function(error) {
  if (error)
    console.log(error);
});


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



exports.Schema = InstrumentSchema;
