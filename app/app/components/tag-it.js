// Wrapper for https://github.com/aehlke/tag-it/blob/master/LICENSE
import Ember from 'ember';

export default Ember.Component.extend({
  tagName: "ul",

  // Passable parameters
  tags: [],
  //tagAdded: functionName,
  //tagRemoved: functionName
  placeholderText: "Tags",
  tagLimit: 10,

  tagit: null,

  shouldSendActions: true,

  didInsertElement: function() {
    var self = this;
    Ember.run.scheduleOnce('afterRender', this, function() {
      var ele = $(self.$());
      var tagit = ele.tagit({
        tagLimit: this.get('tagLimit'),
        placeholderText: this.get('placeholderText'),
        afterTagAdded: function(event, ui) {
          if (self.get('shouldSendActions'))
            self.afterTagAdded(ui.tagLabel);
        },
        afterTagRemoved: function(event, ui) {
          if (self.get('shouldSendActions'))
            self.afterTagRemoved(ui.tagLabel);
        }
      });

      self.set('tagit', tagit);
      self.notifyPropertyChange('tags');
    });
  },

  willDestroyElement: function() {
    this.get('tagit').tagit('destroy');
  },

  refreshTagitTags: function() {
    var self = this;
    // check if the same Tags
    var tags = this.get('tags'),
        tagitTags = this.getAssignedTags();
    if (tags.join() === tagitTags.join())
      return;

    // Temporarily don't send any actions until done populating
    self.set('shouldSendActions', false);
    this.clearTags();
    _.forEach(this.get('tags'), function(tag) {
      self.createTag(tag);
    });
    self.set('shouldSendActions', true);
  }.observes('tags.@each'),

  clearTags: function() {
    var tagit = this.get('tagit');
    if (tagit)
      tagit.tagit('removeAll');
  },

  createTag: function(tag) {
    var tagit = this.get('tagit');
    if (tagit)
      tagit.tagit('createTag', tag);
  },

  getAssignedTags: function() {
    var tagit = this.get('tagit');
    if (!tagit)
      return [];
    return tagit.tagit('assignedTags');
  },

  afterTagAdded: function(tag) {
    var tagAdded = this.get('tagAdded');
    if (tagAdded)
      this.sendAction('tagAdded', tag);
  },

  afterTagRemoved: function(tag) {
    var tagRemoved = this.get('tagRemoved');
    if (tagRemoved)
      this.sendAction('tagRemoved', tag);
  }
});
