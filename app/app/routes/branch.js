import Ember from 'ember';
var Network = require('asNEAT/network')['default'];

export default Ember.Route.extend({
  controllerName : 'evolve',

  model: function(params) {
    return this.store.find('instrument', params.instrument_id);
  },

  setupController: function(controller, model) {
    var parentInstrument = Network.createFromJSON(model.get('json'));
    controller.set('content', Ember.Object.create({
      instrumentParams: [[
        Ember.Object.create({
          instrumentNetwork: parentInstrument,
          isLive: false,
          selected: false,
          instrumentModel: model
        })
      ]]
    }));
    controller.set('branchedParent', model);
  },

  renderTemplate: function() {
    this.render('evolve');
  }
});
