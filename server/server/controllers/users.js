/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    User = mongoose.model('User');

/**
 * Auth callback
 */
exports.authCallback = function(req, res) {
  res.redirect('/');
};

/**
 * Show login form
 */
exports.signin = function(req, res) {
  res.render('users/signin', {
    title: 'Signin',
    message: req.flash('error')
  });
};

/**
 * Show sign up form
 */
exports.signup = function(req, res) {
  res.render('users/signup', {
    title: 'Sign up',
    user: new User()
  });
};

/**
 * Logout
 */
exports.signout = function(req, res) {
  req.logout();
  res.redirect('/');
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
  // Only expose certain parameters
  return {
    id: obj._id,
    username: obj.username,
    created: obj.created,
    likes: obj.likes,
    instruments: obj.instruments
  };
}