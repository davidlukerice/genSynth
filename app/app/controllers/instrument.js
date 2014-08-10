import Ember from 'ember';
var Network = require('asNEAT/network')['default'];

export default Ember.Controller.extend({
  needs: ['application'],

  isCreator: function() {
    var application = this.get('controllers.application');
    return this.get('model.instrument.user.id') ===
      application.get('currentUser.id');
  }.property(
    'model.instrument.user.id',
    'controllers.application.currentUser.id'),

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
  }.property('model.instrument.json'),

  actions: {
    publish: function() {
      // TODO: Check for name
      this.get('model.instrument.content')
          .set('isPrivate', false)
          .save();
    }
  }
});
