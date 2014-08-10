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

  currentUser: null,

  showingLogin: false,

  showSettings: false,
  showHelp: false,

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
