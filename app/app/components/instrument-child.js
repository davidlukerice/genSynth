
import InstrumentParent from 'gen-synth/components/instrument-parent';

export default InstrumentParent.extend({

  /**
    Maps the instruments index to the numpad hotkey
  */
  liveHotkey: function() {
    var i = this.get('index'),
        rowCount = 3,
        numChildren = 9;
    return numChildren -
          ((rowCount-1)-i%rowCount) -
          Math.floor(i/rowCount)*rowCount;
  }.property('index'),

  padding: 60,

  lastMutation: function() {
    var network = this.get('instrumentNetwork');
    if (!network) return;

    var mutation = network.lastMutation;
    if (mutation)
      return mutation.changeDescription;
    return "";
  }.property('instrumentNetwork'),

  actions: {
    
  }
});
