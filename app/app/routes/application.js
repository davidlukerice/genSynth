import Ember from 'ember';
var ApplicationRouteMixin = require('simple-auth/mixins/application-route-mixin');

export default Ember.Route.extend(ApplicationRouteMixin, {
  actions: {
    authenticate: function(provider) {
      var controller = this.controller;
      this.get('session').authenticate('authenticator:torii', {
        torii: this.get('torii'),
        provider: provider
      }).then(null, function(error) {
        console.log('error: '+error);
        controller.set('errorMessage', error);
      });
    },

    createUser: function() {

    },

    invalidateSession: function() {
      this.get('session').invalidate();
    },

    sessionAuthenticationSucceeded: function(){
      console.log('sessionAuthenticationSucceeded: route');
    },

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