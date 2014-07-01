import Ember from 'ember';

require('torii/load-initializers')['default']();

var simpleAuthSetup = require('simple-auth/setup').default;
var SimpleAuthAuthenticatorsBase = require('simple-auth/authenticators/base').default;
var configuration = require('torii/configuration').default;
var AuthProviders = require('gen-synth/config/auth-providers').default;

//configuration.providers['linked-in-oauth2'] = {
//  apiKey: '772yus6d70pf11',
//  redirectUri: 'http://localhost:8000/example/simple-auth.html'
//};
//configuration.providers['google-oauth2'] = {
//  redirectUri: 'http://localhost:8000/example/simple-auth.html',
//  apiKey:      '139338504777-321kme2daihrj8kr8g739ntne4h2bghk.apps.googleusercontent.com'
//};
configuration.providers['facebook-connect'] = {
  appId: AuthProviders.facebookConnect.appId
};
configuration.providers['facebook-oauth2'] = {
  apiKey: AuthProviders.facebookOAuth2.apiKey,
  redirectUri: AuthProviders.facebookOAuth2.redirectUri
};

var ToriiAuthenticator = SimpleAuthAuthenticatorsBase.extend({
  restore: function(properties) {
    return new Ember.RSVP.Promise(function(resolve, reject) {
      if (!Ember.isEmpty(properties.token)) {
        resolve(properties);
      } else {
        reject();
      }
    });
  },

  authenticate: function(options) {
    return new Ember.RSVP.Promise(function(resolve, reject) {
      options.torii.open(options.provider).then(function(authData) {
        console.log(authData);
        resolve({ token: authData.authorizationCode });
      }, function(error) {
        reject(error);
      });
    });
  },

  invalidate: function() {
    return Ember.RSVP.resolve();
  }
});

export default {
  name: 'authentication',
  //before: 'simple-auth',
  initialize: function(container, application) {
    // register the Torii authenticator so the session can find them
    container.register('authenticator:torii', ToriiAuthenticator);
    simpleAuthSetup(container, application);
  }
};