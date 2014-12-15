import Ember from 'ember';
var Utils = require('asNEAT/utils')['default'];

// requires chrome 33 with chrome://flags/#enable-web-midi enabled
// influenced from midi.js at https://github.com/cwilso/midi-synth
var MIDISelector = Ember.Component.extend({
  // passed in
  midiSelectable: null,

  // list of MIDI controllers detected
  inputList: [],
  selectedInput: null,

  setupMIDI: function() {
    var self = this;
    MIDISelector.setupMIDI.call(this, function(inputs) {
      if (!inputs) {
        return;
      }
      self.set('inputList', inputs.inputList);
      self.set('selectedInput', inputs.selectedInput);
    });
  }.on('init'),

  onSelectedMIDIChange: function() {
    var selectedInput = this.get('selectedInput');
    this.get('midiSelectable').send('setMidiInput', selectedInput);
  }.observes('selectedInput')
});

MIDISelector.setupMIDI = function(callback) {

  navigator.requestMIDIAccess().then(onSuccess, onError);

  function onSuccess(access) {
    var preferredIndex = -1;
    var inputList = [];
    var size = access.inputs.size;
    for (var i=0; i<size; ++i) {
      inputList.push(access.inputs.get(i));
    }

    // If any of the inputs have "keyboard" or "qx25" in them, selected them first
    _.forEach(inputList, function(input, i) {
      var str=input.name.toString();
      if (str.toLowerCase().indexOf("keyboard") !== -1 ||
          str.toLowerCase().indexOf("qx25") !== -1 )
      {
        preferredIndex=i;
        return true;
      }
    });
    if (preferredIndex === -1)
      preferredIndex = 0;

    var selectedInput = inputList[preferredIndex];

    if (typeof callback === 'function') {
      callback({
        inputList: inputList,
        selectedInput: selectedInput
      });
    }
  }
  function onError(error) {
    Utils.log("No MIDI? " + error.code);
    if (typeof callback === 'function') {
      callback(false);
    }
  }
};

export default MIDISelector;
