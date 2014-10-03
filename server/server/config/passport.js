var mongoose = require('mongoose'),
    LocalStrategy = require('passport-local').Strategy,
    FacebookTokenStrategy = require('passport-facebook-token').Strategy,
    User = mongoose.model('User'),
    config = require('./config');

module.exports = function(passport) {
  //Serialize sessions
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    User.findOne({
      _id: id
    }, function(err, user) {
      done(err, user);
    });
  });

  //Use local strategy
  passport.use(new LocalStrategy({
      usernameField: 'email',
      passwordField: 'password'
    },
    function(email, password, done) {
      User.findOne({
        email: email
      }, function(err, user) {
        if (err) {
          return done(err);
        }
        if (!user) {
          return done(null, false, {
            message: 'Unknown user'
          });
        }
        if (!user.authenticate(password)) {
          return done(null, false, {
            message: 'Invalid password'
          });
        }
        return done(null, user);
      });
    }
  ));

  //Use facebook strategy
  passport.use(new FacebookTokenStrategy({
      clientID: config.facebook.clientID,
      clientSecret: config.facebook.clientSecret
    },
    function(accessToken, refreshToken, profile, done) {
      User.findOne({
        'facebook.id': profile.id
      }, function(err, user) {
        if (err) {
          return done(err);
        }
        if (!user) {
          user = new User({
            name: profile.displayName,
            email: profile.emails[0].value,
            username: profile.name.givenName[0] +
                      profile.name.familyName[0] +
                      profile.id.substr(-3),
            provider: 'facebook',
            facebook: {
              email: profile._json.email,
              id: profile._json.id,
              link: profile._json.link,
              updated_time: profile._json.updated_time,
              verified: profile._json.verified
            }
          });
          user.save(function(err) {
            if (err) console.log(err);
            return done(err, user);
          });
        } else {
          return done(err, user);
        }
      });
    }
  ));
};
