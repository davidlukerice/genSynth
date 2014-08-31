import Ember from 'ember';

// Can hold a current midi input
export default Ember.Mixin.create({
  showingLogin: false,

  loginEmail: "",
  loginPassword: "",

  createEmail: "",
  createPassword: "",
  createConfirmPassword: "",

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

    login: function() {
      this.send("authenticate", {
          provider: "local-provider",
          email: this.get('loginEmail'),
          password: this.get('loginPassword')
        });
    },

    createAccount: function() {
      // TODO
    }
  }
});
