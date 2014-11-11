import Ember from 'ember';
import config from '../config/environment';
import analytics from 'gen-synth/mixins/analytics-handler';
var asNEAT = require('asNEAT/asNEAT')['default'];

export default Ember.Route.extend(analytics, {

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
    willTransition: function(transition) {
      this.send('analyticsWillTransition', transition);
      asNEAT.resetOutNodes();
    },

    authenticate: function(options) {
      this.get('session').authenticate(
        'simple-auth-authenticator:torii',
        options);
    },

    invalidateSession: function() {
      var self = this;
      Ember.$.ajax({
        url: config.apiUrl+'/auth/logout',
        type: 'GET',
        xhrFields: {
          withCredentials: true
        }
      }).then(function() {
        self.get('session').invalidate();
        self.transitionTo('index').then(function() {
          location.reload();
        });
      });
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
    },

    toggleHelp: function() {
      this.controllerFor('application')
          .send('toggleHelp');
    }
  }
});
