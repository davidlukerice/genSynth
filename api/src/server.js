
var express = require('express'),
    mongoose = require('mongoose'),
    colors = require('colors'),
    config = require('../config/expressConfig');

// setting up custom log colors
colors.setTheme({
  startup: 'green',
  shutdown: 'grey',
  succeed: 'green',
  info: 'cyan',
  warn: 'yellow',
  debug: 'magenta',
  error: 'red'
});

var dbClient = new DBClient();
dbClient.testConnection();

// Create the API bindings
console.log('Starting up express server'.startup);
var app = express();

// For all requests, allow wildcard origin
var access = function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', config.AccessControlAllowOrigin);
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
};

app.use(function staticsPlaceholder(req, res, next) {
  return next();
});

app.use(access);
app.use(express.bodyParser());

var fs = require('fs');
// Include all the routes
walk('./src/routes', function(error, file) {
  // require works on a local path, so remove /src/
  file = '.'+file.substring(5);
  require(file).createRoute(app);
});

function walk(dir, action) {
  fs.readdir(dir, function(err, list){
    if (err) return action();
    var i=0;
    list.forEach(function(file) {
      file = dir+'/'+file;
      fs.stat(file, function(err, stat) {
        if (stat && stat.isDirectory())
          walk(file, action);
        else
          action(null, file);
      });
    });
  });
}

module.exports = app;