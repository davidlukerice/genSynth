import Ember from 'ember';

export default Ember.Route.extend({

  model: function(params) {
    return this.store.find('user', params.user_id);
  },

  setupController: function(controller, model) {
    controller.set('user', model);
    controller.set('instruments', this.store.find('instrument', {
      user: model.id
    }));
  }
});
