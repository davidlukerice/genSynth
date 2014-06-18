
var Utils = require('asNEAT/utils')['default'],
    Network = require('asNEAT/network')['default'],
    asNEAT = require('asNEAT/asNEAT')['default'];

export default Ember.Controller.extend({

  // set by route
  // {instruments: []}
  content: null,

  instrumentParams: function() {
    return _.map(this.get('content.instruments').toArray(),
      function(instrument) {
        return {
          instrumentNetwork: Network.createFromJSON(instrument.get('json')),
          selected: false,
          isLive: false,
          index: 0,
          instrumentsModel: instrument
        };
    });
  }.property('content.instruments.@each')
});
