import Ember from 'ember';

export default Ember.Route.extend({

  model: function(params) {
    return Ember.Object.create({
      user: this.store.find('user', params.user_id),
      instruments: this.store.find('instrument', {user: params.user_id})
    });
  },

  setupController: function(controller, model) {
    controller.set('user', model.get('user'));
    controller.set('instruments', model.get('instruments'));
  }
});
