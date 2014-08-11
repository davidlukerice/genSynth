/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Instrument = mongoose.model('Instrument'),
    _ = require('lodash');

/**
 * Find instrument by id
 */
exports.instrument = function(req, res, next, id) {
  Instrument.findOne({
      _id: id
    })
    .populate('user')
    .exec(function(err, instrument) {
      if (err)
        return next(err);
      if (!instrument)
        return next(new Error('Failed to load instrument ' + id));

      req.instrument = instrument;
      next();
    });
};

/**
 * Create a instrument
 */
exports.create = function(req, res) {
  var instrument = new Instrument(req.body.instrument);

  instrument.user = req.user;
  instrument.save(function(err) {
    if (err) {
      res.render('error saving', {
        status: 500
      });
      return;
    }
    Instrument.populate(instrument, {path:'user'}, function(err, instrument) {
      if (err) {
        res.render('error populating', {
          status: 500
        });
        return;
      }
      res.send({
        instrument: toObject(instrument)
      });
    });
  });
};

/**
 * Update a instrument
 */
exports.update = function(req, res) {

  var instrument = req.instrument;

  if (instrument.get('user.id') !== req.user.id) {
    res.render('error: not creator', {
      status: 500
    });
    return;
  }

  instrument.name = req.body.instrument.name;
  instrument.isPrivate = req.body.instrument.isPrivate;
  instrument.likes = req.body.instrument.likes;
  instrument.tags = req.body.instrument.tags;

  instrument.save(function(err) {
    if (err) {
      res.render('error', {
        status: 500
      });
    } else {
      res.send({
        instrument: toObject(instrument)
      });
    }
  });
};

/**
 * Delete an instrument
 */
exports.destroy = function(req, res) {
  var instrument = req.instrument;

  instrument.remove(function(err) {
    if (err) {
      res.render('error', {
        status: 500
      });
    } else {
      res.jsonp(toObject(instrument));
    }
  });
};

/**
 * Show an instrument
 */
exports.show = function(req, res) {
  res.jsonp({
    instrument: toObject(req.instrument)
  });
};

/**
 * List of Instruments
 */
exports.index = function(req, res) {
  Instrument.find(req.query).sort('-created').populate('user', 'name username').exec(function(err, instruments) {
    if (err) {
      res.render('500', {
        status: 500
      });
    } else {
      res.send({
        instruments: toObjects(instruments)
      });
    }
  });
};

function toObjects(arr) {
  var objs = [];
  _.forEach(arr, function(item) {
    objs.push(toObject(item));
  });
  return objs;
}

function toObject(item) {
  var obj = item.toObject({virtuals: true});

  // quick compressing of relationships down to their ids
  // TODO: Sideload
  obj.user = obj.user.id;
  if (obj.likes.length > 0)
    obj.likes = _.map(obj.likes, function(item) {
      return item._id;
    });

  return obj;
}
