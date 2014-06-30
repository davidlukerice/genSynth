import Ember from 'ember';
var Network = require('asNEAT/network')['default'];

var numInitialNetworks = 0;
var numInitialMutations = 4;

export default Ember.Route.extend({
  model: function() {
    
    var instrumentParams = [];
    for (var i=0; i<numInitialNetworks; ++i) {
      var instrumentNetwork = new Network();
      for (var x=0; x<numInitialMutations; ++x)
        instrumentNetwork.mutate();
      instrumentParams.push(Ember.Object.create({
        instrumentNetwork: instrumentNetwork,
        isLive: false,
        selected: false
      }));
    }

    return Ember.Object.create({
      instrumentParams: [instrumentParams]
    });
  },

  setupController: function(controller, model) {
    controller.set('content', model);
  },
});
