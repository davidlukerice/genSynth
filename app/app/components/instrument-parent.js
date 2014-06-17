
var Visualizer = require('asNEAT/asNEAT-visualizer')['default'],
    Instrument = require('asNEAT/models/instrument')['default'];

export default Ember.Component.extend({
  // passed in
  // {network, selected, isLive, index}
  instrumentNetwork: null,
  selected: false,
  isLive: false,
  index: 0,

  instrumentModel: null,

  makeLiveHandler: null,

  network: function() {
    return this.get('instrumentModel.network');
  }.property('instrumentModel.network'),

  width: "100%",
  height: "100%",

  // created on init
  visualization: null,

  selector: function() {
    return "#"+this.elementId+' .visualizer';
  }.property('elementId'),

  // shadow element of network
  selected: function() {
    return this.get('instrumentModel.selected');
  }.property('instrumentModel.selected'),

  initVisualization: function() {
    Ember.run.scheduleOnce('afterRender', this, function() {
      var visualization = Visualizer.createMultiVisualization({
        network: this.get('instrumentModel.network'),
        selector: this.get('selector'),
        width: this.get('width'),
        height: this.get('height'),
        // white, green, yellow, Orange, red, purple, black
        colorScaleColors: ['#ffffff', '#308014', '#b2b200', '#cc8400', '#cc0000', '#660066', '#000000'],
        // following y=sqrt(x) for x_delta = 0.166667
        colorScalePositions: [0,0.40824829,0.577350269,0.707106781,0.816496581,0.912870929,1]
      });
      visualization.init();
      visualization.start();
      this.set('visualization', visualization);
    });
  }.on('init'),

  willDestroy: function() {
    this._super();
    this.get('visualization').stop();
  },

  actions: {
    play: function() {
      this.get('instrumentModel.network').play();
    },

    save: function() {
      var instrument = this.store('instrument', {
        userId: 0,
        json: this.get('instrumentModel.network').toJSON()
      });
      instrument.save();
    },

    toggleSelected: function() {
      this.set('instrumentModel.selected',
        !this.get('instrumentModel.selected'));
    },

    makeLive: function() {
      var makeLiveHandler = this.get('makeLiveHandler'),
          instrumentModel = this.get('instrumentModel');
      this.get('targetObject').send(makeLiveHandler, instrumentModel);
    },

    nextVisualization: function() {
      this.get('visualization').nextVisualization();
    }
  }
});
