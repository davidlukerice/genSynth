import Ember from 'ember';

require('torii/load-initializers')['default']();

var simpleAuthSetup = require('simple-auth/setup').default;
var SimpleAuthAuthenticatorsBase = require('simple-auth/authenticators/base').default;
var SimpleAuthAuthorizersBase = require('simple-auth/authorizers/base').default;
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
  appId: AuthProviders.facebookConnect.appId,
  scope: 'email'
};
//configuration.providers['facebook-oauth2'] = {
//  apiKey: AuthProviders.facebookOAuth2.apiKey,
//  redirectUri: AuthProviders.facebookOAuth2.redirectUri
//};

var ToriiAuthenticator = SimpleAuthAuthenticatorsBase.extend({
  restore: function(properties) {
    console.log('ToriiAuthenticator restore');
    return new Ember.RSVP.Promise(function(resolve, reject) {
      if (!Ember.isEmpty(properties.token)) {
        resolve(properties);
      } else {
        reject();
      }
    });
  },

  authenticate: function(options) {
    console.log('ToriiAuthenticator authenticate');
    return new Ember.RSVP.Promise(function(resolve, reject) {
      options.torii.open(options.provider).then(function(authData) {
        console.log(authData);
        resolve({
          id: authData.userId,
          token: authData.accessToken
          //token: authData.authorizationCode
        });
      }, function(error) {
        reject(error);
      });
    });
  },

  invalidate: function() {
    console.log('ToriiAuthenticator Invalidate');
    return Ember.RSVP.resolve();
  }
});

// Setup global env variables
window.ENV = window.ENV || {};
window.ENV['simple-auth'] = {
  store: 'simple-auth-session-store:local-storage',
  authorizer: 'authorizer:custom',
  crossOriginWhitelist: ['http://localhost:3000']
};

var CustomAuthorizer = SimpleAuthAuthorizersBase.extend({
  authorize: function(jqXHR, requestOptions) {
    console.log('CustomAuthorizer: authorize: '+requestOptions);
    if (this.get('session.isAuthenticated') && !Ember.isEmpty(this.get('session.token'))) {
      jqXHR.setRequestHeader('Authorization', 'Token: ' + this.get('session.token'));
    }
  }
});

//'/auth/facebook'
export default {
  name: 'authentication',
  //before: 'simple-auth',
  initialize: function(container, application) {
    // register the Torii authenticator so the session can find them
    container.register('authenticator:torii', ToriiAuthenticator);
    container.register('authorizer:custom', CustomAuthorizer);

    simpleAuthSetup(container, application);
  }
};