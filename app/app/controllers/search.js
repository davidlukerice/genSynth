import Ember from 'ember';
import InstrumentSorting from 'gen-synth/mixins/instrument-sorting';
var Network = require('asNEAT/network')['default'];

export default Ember.Controller.extend(InstrumentSorting, {
  needs: ['application'],
  queryParams: ['query', 'page', 'sorting'],
  query: null,
  page: 1,
  numInstruments: 0,

  hasSearched: function() {
    return this.get('instruments') !== null;
  }.property('instruments.#each.json'),

  watchQuery: function() {
    this.send('updateSearch');
  }.observes('query', 'page', 'sorting'),

  // called from router
  initHandler: function() {
    var self = this;
    this.clearPagination();
    // query parameters aren't available on init for some reason...
    Ember.run.scheduleOnce('afterRender', this, function() {
      var query = self.get('query');
      if (!query)
        return;
      self.send('updateSearch');
    });
  },

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

  clearPagination: function() {
    this.set('page', 1);
  },

  actions: {
    updateSearch: function() {
      var self = this,
          query = this.get('query'),
          page = this.get('page');
      if (!query)
        return;

      Ember.$.ajax({
        url: 'http://localhost:3000/numInstruments/',
        type: 'GET',
        xhrFields: {
          withCredentials: true
        },
        data: {
          searchQuery: query
        }
      }).then(function(output) {
        self.set('numInstruments', output.numInstruments);
      });
      self.set('instruments', self.store.find('instrument', {
        searchQuery: query,
        page: page
      }));
    },

    changePageHandler: function(page) {
      this.set('page', page);
    }
  }
});
