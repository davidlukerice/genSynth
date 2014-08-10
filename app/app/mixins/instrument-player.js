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
      self.set('selectedMidiInput', inputs.selectedInput);
    });
  }.on('init'),

  activeInstrument: null,
  actions: {
    toggleOnscreenPiano: function() {
      this.set('usingOnscreenPiano', !this.get('usingOnscreenPiano'));
      var scrollAmount;

      // Scroll down/up when showing/hiding the piano
      if (this.get('usingOnscreenPiano'))
        scrollAmount = $(document).scrollTop()+100;
      else
        scrollAmount = $(document).scrollTop()-100;

      Ember.run.scheduleOnce('afterRender', function() {
        $(document).scrollTop(scrollAmount);
      });
    },

    toggleMIDI: function() {
      this.set('usingMIDI', !this.get('usingMIDI'));
    },

    makeLive: function(instrumentParentContent) {
      // turn off old instrument and setup the new selected one
      var activeInstrument = this.get('activeInstrument');
      if (activeInstrument)
        activeInstrument.set('isLive', false);
      instrumentParentContent.set('isLive', true);
      this.set('activeInstrument', instrumentParentContent);
    }
  }
});
