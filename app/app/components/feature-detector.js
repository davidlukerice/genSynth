import Ember from 'ember';
var asNEAT = require('asNEAT/asNEAT')['default'];

export default Ember.Component.extend({

  isShowingDialog: false,
  detectBrowser: function() {
    var supported = asNEAT.context.supported;
    if (!supported)
      this.set('isShowingDialog', true);
    var controller = this.get('targetObject');
    controller.send('updateAnalyticsDimension', 'dimension4', supported);
  }.on('init'),

  actions: {
    close: function() {
      this.set('isShowingDialog', false);
    }
  }
});
