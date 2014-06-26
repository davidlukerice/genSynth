
export default Ember.Controller.extend({
  evolvePageIsActive: function() {
    return this.get('currentPath') === 'evolve';
  }.property('currentPath'),
  
  feedbackPageIsActive: function() {
    return this.get('currentPath') === 'feedback';
  }.property('currentPath'),
});
