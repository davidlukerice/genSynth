import Ember from 'ember';

function validateEmail(email) {
  var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}

// Can hold a current midi input
export default Ember.Mixin.create({
  showingLogin: false,

  loginEmail: "",
  loginPassword: "",

  createEmail: "",
  createPassword: "",
  createConfirmPassword: "",
  createAcceptToS: false,
  createError: "",

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

  hasCreateError: function() {
    return this.get('createError') !== '';
  }.property('createError'),

  clear: function() {
    this.set('loginEmail', '');
    this.set('loginPassword', '');
    this.set('createEmail', '');
    this.set('createPassword', '');
    this.set('createConfirmPassword', '');
    this.set('createError', '');
    this.set('createAcceptToS', false);
  },

  actions: {
    captureAction: function() {
    },
    showLogin: function() {
      this.clear();
      this.set('showLogin', true);
    },
    hideLogin: function() {
      this.clear();
      this.set('showLogin', false);
    },

    login: function() {
      this.send("authenticate", {
          provider: "local-provider",
          email: this.get('loginEmail'),
          password: this.get('loginPassword')
        });
    },

    toggleCreateAcceptToS: function() {
      this.set('createAcceptToS', !this.get('createAcceptToS'));
    },

    createAccount: function() {
      var self = this,
          createEmail = this.get('createEmail'),
          createPassword = this.get('createPassword'),
          createConfirmPassword = this.get('createConfirmPassword'),
          createAcceptToS = this.get('createAcceptToS');

      if (!validateEmail(createEmail)) {
        self.set('createError', 'Not a valid Email address');
        return;
      }
      else if (createPassword.length < 5) {
        self.set('createError', 'Passwords must have at least 5 characters');
        return;
      }
      else if (createPassword !== createConfirmPassword) {
        self.set('createError', "Passwords don't match");
        return;
      }
      else if (!createAcceptToS) {
        self.set('createError', "Must accept GenSynth's ToS");
        return;
      }

      Ember.$.ajax({
        url: 'http://localhost:3000/users/',
        type: 'POST',
        data: {
          email: createEmail,
          password: createPassword
        },
        //crossDomain: true,
        xhrFields: {
          withCredentials: true
        }
      }).then(function(response) {
        // TODO:
        // Authenticate with user/pass?
        self.clear();
      }, function(xhr, status, error) {
        console.log('error: '+error.message);
        self.set('createError', 'Error creating account');
      });
    }
  }
});
