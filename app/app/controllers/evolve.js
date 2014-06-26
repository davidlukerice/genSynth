import MidiSelectable from 'gen-synth/mixins/midi-selectable';
import MIDISelector from 'gen-synth/components/midi-selector';

var asNEAT = require('asNEAT/asNEAT')['default'],
    Population = require('asNEAT/population')['default'];

var MINUS_CODE = "-".charCodeAt(),
    MULT_CODE = "*".charCodeAt(),
    PLUS_CODE = "+".charCodeAt(),
    DEC_CODE = ".".charCodeAt(),
    ENTER_CODE = 13;

export default Ember.Controller.extend(MidiSelectable, {

  // set by route
  // networks is a history of networks (list of list of networks)
  // and the top one is currently the parent set
  // {instrumentParams: [[{instrumentNetwork:asNEAT.Network, isLive, selected}, ...],[...],...]}
  content: null,

  showSettings: false,
  usingOnscreenPiano: true,
  usingMIDI: true,

  showHelp: false,

  minGlobalGainLevel: 0,
  maxGlobalGainLevel: 2,
  globalGainLevel: 1.0,
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

  noPreviousParents: function() {
    return this.get('content.instrumentParams').length <= 1;
  }.property('content.instrumentParams.@each'),

  parentInstrumentParams: function() {
    var networks = this.get('content.instrumentParams');
    return networks[networks.length-1];
  }.property('content.instrumentParams.@each'),

  childInstrumentParams: function() {
    var numChildren = 9,
        parentInstrumentParams = this.get('parentInstrumentParams'),
        newPopulation, children = [], i, child;

    newPopulation = Population.generateFromParents(
      _.map(parentInstrumentParams, function(element){
        return element.instrumentNetwork;
      }), {
      populationCount: numChildren,
      numberOfNewParentMutations: 4,
      crossoverRate: 0.2
    });

    for (i=0; i<numChildren; ++i) {
      child = newPopulation.networks[i];
      children.push(Ember.Object.create({
        instrumentNetwork: child,
        isLive: i===0,
        selected: false,
        index: i
      }));
    }
    this.set('activeInstrument', children[0]);

    return children;
  }.property('parentInstrumentParams.@each'),

  selectedNetworks: function() {
    var selectedParents = _.filter(this.get('parentInstrumentParams'), 'selected');
    var selectedChildren = _.filter(this.get('childInstrumentParams'), 'selected');
    return _.union(selectedParents, selectedChildren);
  }.property('parentInstrumentParams.@each.selected', 'childInstrumentParams.@each.selected'),

  noNetworksSelected: function() {
    return this.get('selectedNetworks').length <= 0;
  }.property('selectedNetworks.@each'),

  onkeyPressHandler: null,
  setupKeyEvents: function() {
    var self = this;

    var onkeyPressHandler = function(e) {
      
      // one to one mapping of numpad to the layout on screen
      var index = -1;
      if      (e.keyCode === 49 || e.keyCode === 97 ) index = 6;
      else if (e.keyCode === 50 || e.keyCode === 98 ) index = 7;
      else if (e.keyCode === 51 || e.keyCode === 99 ) index = 8;
      else if (e.keyCode === 52 || e.keyCode === 100) index = 3;
      else if (e.keyCode === 53 || e.keyCode === 101) index = 4;
      else if (e.keyCode === 54 || e.keyCode === 102) index = 5;
      else if (e.keyCode === 55 || e.keyCode === 103) index = 0;
      else if (e.keyCode === 56 || e.keyCode === 104) index = 1;
      else if (e.keyCode === 57 || e.keyCode === 105) index = 2;

      if (index>=0) {
        e.preventDefault();
        self.send('makeLive', self.get('childInstrumentParams')[index]);
      }

      // Reset parents
      if (e.keyCode === DEC_CODE) {
        e.preventDefault();
        self.send('resetParents');
      }
      // Go back a generation
      else if (e.keyCode === MINUS_CODE && !self.get('noPreviousParents')){
        e.preventDefault();
        self.send('backGeneration');
      }
      // Refresh current children
      else if (e.keyCode === MULT_CODE) {
        e.preventDefault();
        self.send('refreshGeneration');
      }
      // Goto next generation
      else if (e.keyCode === PLUS_CODE && !self.get('noNetworksSelected')) {
        e.preventDefault();
        self.send('nextGeneration');
      }
      // Toggle selected
      else if (e.keyCode === ENTER_CODE) {
        e.preventDefault();
        var instrument = self.get('activeInstrument');
        instrument.set('selected', !instrument.get('selected'));
      }
    };
    this.set('onkeyPressHandler', onkeyPressHandler);
    // setting up events from document because we can't
    // get focus on multiple piano-keys at once for key events
    // to fire correctly
    $(document).keypress(onkeyPressHandler);
  }.on('init'),

  willDestroy: function() {
    this._super();
    $(document).off('keypress', this.get('onkeyPressHandler'));
  },

  actions: {
    resetParents: function() {
      this.set('content.instrumentParams', [[]]);
    },

    refreshGeneration: function() {
      this.notifyPropertyChange('childInstrumentParams');
    },

    backGeneration: function() {
      this.get('content.instrumentParams').popObject();
      scrollToBottom();
    },

    nextGeneration: function() {
      var selected = this.get('selectedNetworks');
      // reset selected and isLive
      _.forEach(selected, function(network) {
        network.set('selected', false);
        network.set('isLive', false);
      });

      // push the currently selected networks on top
      this.get('content.instrumentParams').pushObject(selected);
      scrollToBottom();
    },

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

    toggleHelp: function() {
      this.set('showHelp', !this.get('showHelp'));
    },

    toggleSettings: function() {
      this.set('showSettings', !this.get('showSettings'));
    },

    makeLive: function(instrumentParentContent) {
      // turn off old instrument and setup the new selected one
      this.get('activeInstrument').set('isLive', false);
      instrumentParentContent.set('isLive', true);
      this.set('activeInstrument', instrumentParentContent);
    }
  }
});

function scrollToBottom() {
  Ember.run.scheduleOnce('afterRender', function() {
    $(document).scrollTop($(document).height());
  });
}