/**
 * Module dependencies.
 */
var express = require('express'),
    fs = require('fs'),
    passport = require('passport');

/**
 * Main application entry file.
 * Please note that the order of loading is important.
 */

//Load configurations
//if test env, load example file
var env = process.env.NODE_ENV = process.env.NODE_ENV || 'development',
    config = require('./server/config/config'),
    auth = require('./server/config/middlewares/authorization'),
    mongoose = require('mongoose');

//Bootstrap db connection
var db = mongoose.connect(config.db);

var walk = function(path, handler) {
  fs.readdirSync(path).forEach(function(file) {
    var newPath = path + '/' + file;
    var stat = fs.statSync(newPath);
    if (stat.isFile()) {
      if (/(.*)\.(js|coffee)$/.test(file)) {
        handler(newPath);
      }
    } else if (stat.isDirectory()) {
      walk(newPath);
    }
  });
};

//Bootstrap models
var models_path = __dirname + '/server/models';
walk(models_path, function(path) {
  require(path);
});

//bootstrap passport config
require('./server/config/passport')(passport);

var app = express();
//express settings
require('./server/config/express')(app, passport, db);

//Bootstrap routes
var routes_path = __dirname + '/server/routes';
walk(routes_path, function(path) {
  require(path)(app, passport, auth);
});

var port = process.env.PORT || config.apiPort;

if (env === 'production') {
  var https = require('https');
  var ssl_options = {
    key: fs.readFileSync(config.key),
    cert: fs.readFileSync(config.cert)
  };
  var secureServer = https.createServer(ssl_options, app);
  secureServer.listen(port);
  console.log('GenSynth API Prod started on ' + port);
}
else {
  app.listen(port);
  console.log('GenSynth API Dev started on port ' + port);
}

//expose app
exports = module.exports = app;
