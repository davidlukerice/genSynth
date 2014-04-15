
var Visualizer = require('asNEAT/asNEAT-visualizer')['default'];

export default Ember.Component.extend({
  // passed in
  // {network, selected, isLive, index}
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
      var visualization = Visualizer.createForceVisualization({
        network: this.get('instrumentModel.network'),
        selector: this.get('selector'),
        width: this.get('width'),
        height: this.get('height')
      });

      this.set('visualization', visualization);
    });
  }.on('init'),

  actions: {
    play: function() {
      this.get('instrumentModel.network').play();
    },

    toggleSelected: function() {
      this.set('instrumentModel.selected',
        !this.get('instrumentModel.selected'));
    },

    makeLive: function() {
      var makeLiveHandler = this.get('makeLiveHandler'),
          instrumentModel = this.get('instrumentModel');
      this.get('targetObject').send(makeLiveHandler, instrumentModel);
    }
  }
});
