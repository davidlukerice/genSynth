import Ember from 'ember';

export default Ember.Route.extend({

  model: function(params) {
    return this.store.find('instrument', params.instrument_id);
  },

  setupController: function(controller, model) {
    controller.set('instrument', model);
  },

  actions: {
    didTransition: function() {
      var self = this;
      Ember.run.scheduleOnce('afterRender', this, function() {
        self.controllerFor('instrument').notifyPropertyChange('isPublished');
      });
    }
  }
});
