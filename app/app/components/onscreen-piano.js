import Ember from 'ember';
export default Ember.Component.extend({
  // Passed in
  instrumentNetwork: null,

  hotkeyLayouts: [
    {type: "querty", accessor: "hotkey"},
    {type: "colemak", accessor: "colemakHotkey"}],
  selectedHotkeyLayout: "colemakHotkey",

  sustaining: false,

  onkeyDownHandler: null,
  onkeyUpHandler: null,
  setupKeyEvents: function() {
    var self = this;
    
    // Sustain on shift
    var onkeyDownHandler = function(e) {
      if(e.keyCode === 16) {
        self.set('sustaining', true);
      }
    };
    var onkeyUpHandler = function(e) {
      if(e.keyCode === 16) {
        self.set('sustaining', false);
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

  willDestroy: function() {
    this._super();
    $(document).off('keydown', this.get('onkeyDownHandler'));
    $(document).off('keyup', this.get('onkeyUpHandler'));
  },

  actions: {
    toggleSustain: function() {
      this.set('sustaining', !this.get('sustaining'));
    }
  }
});
