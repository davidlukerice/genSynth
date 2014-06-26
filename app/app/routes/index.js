
export default Ember.Route.extend({
  model: function() {
    return Ember.Object.create({
      instruments: this.store.findAll('instrument')
    });
  },

  setupController: function(controller, model) {
    controller.set('content', model);
  }
});
