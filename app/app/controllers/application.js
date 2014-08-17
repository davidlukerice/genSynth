import Ember from 'ember';
import InstrumentPlayer from 'gen-synth/mixins/instrument-player';

export default Ember.Controller.extend(InstrumentPlayer, {
  evolvePageIsActive: function() {
    return this.get('currentPath') === 'evolve';
  }.property('currentPath'),

  feedbackPageIsActive: function() {
    return this.get('currentPath') === 'feedback';
  }.property('currentPath'),

  userPageIsActive: function() {
    return this.get('currentPath') === 'user';
  }.property('currentPath'),

  findPageIsActive: function() {
    return this.get('currentPath') === 'find';
  }.property('currentPath'),

  currentUser: null,

  showingLogin: false,

  showSettings: false,
  showHelp: false,

  loadCurrentUser: function() {
    if (!this.get('session.isAuthenticated'))
      return;

    var self = this,
        sessionContent = this.get('session.content'),
        accessToken = sessionContent.accessToken;

    // TODO: Get actual token when reloading page

    //var provider = sessionContent.provider;
    //var userId = sessionContent.userId;
    console.log('content: '+JSON.stringify(sessionContent));
    Ember.$.ajax({
      url: 'http://localhost:3000/auth/facebook',
      type: 'GET',
      data: {
        access_token: accessToken
      },
      //crossDomain: true,
      xhrFields: {
        withCredentials: true
      }
    }).then(function(response) {
      console.log('loginResponse: '+JSON.stringify(response));
      self.store.find('user', response.user).then(function(user) {
        self.set('currentUser', user);
      });
    }, function(xhr, status, error) {
      console.log('error: '+error.message);
      self.send('invalidateSession');
    });
  }.observes('session.isAuthenticated').on('init'),

  actions: {
    showLogin: function() {
      this.set('showLogin', true);
    },
    hideLogin: function() {
      this.set('showLogin', false);
    },

    toggleHelp: function() {
      this.set('showHelp', !this.get('showHelp'));
    },

    toggleSettings: function() {
      this.set('showSettings', !this.get('showSettings'));
    }
  }
});
