import Ember from 'ember';
import InstrumentPlayer from 'gen-synth/mixins/instrument-player';
import AuthHandler from 'gen-synth/mixins/auth-handler';

export default Ember.Controller.extend(InstrumentPlayer, AuthHandler, {
  evolvePageIsActive: function() {
    return this.get('currentPath') === 'evolve' ||
           this.get('currentPath') === 'branch';
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

  hasUnpublishedInstruments: function() {
    var unpublishedCount = this.get('currentUser.unpublishedCount');
    return unpublishedCount > 0;
  }.property('currentUser.unpublishedCount'),

  currentUser: null,

  showSettings: false,
  showHelp: false,

  actions: {
    toggleHelp: function() {
      this.set('showHelp', !this.get('showHelp'));
      if (this.get('showHelp'))
        this.send('analyticsEventWithRoute', 'showHelp', '');
    },

    toggleSettings: function() {
      this.set('showSettings', !this.get('showSettings'));
      if (this.get('showSettings'))
        this.send('analyticsEventWithRoute', 'showSettings', '');
    },

    letUsKnow: function() {
      this.send('toggleHelp');
      this.transitionTo('feedback');
    },

    evolveAnInstrument: function() {
      this.send('toggleHelp');
      this.transitionTo('evolve');
    },

    unpublishedBadge: function() {
      this.send('analyticsEventWithRoute', 'instruments', 'unpublishedBadge');
    }
  }
});
