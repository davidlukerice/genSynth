import Ember from 'ember';

export default Ember.Controller.extend({

  needs: ['application'],

  quickFeedbackText: '',
  successMessage: '',

  willDestroy: function() {
    this._super();
    this.set('successMessage', '');
  },

  actions: {
    sendQuickFeedback: function() {
      var self = this,
          feedback = this.get('quickFeedbackText');
      if (feedback.length < 2) {
        return;
      }

      var applicationCtrl = this.get('controllers.application');

      // Check if user is logged in first
      if (!this.get('session').get('isAuthenticated')) {
        applicationCtrl.send('showLogin');
        return;
      }

      Ember.$.ajax({
        url: 'http://localhost:3000/feedback/',
        type: 'POST',
        data: {
          comment: feedback
        },
        //crossDomain: true,
        xhrFields: {
          withCredentials: true
        }
      }).then(function() {
        self.set('quickFeedbackText', '');
        self.set('successMessage', 'Thanks!');
      }, function(xhr, status, error) {
        console.log('error: '+error.message);
      });
    }
  }
});
