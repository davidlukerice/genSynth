/**
 * Module dependencies.
 */
var session = require('express-session'),
    compression = require('compression'),
    morgan = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override'),
    mongoStore = require('connect-mongo')(session),
    helpers = require('view-helpers'),
    config = require('./config');

module.exports = function(app, passport, db) {
  app.set('showStackError', true);

  //Should be placed before express.static
  app.use(compression({
    filter: function(req, res) {
      return (/json|text|javascript|css/).test(res.getHeader('Content-Type'));
    },
    level: 9
  }));

  //Don't use logger for test env
  if (process.env.NODE_ENV !== 'test') {
    app.use(morgan('dev'));
  }

  //Set views path, template engine and default layout
  app.set('views', config.root + '/server/views');
  app.engine('html', require('hbs').__express);
  app.set('view engine', 'html');

  //Enable jsonp
  app.enable("jsonp callback");

  //cookieParser should be above session
  app.use(cookieParser());

  app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', config.accessControlAllowOrigin);
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
  });

  //bodyParser should be above methodOverride
  app.use(bodyParser());
  app.use(methodOverride());

  //express/mongo session storage
  app.use(session({
    secret: config.session,
    store: new mongoStore({
      db: db.connection.db,
      collection: 'sessions'
    })
  }));

  //dynamic helpers
  app.use(helpers(config.app.name));

  //use passport session
  app.use(passport.initialize());
  app.use(passport.session());
};
