import Ember from 'ember';

export default Ember.Controller.extend({
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

  actions: {
    showLogin: function() {
      this.set('showLogin', true);
    },
    hideLogin: function() {
      this.set('showLogin', false);
    }
  }
});
