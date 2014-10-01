import Ember from 'ember';
var asNEAT = require('asNEAT/asNEAT')['default'];

export default Ember.Component.extend({

  isShowingDialog: false,
  detectBrowser: function() {
    if (!asNEAT.context.supported)
      this.set('isShowingDialog', true);
  }.on('init'),

  actions: {
    close: function() {
      this.set('isShowingDialog', false);
    }
  }
});
