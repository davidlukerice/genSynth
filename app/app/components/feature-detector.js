import Ember from 'ember';

export default Ember.Component.extend({

  isShowingDialog: true,
  detectBrowser: function() {
    // TODO
    this.set('isShowingDialog', true);
  }.on('init'),

  actions: {
    close: function() {
      this.set('isShowingDialog', false);
    }
  }
});
