//var userIsAdmin = require('./admins.js').userIsAdmin;

/**
 * Generic require login routing middleware
 */
exports.requiresLogin = function(req, res, next) {
  if (!req.isAuthenticated()) {
    return res.send(401, 'User is not authorized');
  }
  next();
};

/**
 * User authorizations routing middleware
 */
exports.user = {
  hasAuthorization: function(req, res, next) {
    if (req.profile.id !== req.user.id) {
      return res.send(401, 'User is not authorized');
    }
    next();
  }
};

/**
 * Article authorizations routing middleware
 */
exports.instrument = {
  hasAuthorization: function(req, res, next) {
    if (req.instrument.user.id !== req.user.id) {
      return res.send(401, 'User is not authorized');
    }
    next();
  }
};

