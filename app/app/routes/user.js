import Ember from 'ember';

export default Ember.Route.extend({

  model: function(params) {
    return Ember.Object.create({
      instruments: this.store.find('instrument', {user: params.user_id})
    });
  },

  setupController: function(controller, model) {
    controller.set('content', model);
  }
});
