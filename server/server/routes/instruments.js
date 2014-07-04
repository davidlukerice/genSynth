module.exports = function(app, passport, auth) {
  //Instrument Routes
  var instruments = require('../controllers/instruments');
  app.get('/instruments', instruments.index);
  // app.post('/instruments', auth.requiresLogin, instruments.create);
  
  app.post('/instruments', auth.requiresLogin, auth.instrument.hasAuthorization, instruments.create);
  
  app.get('/instruments/:instrumentId', instruments.show);
  // app.put('/instruments/:instrumentId', auth.requiresLogin, auth.instrument.hasAuthorization, instruments.update);
  // app.del('/instruments/:instrumentId', auth.requiresLogin, auth.instrument.hasAuthorization, instruments.destroy);

  app.put('/instruments/:instrumentId', instruments.update);
  app.del('/instruments/:instrumentId', auth.requiresLogin, auth.instrument.hasAuthorization, instruments.destroy);

  //Finish with setting up the instrumentId param
  app.param('instrumentId', instruments.instrument);
};