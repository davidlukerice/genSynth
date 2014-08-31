/* jshint node: true */
var AuthProviders = require('./auth-providers');

module.exports = function(environment) {
  var ENV = {
    environment: environment,
    baseURL: '/',
    locationType: 'auto',
    EmberENV: {
      FEATURES: {
      }
    },

    APP: {
    },

    'simple-auth': {
      store: 'simple-auth-session-store:local-storage',
      authorizer: 'authorizer:custom',
      crossOriginWhitelist: AuthProviders.crossOriginWhitelist
    },

    torii: {
      providers: {
        'local-provider': {
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
    ENV.baseURL = '/'; // Testem prefers this...
  }

  if (environment === 'production') {

  }

  return ENV;
};
