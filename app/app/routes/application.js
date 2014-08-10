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
      this.get('controller').send('hideLogin');
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
    },

    makeLive: function(instrument) {
      this.controllerFor('application')
          .send('makeLive', instrument);
    }
  }
});
