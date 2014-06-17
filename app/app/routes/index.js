
var Network = require('asNEAT/network')['default'];


export default Ember.Route.extend({
  model: function() {

    return Ember.Object.create({
      networks: []
    });
  },

  setupController: function(controller, model) {
    controller.set('content', model);
  },
});
