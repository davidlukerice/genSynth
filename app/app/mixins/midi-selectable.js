// Can hold a current midi input

export default Ember.Mixin.create({
  selectedMidiInput: null,
  actions: {
    setMidiInput: function(midiInput) {
      this.set('selectedMidiInput', midiInput);
    }
  }
});