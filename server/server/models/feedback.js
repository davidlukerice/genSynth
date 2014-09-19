/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  ObjectId = Schema.ObjectId;

var FeedbackSchema = new Schema({
    created: {
      type: Date,
      default: Date.now,
      index: true
    },
    user: {
      type: ObjectId,
      ref: 'User'
    },
    comment: {
      type: String,
      default: '',
      trim: true
    }
  },
  {
    versionKey: false,
    id: true,
    autoIndex: false
  }
);

mongoose.model('Feedback', FeedbackSchema);

exports.Schema = FeedbackSchema;
