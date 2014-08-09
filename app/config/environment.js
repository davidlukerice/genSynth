/* jshint node: true */
var AuthProviders = require('./auth-providers');

module.exports = function(environment) {
  var ENV = {
    environment: environment,
    baseURL: '/',
    locationType: 'auto',
    EmberENV: {
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. 'with-controller': true
      }
    },

    APP: {
      // Here you can pass flags/options to your application instance
      // when it is created
    },

    'simple-auth': {
      store: 'simple-auth-session-store:local-storage',
      authorizer: 'authorizer:custom',
      crossOriginWhitelist: ['http://localhost:3000']
    },

    torii: {
      providers: {
        //'linked-in-oauth2': {
        //  apiKey: '772yus6d70pf11',
        //  redirectUri: 'http://localhost:8000/example/simple-auth.html'
        //},
        //'google-oauth2': {
        //  redirectUri: 'http://localhost:8000/example/simple-auth.html',
        //  apiKey:      '139338504777-321kme2daihrj8kr8g739ntne4h2bghk.apps.googleusercontent.com'
        //},
        'facebook-oauth2': {
          apiKey: AuthProviders.facebookOAuth2.apiKey,
          redirectUri: AuthProviders.facebookOAuth2.redirectUri
        },
        'facebook-connect': {
          appId: AuthProviders.facebookConnect.appId,
          scope: 'email'
        }
      }
    }
  };

  if (environment === 'development') {
    // ENV.APP.LOG_RESOLVER = true;
    ENV.APP.LOG_ACTIVE_GENERATION = true;
    // ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    ENV.APP.LOG_VIEW_LOOKUPS = true;
  }

  if (environment === 'test') {

  }

  if (environment === 'production') {

  }

  return ENV;
};
