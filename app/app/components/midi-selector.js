var Utils = require('asNEAT/utils')['default'];

// requires chrome 33 with chrome://flags/#enable-web-midi enabled
// influenced from midi.js at https://github.com/cwilso/midi-synth
export default Ember.Component.extend({
  
  // passed in
  midiSelectable: null,

  // list of MIDI controllers detected
  inputList: [],
  selectedInput: null,

  setupMIDI: function() {
    var self = this,
        midiAccess = null;
    navigator.requestMIDIAccess().then(onSuccess, onError);

    function onSuccess(access) {
      var preferredIndex = -1;

      midiAccess = access;

      var inputList=midiAccess.inputs();

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

      self.set('inputList', inputList);

      var selectedInput = inputList[preferredIndex];
      self.set('selectedInput', selectedInput);
    }
    function onError(error) {
      Utils.log("No MIDI? " + error.code);
    }

  }.on('init'),

  onSelectedMIDIChange: function() {
    var selectedInput = this.get('selectedInput');
    this.get('midiSelectable').send('setMidiInput', selectedInput);
  }.observes('selectedInput')
});
