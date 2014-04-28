
import InstrumentParent from 'appkit/components/instrument-parent';

export default InstrumentParent.extend({

  /**
    Maps the instruments index to the numpad hotkey
  */
  liveHotkey: function() {
    var i = this.get('instrumentModel.index'),
        rowCount = 3,
        numChildren = 9;
    return numChildren -
          ((rowCount-1)-i%rowCount) -
          Math.floor(i/rowCount)*rowCount;
  }.property('instrumentModel.index'),

  padding: 60,

  lastMutation: function() {
    var network = this.get('network');
    if (!network) return;

    var mutation = network.lastMutation;
    if (mutation)
      return mutation.changeDescription;
    return "";
  }.property('network'),

  actions: {
    
  }
});
