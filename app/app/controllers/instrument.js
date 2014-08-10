import Ember from 'ember';
var Network = require('asNEAT/network')['default'];

export default Ember.Controller.extend({
  needs: ['application'],
  instrumentParams: function() {
    var instrument = this.get('model.instrument');
    if (!instrument.isFulfilled)
      return;

    var instrumentParams = {
          instrumentNetwork: Network.createFromJSON(instrument.get('json')),
          selected: false,
          isLive: true,
          index: 0,
          instrumentModel: instrument
    };

    this.get('controllers.application')
        .set('activeInstrument', instrumentParams);

    return instrumentParams;
  }.property('model.instrument.json')
});
