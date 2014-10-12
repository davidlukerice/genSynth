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
  var https = require('https'),
      ssl_options = {
        key: fs.readFileSync(config.key),
        cert: fs.readFileSync(config.cert)
      };

  var secureServer = https.createServer(ssl_options, app);
  secureServer.listen(secureAppPort);

  var forceSsl = function (req, res, next) {
    if (req.headers['x-forwarded-proto'] !== 'https') {
        return res.redirect(['https://', req.get('Host'), req.url].join(''));
    } else {
        next();
    }
  };
  app.use(forceSsl);

  console.log('Express production app started on ' + port);
}
else {
  //Start the app by listening on <port>
  app.listen(port);
  console.log('Express app started on port ' + port);
}

//expose app
exports = module.exports = app;
