import Ember from 'ember';

export default Ember.Route.extend({
  actions: {
    didTransition: function() {
      var self = this;
      Ember.run.scheduleOnce('afterRender', this, function() {
        self.controllerFor('search').initHandler();
      });
    }
  }
});
