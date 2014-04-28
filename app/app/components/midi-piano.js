var Utils = require('asNEAT/utils')['default'];

// requires chrome 33 with chrome://flags/#enable-web-midi enabled
// influenced from midi.js at https://github.com/cwilso/midi-synth
export default Ember.Component.extend({
  // Passed in
  instrument: null,
 
  // list of MIDI controllers detected
  inputList: [],
  selectedInput: null,
  lastSelectedInput: null,

  // whether the sustain pedal is down or not
  sustaining: false,

  // {noteNumber: function}
  releaseHandlers: {},
  // {noteNumber: keyIsDown(bool)}
  keysAreDown: {},

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
      self.set('selectedInput', inputList[preferredIndex]);
    }
    function onError(error) {
      Utils.log("No MIDI? " + error.code);
    }

  }.on('init'),

  onSelectedMIDIChange: function() {
    var self = this,
        lastInput = this.get('lastSelectedInput'),
        input = this.get('selectedInput');
    
    if (lastInput && typeof lastInput.onmidimessage === 'function')
      lastInput.onmidimessage = null;
    this.set('lastSelectedInput', input);

    input.onmidimessage = function(ev) {
      var cmd = ev.data[0] >> 4,
          channel = ev.data[0] & 0xf,
          noteNumber = ev.data[1],
          velocity = ev.data[2];

      //Utils.log('cmd:'+cmd+' ch'+channel+' note:'+noteNumber+' Veloc:'+velocity);

      if (channel === 9)
        return;
      if ( cmd===8 || ((cmd===9)&&(velocity===0)) ) { // with MIDI, note on with velocity zero is the same as note off
        // note off
        self.onKeyUp(noteNumber);
      } else if (cmd === 9) {
        // note on
        self.onKeyDown(noteNumber, velocity/127.0);
      } else if (cmd === 11) {
        // Sustain pedal on
        if (noteNumber === 64 && velocity === 127) {
          self.set('sustaining', true);
        }
        // Sustain pedal off
        else if (noteNumber === 64 && velocity === 0) {
          self.set('sustaining', false);
        }
        // mod wheel with veloc 0-127
        else if (noteNumber === 1) {
          //controller( noteNumber, velocity/127.0);
        }
        // S1
        else if (noteNumber === 22) {
          self.changeVolume(velocity / 127.0);
        }
      } else if (cmd === 14) {
        // pitch wheel
        //pitchWheel( ((velocity * 128.0 + noteNumber)-8192)/8192.0 );
      } else if (cmd === 13) {
        // aftertouch with noteNumber 0-127 (same for all notes)
      }
    };
  }.observes('selectedInput'),

  sustainingChange: function() {
    var self = this,
        sustaining = this.get('sustaining'),
        keysAreDown = this.get('keysAreDown');
    if (sustaining)
      return;

    // Check all notes if they are still pressed or not when
    // the sustain pedal is released
    _.forEach(keysAreDown, function(isDown, note) {
      if (!sustaining && !isDown) {
        self.turnOffNote(note);
      }
    });
  }.observes('sustaining'),

  onKeyDown: function(note, velocity) {
    // TODO: use velocity?
    this.get('keysAreDown')[note] = true;
    if (!this.noteIsPlaying(note))
      this.turnOnNote(note, velocity);
  },
  onKeyUp: function(note) {
    this.get('keysAreDown')[note] = false;
    this.tryTurnOffNote(note);
  },

  noteIsPlaying: function(note) {
    return typeof this.get('releaseHandlers')[note] === 'function';
  },

  turnOnNote: function(note, velocity) {
    var instrument = this.get('instrument'),
        A4NUMBER = 69,
        steps = note - A4NUMBER,
        releaseHandlers = this.get('releaseHandlers'),
        releaseHandler = this.get('releaseHandlers')[note];

    if (typeof releaseHandler === 'function')
      releaseHandler();

    if (!instrument)
      throw "No Instrument to Play";

    var noteOscillators = instrument.getNoteOscillatorNodes();
    _.forEach(noteOscillators, function(node) {
      node.stepFromRootNote = steps;
    });

    releaseHandler = instrument.playHold();
    releaseHandlers[note] = releaseHandler;
  },

  // turn note off if sustain pedal is not down
  tryTurnOffNote: function(note) {
    if (!this.get('sustaining'))
      this.turnOffNote(note);
  },

  turnOffNote: function(note) {
    var releaseHandlers = this.get('releaseHandlers'),
        handler = releaseHandlers[note];
    if (typeof handler === "function") {
      handler();
      releaseHandlers[note] = false;
    }
  },

  changeVolume: function(percent) {
    var indexController = this.get('targetObject'),
        minGain = indexController.get('minGlobalGainLevel'),
        maxGain = indexController.get('maxGlobalGainLevel'),
        range = maxGain-minGain;
    indexController.set('globalGainLevel', (percent*range)+minGain);
  },

  willDestroy: function() {
    this._super();
    var lastInput = this.get('lastSelectedInput'),
        input = this.get('selectedInput');
    
    if (lastInput && typeof lastInput.onmidimessage === 'function')
      lastInput.onmidimessage = null;
    if (input && typeof input.onmidimessage === 'function')
      input.onmidimessage = null;
  }
});
