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

function validateEmail(email) {
  var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}

/**
 * Create user
 */
exports.create = function(req, res, next) {
  var data = req.body;
  if (!validateEmail(data.email)) {
    res.status(500);
    return res.jsonp({
      msg: 'Not a valid Email address'
    });
  }
  else if (data.password.length < 5) {
    res.status(500);
    return res.jsonp({
      msg: 'Passwords must have at least 5 characters'
    });
  }

  function randInt() {
    return Math.round(Math.random()*10);
  }

  var user = new User(req.body);
  user.provider = 'local';
  user.username = data.email[0]+
                  data.email[data.email.indexOf('@')-1]+
                  randInt()+
                  randInt()+
                  randInt();
  user.save(function(err) {
    if (err) {
      console.log('the error');
      console.log(err);
      res.status(500);
      return res.jsonp({
        msg: 'error creating user'
      });
    }
    next();
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
