module.exports = function(app, passport, auth) {
  var feedback = require('../controllers/feedback');
  app.post('/feedback', auth.requiresLogin, feedback.create);
};
