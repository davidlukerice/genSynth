import Ember from 'ember';
import MidiSelectable from 'gen-synth/mixins/midi-selectable';
import MIDISelector from 'gen-synth/components/midi-selector';
var asNEAT = require('asNEAT/asNEAT')['default'];

// Can hold a current midi input
export default Ember.Mixin.create(MidiSelectable, {
  usingOnscreenPiano: true,
  usingMIDI: true,

  minGlobalGainLevel: 0,
  maxGlobalGainLevel: 1,
  globalGainLevel: 0.1,

  volume: function() {
    var max = this.get('maxGlobalGainLevel'),
        min = this.get('minGlobalGainLevel'),
        gain = this.get('globalGainLevel');
    return Math.round((gain-min)/(max-min)*100);
  }.property('minGlobalGainLevel', 'maxGlobalGainLevel', 'globalGainLevel'),

  updateGainHandler: function() {
    asNEAT.globalGain.gain.value = this.get('globalGainLevel');
  }.observes('globalGainLevel').on('init'),

  /**
    If using MIDI, select the default input
  */
  selectDefaultMIDIInput: function() {
    if (!this.get('usingMIDI'))
      return;

    var self = this;
    MIDISelector.setupMIDI.call(this, function(inputs) {
      if (inputs)
        self.set('selectedMidiInput', inputs.selectedInput);
      self.send('updateAnalyticsMetric', 'metric1', inputs?inputs.inputList.length:0);
    });
  }.on('init'),

  onkeyDownHandler: null,
  setupKeyEvents: function() {
    var self = this;

    // Panic on spacebar
    var onkeyDownHandler = function(e) {
      if(e.keyCode === 32)
        self.send('panic');
    };
    this.set('onkeyDownHandler', onkeyDownHandler);
    $(document).keydown(onkeyDownHandler);
  }.on('init'),
  willDestroy: function() {
    this._super();
    $(document).off('keydown', this.get('onkeyDownHandler'));
  },

  activeInstrument: null,
  actions: {
    toggleOnscreenPiano: function() {
      this.set('usingOnscreenPiano', !this.get('usingOnscreenPiano'));
      var scrollAmount;

      // Scroll down/up when showing/hiding the piano
      var usingOnscreenPiano = this.get('usingOnscreenPiano');
      if (usingOnscreenPiano)
        scrollAmount = $(document).scrollTop()+100;
      else
        scrollAmount = $(document).scrollTop()-100;
      this.send('updateAnalyticsDimension', 'dimension2', usingOnscreenPiano);
      this.send('analyticsEvent', 'settings', 'onscreenPiano', usingOnscreenPiano?'on':'off');

      Ember.run.scheduleOnce('afterRender', function() {
        $(document).scrollTop(scrollAmount);
      });
    },

    toggleMIDI: function() {
      this.set('usingMIDI', !this.get('usingMIDI'));
      var usingMIDI = this.get('usingMIDI');
      this.send('updateAnalyticsDimension', 'dimension3', usingMIDI);
      this.send('analyticsEvent', 'settings', 'MIDI', usingMIDI?'on':'off');
    },

    makeLive: function(instrumentParentContent) {
      // turn off old instrument and setup the new selected one
      var activeInstrument = this.get('activeInstrument');
      if (activeInstrument &&
         !activeInstrument.isDestroyed &&
         !activeInstrument.isDestroying)
      {
        activeInstrument.set('isLive', false);
      }
      instrumentParentContent.set('isLive', true);
      this.set('activeInstrument', instrumentParentContent);
    },

    panic: function() {
      asNEAT.resetOutNodes();
      this.send('analyticsEvent', 'util', 'killSound');
    }
  }
});
