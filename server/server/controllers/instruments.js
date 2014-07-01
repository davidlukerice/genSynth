/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    async = require('async'),
    Instrument = mongoose.model('Instrument'),
    _ = require('lodash');

/**
 * Find instrument by id
 */
exports.instrument = function(req, res, next, id) {
  Instrument.load(id, function(err, instrument) {
    if (err) return next(err);
    if (!instrument) return next(new Error('Failed to load instrument ' + id));

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

    var formattedInstrument = {};
    formattedInstrument.instrument = instrument;

    if (err) {
      return res.send('users/signup', {
        errors: err.errors,
        instrument: instrument
      });
    } else {
      res.jsonp(formattedInstrument);
    }
  });
};

/**
 * Update a instrument
 */
exports.update = function(req, res) {

  var instrument = req.instrument;
  instrument.title = req.body.instrument.title;
  instrument.instrumentContent = req.body.instrument.instrumentContent;
  instrument.urlSegment = req.body.instrument.urlSegment;
  instrument.type = req.body.instrument.type;

  instrument.save(function(err) {
    if (err) {
      res.render('error', {
        status: 500
      });
    } else {
      var instrumentObj = {
        instrument: instrument
      };
      res.send({
        instrument: instrument
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
      res.jsonp(instrument);
    }
  });
};

/**
 * Show an instrument
 */
exports.show = function(req, res) {
  res.send({
    instrument: req.instrument
  });
};

/**
 * List of Instruments
 */
exports.index = function(req, res, next) {

  if (!_.isEmpty(req.query))  {

    // req.query is the exact type of object which mongoose can use to query
    //  so we  send it to a querying static method in the model

    Instrument.query(req.query, function(err, instruments) {
      if (err) return next(err);
      if (!instruments)  {
        res.send({error: new Error('Failed to load instrument for query')});
      } else {
        res.send({instruments: [instruments]});    
      }
      
    });
  } else {
    // else we find all
    Instrument.find().sort('-created').populate('user', 'name username').exec(function(err, instruments) {

      if (err) {
        res.render('error', {
          status: 500
        });
      } else {
        res.send({
          instruments: instruments
        });
      }
    });
  }
};
