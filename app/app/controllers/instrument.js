import Ember from 'ember';
var Network = require('asNEAT/network')['default'];

export default Ember.Controller.extend({
  // setByRoute:
  // instrument

  needs: ['application'],

  publishErrorMessage: null,
  clearPublishError: function() {
    this.set('publishErrorMessage', null);
  },

  tempName: "",
  updateTempName: function() {
    this.set('tempName', this.get('instrument.name'));
  }.observes('instrument.name'),

  nameHasChanged: function() {
    var instrument = this.get('instrument'),
        temp = this.get('tempName');
    this.clearPublishError();
    return instrument && temp !== instrument.get('name');
  }.property('tempName', 'instrument.name'),
  hasName: function() {
    var tempName = this.get('tempName');
    return tempName && tempName !== "";
  }.property('tempName'),

  isCreator: function() {
    var application = this.get('controllers.application');
    return this.get('instrument.user.id') ===
      application.get('currentUser.id');
  }.property(
    'instrument.user.id',
    'controllers.application.currentUser.id'),

  instrumentParams: function() {
    var instrument = this.get('instrument');
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
  }.property('instrument.json'),

  actions: {
    saveName: function() {
      var instrument = this.get('instrument'),
          temp = this.get('tempName');
      if (instrument &&
          temp !== instrument.get('name') &&
          this.get('hasName'))
      {
        instrument.set('name', temp);
        instrument.save();
      }
    },
    cancelName: function() {
      this.set('tempName', this.get('instrument.name'));
    },
    publish: function() {
      var instrument = this.get('instrument');
      if (!instrument.set) {
        instrument = instrument.get('content');
      }
      if (this.get('hasName')) {
        instrument.set('isPrivate', false)
                  .save();
      }
      else {
        this.set('publishErrorMessage', 'Instrument must be named.');
      }
    }
  }
});
