import Ember from 'ember';
var Network = require('asNEAT/network')['default'];

export default Ember.Controller.extend({
  needs: ['application'],

  // set by route
  // {user, instruments: []}

  isCurrentUser: function() {
    var application = this.get('controllers.application');
    return this.get('user.id') ===
      application.get('currentUser.id');
  }.property(
    'user.id',
    'controllers.application.currentUser.id'),

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
      function(instrument, i) {
        return {
          instrumentNetwork: Network.createFromJSON(instrument.get('json')),
          selected: false,
          isLive: i===0,
          index: i,
          instrumentModel: instrument
        };
    });
  }.property('instruments.@each'),

  selectInitialInstrument: function() {
    var instruments = this.get('instrumentParams');
    if (instruments.length > 0)
      this.get('controllers.application')
          .set('activeInstrument', instruments[0]);
  }.observes('instrumentParams.@each'),
});
