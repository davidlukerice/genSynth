import Ember from 'ember';

export default Ember.Route.extend({

  model: function() {
    return Ember.Object.create({
      mostStarredInstruments: this.store.find('instrument', {
        isPrivate: false,
        sortBy: '-starsCount',
        countLimit: 6
      }),
      mostBranchedInstruments: this.store.find('instrument', {
        isPrivate: false,
        sortBy: '-branchedChildrenCount',
        countLimit: 6
      }),
      latestInstruments: this.store.find('instrument', {
        isPrivate: false,
        sortBy: '-created',
        countLimit: 6
      }),
      randomInstruments: this.store.find('instrument', {
        isRandom: true,
        countLimit: 6
      })
    });
  },

  setupController: function(controller, model) {
    controller.set('content', model);
  }
});
