import Ember from 'ember';
var ApplicationRouteMixin = require('simple-auth/mixins/application-route-mixin');

export default Ember.Route.extend(ApplicationRouteMixin, {
  actions: {
    authenticate: function(provider) {
      var controller = this.controller;
      this.get('session').authenticate('authenticator:torii', {
        torii:    this.get('torii'),
        provider: provider
      }).then(null, function(error) {
        console.log('error: '+error);
        controller.set('errorMessage', error);
      });
    }
  }
});