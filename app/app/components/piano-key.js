import Ember from 'ember';
var Utils = require('asNEAT/utils')['default'];

export default Ember.Component.extend({
  tagName: 'span',

  // parameters
  note: "a4",
  hotkey: "q",
  colemakHotkey: "q",
  instrumentNetwork: null,
  hotkeyLayout: "colemakHotkey",
  sustaining: false,

  releaseHandler: null,
  keyIsDown: false,

  activeHotkey: function() {
    var hotkeyAccesor = this.get('hotkeyLayout');
    return this.get(hotkeyAccesor);
  }.property('hotkeyLayout'),

  activeHotkeyKeyCode: function() {
    var hotkey = this.get('activeHotkey');

    // special character cases
    if (hotkey === ";")
      hotkey = 186;
    else if (hotkey === "'")
      hotkey = 222;
    else if (hotkey === "]")
      hotkey = 221;
    else
      hotkey = hotkey.toUpperCase().charCodeAt();

    return hotkey;
  }.property('activeHotkey'),

  isPlaying: function() {
    return typeof this.get('releaseHandler') === 'function';
  }.property('releaseHandler'),

  sustainingChange: function() {
    var sustaining = this.get('sustaining'),
        keyIsDown = this.get('keyIsDown');
    if (!sustaining && !keyIsDown)
      this.turnOffInstrument();
  }.observes('sustaining'),

  onkeyDownHandler: null,
  onkeyUpHandler: null,
  setupKeyEvents: function() {
    var self = this;
    var onkeyDownHandler = function(e) {
      var hotkey = self.get('activeHotkeyKeyCode');
      if(e.keyCode === hotkey) {
        self.set('keyIsDown', true);
        if (!self.get('isPlaying'))
          self.playNote();
      }
    };
    var onkeyUpHandler = function(e) {
      var hotkey = self.get('activeHotkeyKeyCode');
      if(e.keyCode === hotkey) {
        self.set('keyIsDown', false);
        self.tryReleaseNote();
      }
    };
    this.set('onkeyDownHandler', onkeyDownHandler);
    this.set('onkeyUpHandler', onkeyUpHandler);
    // setting up events from document because we can't
    // get focus on multiple piano-keys at once for key events
    // to fire correctly
    $(document).keydown(onkeyDownHandler);
    $(document).keyup(onkeyUpHandler);

  }.on('init'),

  playNote: function() {
    var instrumentNetwork = this.get('instrumentNetwork'),
        note = this.get('note'),
        releaseHandler = this.get('releaseHandler');

    // make sure to release any previous notes playing
    if (typeof releaseHandler === "function")
      releaseHandler();

    if (!instrumentNetwork) {
      throw 'No instrumentNetwork to play!';
    }

    var steps = Utils.stepsFromRootNote(note);
    Utils.log('Playing note: '+note+' ('+steps+')');

    var noteOscillators = instrumentNetwork.getNoteOscillatorNodes();
    _.forEach(noteOscillators, function(node) {
      node.stepFromRootNote = steps;
    });

    releaseHandler = instrumentNetwork.playHold();
    this.set('releaseHandler', releaseHandler);
  },

  tryReleaseNote: function() {
    if (!this.get('sustaining'))
      this.turnOffInstrument();
  },

  turnOffInstrument: function() {
    var releaseHandler = this.get('releaseHandler');
    if (typeof releaseHandler === "function") {
      releaseHandler();
      this.set('releaseHandler', null);
    }
  },

  mouseDown: function() {
    this.set('keyIsDown', true);
    this.playNote();
  },

  mouseUp: function() {
    this.set('keyIsDown', false);
    this.tryReleaseNote();
  },

  willDestroy: function() {
    this._super();
    $(document).off('keydown', this.get('onkeyDownHandler'));
    $(document).off('keyup', this.get('onkeyUpHandler'));
  }
});
