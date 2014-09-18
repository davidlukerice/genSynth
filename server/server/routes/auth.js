module.exports = function(app, passport, auth) {
  //User Routes
  var users = require('../controllers/users');

  app.post('/users', users.create, users.succeeded);

  app.get('/users/me', auth.requiresLogin, users.me);
  app.get('/users/:userId', users.show);

  //Finish with setting up the userId param
  app.param('userId', users.user);

  app.get('/auth/logout', users.logout);

  // Setting local route
  app.post('/auth/local', passport.authenticate('local', {}),
    users.succeeded);

  //Setting the facebook oauth routes
  app.get('/auth/facebook', passport.authenticate('facebook-token', {
    scope: ['email']
  }), users.succeeded);
};
