import Ember from 'ember';
import InstrumentPlayer from 'gen-synth/mixins/instrument-player';
import AuthHandler from 'gen-synth/mixins/auth-handler';

export default Ember.Controller.extend(InstrumentPlayer, AuthHandler, {
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

  showSettings: false,
  showHelp: false,

  actions: {
    toggleHelp: function() {
      this.set('showHelp', !this.get('showHelp'));
    },

    toggleSettings: function() {
      this.set('showSettings', !this.get('showSettings'));
    },

    letUsKnow: function() {
      this.send('toggleHelp');
      this.transitionTo('feedback');
    }
  }
});
