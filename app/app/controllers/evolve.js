import Ember from 'ember';

var Population = require('asNEAT/population')['default'];

var MINUS_CODE = "-".charCodeAt(),
    MULT_CODE = "*".charCodeAt(),
    PLUS_CODE = "+".charCodeAt(),
    DEC_CODE = ".".charCodeAt(),
    ENTER_CODE = 13;

export default Ember.Controller.extend({

  needs: ['application'],

  // set by route
  // networks is a history of networks (list of list of networks)
  // and the top one is currently the parent set
  // {instrumentParams: [[{instrumentNetwork:asNEAT.Network, isLive, selected}, ...],[...],...]}
  content: null,

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
    this.get('controllers.application')
        .set('activeInstrument', children[0]);

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
      if      (e.keyCode === 49) index = 6;
      else if (e.keyCode === 50) index = 7;
      else if (e.keyCode === 51) index = 8;
      else if (e.keyCode === 52) index = 3;
      else if (e.keyCode === 53) index = 4;
      else if (e.keyCode === 54) index = 5;
      else if (e.keyCode === 55) index = 0;
      else if (e.keyCode === 56) index = 1;
      else if (e.keyCode === 57) index = 2;

      if (index>=0) {
        e.preventDefault();
        self.get('controllers.application')
            .send('makeLive',
              self.get('childInstrumentParams')[index]);
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
        var instrument = self.get('controllers.application.activeInstrument');
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
    }
  }
});

function scrollToBottom() {
  Ember.run.scheduleOnce('afterRender', function() {
    $(document).scrollTop($(document).height());
  });
}
