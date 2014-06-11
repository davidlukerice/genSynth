// dependencies
var fs = require('fs');
var express = require('express');
var routes = require('./routes');
var path = require('path');
var app = express();
var config = require('./oauth.js');
var User = require('./models/user.js');
var mongoose = require('mongoose');
var passport = require('passport');
var auth = require('./authentication.js');

// connect to the database
mongoose.connect('mongodb://localhost/genSynthAuth');

// config
var app = express();

app.configure(function() {
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.logger());
  app.use(express.cookieParser());
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.session({ secret: config.sessionSecret }));
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

// serialize and deserialize
passport.serializeUser(function(user, done) {
  console.log('serializeUser: ' + user._id)
  done(null, user._id);
});
passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user){
    console.log(user)
    if(!err) done(null, user);
    else done(err, null)
  })
});

// routes
app.get('/', routes.index);
app.get('/ping', routes.ping);
app.get('/account', ensureAuthenticated, function(req, res){
  User.findById(req.session.passport.user, function(err, user) {
    if(err)
      console.log(err);
    else
      res.render('account', { user: user});
  });
});

app.get('/auth/facebook',
  passport.authenticate('facebook'),
  function(req, res){

  });
app.get('/auth/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '' }),
  function(req, res) {
    res.redirect('/account');
  });

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

// port
app.listen(5000, function() {
  console.log('server started on port '+5000);
});

// test authentication
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/')
}