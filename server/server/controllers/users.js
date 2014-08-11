/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    User = mongoose.model('User'),
    _ = require('lodash');

/**
 * Auth callback
 */
exports.authCallback = function(req, res) {
  res.redirect('/');
};

/**
 * Logout
 */
exports.logout = function(req, res) {
  req.logout();
  req.session.destroy();
  res.jsonp({
    succeeded: true
  });
};

/**
 * Session
 */
exports.session = function(req, res) {
  res.redirect('/');
};

/**
 * Create user
 */
exports.create = function(req, res) {
  var user = new User(req.body);

  user.provider = 'local';
  user.save(function(err) {
    if (err) {
      console.log('the error');
      console.log(err);
      return res.render('users/signup', {
        errors: err.errors,
        user: user
      });
    }
    req.logIn(user, function(err, next) {
      if (err) return next(err);
      return res.redirect('/');
    });
  });
};

/**
 *  Show profile
 */
exports.show = function(req, res) {
  var user = req.profile;
  res.jsonp({
    user: user
  });
};

/**
 * Send User
 */
exports.me = function(req, res) {
  res.jsonp(req.user || null);
};

/**
 * Find user by id
 */
exports.user = function(req, res, next, id) {
  User
    .findOne({
      _id: id
    })
    .populate([{path:'instruments'}, {path:'stars'}])
    .exec(function(err, user) {
      if (err) return next(err);
      if (!user) return next(new Error('Failed to load User ' + id));
      req.profile = toObject(user);
      next();
    });
};

exports.succeeded = function(req, res) {
  res.jsonp({
    succeeded: true,
    user: req.session.passport.user
  });
};

//function toObjects(arr) {
//  var objs = [];
//  _.forEach(arr, function(item) {
//    objs.push(toObject(item));
//  });
//  return objs;
//}

function toObject(obj) {
  // TODO: Sideload?

  var stars = _.map(obj.stars, function(item) {
    return item.id;
  });
  var instruments = _.map(obj.instruments, function(item) {
    return item.id;
  });

  // Only expose certain parameters
  return {
    id: obj.id,
    username: obj.username,
    created: obj.created,
    stars: stars,
    instruments: instruments
  };
}

exports.toObject = toObject;
