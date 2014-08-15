import Ember from 'ember';
var Network = require('asNEAT/network')['default'];

export default Ember.Controller.extend({
  needs: ['application'],

  // set by route
  // {instruments: []}
  content: null,

  mostStarredInstrumentParams: function() {
    return _.map(this.get('content.mostStarredInstruments').toArray(),
      function(instrument, i) {
        return Ember.Object.create({
          instrumentNetwork: Network.createFromJSON(instrument.get('json')),
          selected: false,
          isLive: i===0,
          index: i,
          instrumentModel: instrument
        });
    });
  }.property('content.mostStarredInstruments.@each'),

  mostBranchedInstrumentParams: function(){
    return _.map(this.get('content.mostBranchedInstruments').toArray(),
      function(instrument, i) {
        return Ember.Object.create({
          instrumentNetwork: Network.createFromJSON(instrument.get('json')),
          selected: false,
          isLive: false,
          index: i,
          instrumentModel: instrument
        });
    });
  }.property('content.mostBranchedInstruments.@each'),

  selectInitialInstrument: function() {
    var instruments = this.get('mostStarredInstrumentParams');
    if (instruments.length > 0)
      this.get('controllers.application')
          .set('activeInstrument', instruments[0]);
  }.observes('mostStarredInstrumentParams.@each'),
});
