import Ember from 'ember';
var Network = require('asNEAT/network')['default'];

export default Ember.Controller.extend({
  needs: ['application'],

  // set by route
  // {user, instruments: []}

  updateOnLogin: function() {
    var pageUserId = this.get('user.id'),
        currentUserId = this.get('controllers.application.currentUser.id');
    if (pageUserId === currentUserId) {
      this.set('instruments', this.store.find('instrument', {
        user: pageUserId
      }));
    }
  }.observes('controllers.application.currentUser.id'),

  instrumentParams: function() {
    var instruments = this.get('instruments');
    if (!instruments.toArray)
      return [];

    return _.map(instruments.toArray(),
      function(instrument) {
        return {
          instrumentNetwork: Network.createFromJSON(instrument.get('json')),
          selected: false,
          isLive: false,
          index: 0,
          instrumentModel: instrument
        };
    });
  }.property('instruments.@each')
});
