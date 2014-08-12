import Ember from 'ember';

export default Ember.Route.extend({

  model: function() {
    return Ember.Object.create({
      instruments: this.store.find('instrument', {
        isPrivate: false,
        sortBy: '-stars',
        countLimit: 9
      })
    });
  },

  setupController: function(controller, model) {
    controller.set('content', model);
  }
});
