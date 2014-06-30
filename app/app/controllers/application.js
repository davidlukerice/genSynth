import Ember from 'ember';

export default Ember.Controller.extend({
  evolvePageIsActive: function() {
    return this.get('currentPath') === 'evolve';
  }.property('currentPath'),
  
  feedbackPageIsActive: function() {
    return this.get('currentPath') === 'feedback';
  }.property('currentPath'),

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
