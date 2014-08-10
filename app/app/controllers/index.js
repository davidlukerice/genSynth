import Ember from 'ember';
var Network = require('asNEAT/network')['default'];

export default Ember.Controller.extend({
  needs: ['application'],

  // set by route
  // {instruments: []}
  content: null,

  instrumentParams: function() {
    return _.map(this.get('content.instruments').toArray(),
      function(instrument, i) {
        return Ember.Object.create({
          instrumentNetwork: Network.createFromJSON(instrument.get('json')),
          selected: false,
          isLive: i===0,
          index: i,
          instrumentModel: instrument
        });
    });
  }.property('content.instruments.@each'),

  selectInitialInstrument: function() {
    var instruments = this.get('instrumentParams');
    if (instruments.length > 0)
      this.get('controllers.application')
          .set('activeInstrument', instruments[0]);
  }.observes('instrumentParams.@each'),
});
