import Ember from 'ember';
var Network = require('asNEAT/network')['default'];

export default Ember.Controller.extend({
  needs: ['application'],
  queryParams: ['page', 'sorting'],
  page: 1,
  numInstruments: 0,

  // set by route
  // {user, instruments: []}

  watchQuery: function() {
    this.send('updateInstruments');
  }.observes('page', 'sorting'),

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
        return Ember.Object.create({
          instrumentNetwork: Network.createFromJSON(instrument.get('json')),
          selected: false,
          isLive: i===0,
          index: i,
          instrumentModel: instrument
        });
    });
  }.property('instruments.@each'),

  selectInitialInstrument: function() {
    var instruments = this.get('instrumentParams');
    if (instruments.length > 0)
      this.get('controllers.application')
          .set('activeInstrument', instruments[0]);
  }.observes('instrumentParams.@each'),

  clearPagination: function() {
    this.set('page', 1);
  },

  actions: {
    updateInstruments: function() {
      var self = this,
          userId = this.get('user.id'),
          page = this.get('page');

      Ember.$.ajax({
        url: 'http://localhost:3000/numInstruments/',
        type: 'GET',
        xhrFields: {
          withCredentials: true
        },
        data: {
          user: userId
        }
      }).then(function(output) {
        self.set('numInstruments', output.numInstruments);
      });
      this.set('instruments', this.store.find('instrument', {
        user: userId,
        page: page
      }));
    },

    changePageHandler: function(page) {
      this.set('page', page);
      this.send('updateInstruments', false);
    }
  }
});
