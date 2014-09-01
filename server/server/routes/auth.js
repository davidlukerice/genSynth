module.exports = function(app, passport) {
  //User Routes
  var users = require('../controllers/users');

  app.post('/users', users.create, users.succeeded);

  app.post('/users/session', passport.authenticate('local', {}),
    users.succeeded);

  //app.get('/users/me', users.me);
  app.get('/users/:userId', users.show);

  //Finish with setting up the userId param
  app.param('userId', users.user);

  app.get('/auth/logout', users.logout);

  //Setting the facebook oauth routes
  app.get('/auth/facebook', passport.authenticate('facebook-token', {
    scope: ['email']
  }), users.succeeded);
};
