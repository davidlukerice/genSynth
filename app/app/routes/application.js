import Ember from 'ember';
//var ApplicationRouteMixin = require('simple-auth/mixins/application-route-mixin').default;

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

  // TODO: ... fix this... really
  //setupEvents: function() {
  //  var self = this;
  //  this.get('session').on('sessionAuthenticationSucceeded', function() {
  //    self.send('sessionAuthenticationSucceeded');
  //  });
  //}.on('init'),

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
      this.get('controller').send('hideLogin');

      //TODO: Create new user here?... and set current user?

      //getUser: function() {
      //  var self = this;
      //  this.store.find('user', '000000000000000000000001').then(function(user) {
      //    if (user) {
      //      self.set('currentUser', users);
      //    } else {
      //      createNewUser();
      //    }
      //  }, function() {
      //    createNewUser();
      //  });
      //
      //  function createNewUser() {
      //    var user = self.store.createRecord('user', {
      //      id: '000000000000000000000001',
      //      email: 'me@email.com',
      //      username: 'testUser',
      //      created: Date.now()
      //    });
      //    user.save(function(user) {
      //      self.set('currentUser', user);
      //    });
      //  }
      //}.on('init'),

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