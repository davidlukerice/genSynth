// Wrapper for https://github.com/aehlke/tag-it/blob/master/LICENSE

import Ember from 'ember';

export default Ember.Component.extend({
  tagName: "ul",

  tags: [],

  didInsertElement: function() {
    var self = this;
    Ember.run.scheduleOnce('afterRender', this, function() {
      var ele = self.$();
      ele.tagit();
    });
  },

  willDestroyElement: function() {

  },

  selectionChanged: function() {

  }
});
