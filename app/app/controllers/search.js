import Ember from 'ember';
var Network = require('asNEAT/network')['default'];

export default Ember.Controller.extend({
  needs: ['application'],
  queryParams: ['query'],
  query: null,

  hasSearched: function() {
    return this.get('instruments') !== null;
  }.property('instruments.#each.json'),

  initHandler: function() {
    var self = this;
    // query parameters aren't available on init for some reason...
    Ember.run.scheduleOnce('afterRender', this, function() {
      var query = self.get('query');
      if (!query)
        return;
      self.send('updateSearch');
    });
  }.on('init'),

  instruments: null,

  instrumentParams: function() {
    return _.map(this.get('instruments').toArray(),
      function(instrument, i) {
        return Ember.Object.create({
          instrumentNetwork: Network.createFromJSON(instrument.get('json')),
          selected: false,
          isLive: i===0,
          index: i,
          instrumentModel: instrument
        });
    });
  }.property('instruments.@each.json'),

  selectInitialInstrument: function() {
    var instruments = this.get('instrumentParams');
    if (instruments.length > 0)
      this.get('controllers.application')
          .set('activeInstrument', instruments[0]);
  }.observes('instrumentParams.@each'),

  actions: {
    updateSearch: function() {
      var query = this.get('query');
      if (!query)
        return;
      var instruments = this.store.find('instrument', {
        searchQuery: this.get('query')
      });
      this.set('instruments', instruments);
    }
  }
});
