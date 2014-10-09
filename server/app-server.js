/**
 * Module dependencies.
 */
var express = require('express'),
    fs = require('fs'),
    path = require('path');;

/**
 * Main application entry file.
 * Please note that the order of loading is important.
 */

//Load configurations
//if test env, load example file
var env = process.env.NODE_ENV = process.env.NODE_ENV || 'development',
    config = require('./server/config/config'),
    port = process.env.PORT || config['appPort-http'],
    secureAppPort = config['appPort-https'];

var app = express();

app.set('showStackError', env !== 'production');
app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', config.accessControlAllowOrigin);
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});

app.use(express.static(path.join(__dirname, 'appDist')));

if (env === 'production') {
  var forceSSL = require('express-force-ssl'),
      http = require('http'),
      https = require('https'),
      ssl_options = {
        key: fs.readFileSync(config.key),
        cert: fs.readFileSync(config.cert)
      };

  var server = http.createServer(app);
  var secureServer = https.createServer(ssl_options, app);

  app.use(forceSSL);
  app.use(app.router);

  secureServer.listen(secureAppPort);
  server.listen(port);
  console.log('Express production app started on ' + port);
}
else {
  //Start the app by listening on <port>
  app.listen(port);
  console.log('Express app started on port ' + port);
}

//expose app
exports = module.exports = app;
