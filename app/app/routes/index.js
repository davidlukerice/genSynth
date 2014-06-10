
var Network = require('asNEAT/network')['default'];

var numInitialNetworks = 0;
var numInitialMutations = 4;

export default Ember.Route.extend({
  model: function() {
    
    var networks = [];
    for (var i=0; i<numInitialNetworks; ++i) {
      var network = new Network();
      for (var x=0; x<numInitialMutations; ++x)
        network.mutate();
      networks.push(Ember.Object.create({
        network: network,
        isLive: false,
        selected: false
      }));
    }

    return Ember.Object.create({
      networks: [networks]
    });
  },

  setupController: function(controller, model) {
    controller.set('content', model);
  },
});
