/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Instrument = mongoose.model('Instrument'),
    User = mongoose.model('User'),
    _ = require('lodash');

/**
 * Find instrument by id
 */
exports.instrument = function(req, res, next, id) {
  Instrument.findOne({
      _id: id
    })
    .populate([{path: 'user'}, {path:'stars'}])
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
      res.status(500);
      res.jsonp({
        msg: 'error saving'
      });
      return;
    }
    User.update(
      {_id: req.user.id},
      {$addToSet:{instruments: instrument.id}},
      {},function(err) {
        if (err) {
          res.status(500);
          res.jsonp({
            msg: 'error'
          });
          return;
        }
        Instrument.populate(instrument,
          [{path:'user'}, {path:'stars'}], function(err, instrument) {
          if (err) {
            res.status(500);
            res.jsonp({
              msg: 'error populating'
            });
            return;
          }
          res.send({
            instrument: toObject(instrument)
          });
        });
      }
    );
  });
};

/**
 * Update a instrument
 */
exports.update = function(req, res) {

  var instrument = req.instrument;

  if (instrument.get('user.id') !== req.user.id) {
    res.status(500);
    res.jsonp({
      msg: 'error: Not creator'
    });
    return;
  }

  instrument.name = req.body.instrument.name;
  instrument.isPrivate = req.body.instrument.isPrivate;
  instrument.tags = req.body.instrument.tags;

  instrument.save(function(err) {
    if (err) {
      res.status(500);
      res.jsonp({
        msg: 'error'
      });
    } else {
      res.send({
        instrument: toObject(instrument)
      });
    }
  });
};

exports.star = function(req, res) {
  var instrument = req.instrument;
  var user = req.user;
  Instrument.update(
    {_id:instrument.id},
    {$addToSet:{stars: user.id}},
    {},function(err) {
      if (err) {
        res.status(500);
        res.jsonp({
          msg: 'error'
        });
        return;
      }
      User.update(
        {_id:user.id},
        {$addToSet:{stars: instrument.id}},
        {},function(err) {
          if (err) {
            res.status(500);
            res.jsonp({
              msg: 'error'
            });
          }
          else {
            res.jsonp({
              succeeded: true
            });
          }
        }
      );
    }
  );
};
exports.unstar = function(req, res) {
  var instrument = req.instrument;
  var user = req.user;
  Instrument.update(
    {_id:instrument.id},
    {$pull:{stars: user.id}
    },{},function(err) {
      if (err) {
        res.status(500);
        res.jsonp({
          msg: 'error'
        });
        return;
      }
      User.update(
        {_id:user.id},
        {$pull:{stars:instrument.id}},
        {},function(err) {
          if (err) {
            res.status(500);
            res.jsonp({
              msg: 'error'
            });
          }
          else {
            res.jsonp({
              succeeded: true
            });
          }
        }
      );
    }
  );
};

/**
 * Delete an instrument
 */
exports.destroy = function(req, res) {
  var instrument = req.instrument;

  instrument.remove(function(err) {
    if (err) {
      res.status(500);
      res.jsonp({
        msg: 'error'
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
  if (req.instrument.isPrivate &&
      (!req.user || req.instrument.user.id !== req.user.id))
  {
    res.status(500);
    res.jsonp({
      msg: 'error: instruments is private and not creator'
    });
    return;
  }
  res.jsonp({
    instrument: toObject(req.instrument)
  });
};

/**
 * List of Instruments
 */
exports.index = function(req, res) {
  var currentUserId = req.user ? req.user.id : 0;

  var sortBy = req.query.sortBy;
  if (sortBy) {
    delete req.query.sortBy;
  }
  else
    sortBy = '-created';

  var countLimit = req.query.countLimit;
  if (countLimit) {
    delete req.query.countLimit;
  }

  var query = Instrument.find(req.query)
            .sort(sortBy);

  if (countLimit)
    query = query.limit(countLimit);

  query.populate([{path: 'user'}, {path:'stars'}])
       .exec(function(err, instruments)
  {
    if (err) {
      res.status(500);
      res.jsonp({
        msg: 'error'
      });
    } else {
      instruments = toObjects(instruments);
      instruments = _.filter(instruments, function(instrument) {
        return !instrument.isPrivate ||
               instrument.user === currentUserId;
      });

      res.send({
        instruments: instruments
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
  // TODO: Sideload?
  var stars = _.map(item.stars, function(item) {
    return item.id;
  });

  return {
    id: item.id,
    created: item.created,
    user: item.user.id,
    name: item.name,
    json: item.json,
    branchedParent: item.branchedParent,
    isPrivate: item.isPrivate,
    stars: stars,
    tags: item.tags
  };
}
