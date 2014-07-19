var AuthProviders = require('gen-synth/config/auth-providers').default;

// Setup global env variables
window.ENV = window.ENV || {};
window.ENV['simple-auth'] = {
  store: 'simple-auth-session-store:local-storage',
  authorizer: 'authorizer:custom',
  crossOriginWhitelist: ['http://localhost:3000']
};
window.ENV['torii'] = {
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
};

require('torii/load-initializers').default();
require('simple-auth/ember');
require('simple-auth-torii/ember');

export default {
  name: 'authentication',
  before: 'simple-auth',
  initialize: function() {
  }
};