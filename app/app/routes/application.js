import Ember from 'ember';

export default Ember.Route.extend({
  
  beforeModel: function() {
    this._super();
    var self = this;
    Ember.A([
      'sessionAuthenticationSucceeded',
      'sessionAuthenticationFailed',
      'sessionInvalidationSucceeded',
      'sessionInvalidationFailed',
      'authorizationFailed'
    ]).forEach(function(event) {
      self.get('session').on(event, function() {
        Array.prototype.unshift.call(arguments, event);
        self.send.apply(self, arguments);
      });
    });
  },

  actions: {
    authenticate: function(provider) {
      this.get('session').authenticate('simple-auth-authenticator:torii', provider);
    },

    createUser: function() {

    },

    invalidateSession: function() {
      this.get('session').invalidate();
    },

    sessionAuthenticationSucceeded: function(){
      console.log('sessionAuthenticationSucceeded: route');
      var controller = this.get('controller');
      controller.send('hideLogin');
      var self = this;
      var sessionContent = this.get('session.content');
      var accessToken = sessionContent.accessToken;
      //var provider = sessionContent.provider;
      //var userId = sessionContent.userId;

      console.log('content: '+JSON.stringify(sessionContent));

      Ember.$.ajax({
        url: 'http://localhost:3000/auth/facebook',
        type: 'GET',
        data: {
          access_token: accessToken
        }
      }).then(function(response) {
        console.log('response: '+JSON.stringify(response));
        self.store.find('user', response.user).then(function(user) {
          controller.set('currentUser', user);
        });
      }, function(xhr, status, error) {
        console.log('error: '+error.message);
      });

    }.on('sessionAuthenticationSucceeded'),

    sessionAuthenticationFailed: function(error) {
      console.log('sessionAuthenticationFailed: route: '+error.message);
    },

    sessionInvalidationSucceeded: function() {
      console.log('sessionInvalidationSucceeded: route');
    },

    sessionInvalidationFailed: function(error) {
      console.log('sessionInvalidationFailed: route: '+error.message);
    },

    authorizationFailed: function() {
      console.log('authorizationFailed: route');
    }
  }
});