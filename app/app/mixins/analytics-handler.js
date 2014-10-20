import Ember from 'ember';

/**
 * Dimensions:
 *   dimension1: isAuthenticated: true/false
 *   dimension2: onscreenPianoIsOn: true/false
 *   dimension3: MIDIIsTurnedOn: true/false
 * metrics:
 *
 * Events:
 *
 */
export default Ember.Mixin.create({
  init: function() {
    this._super();

    var route = this.get('router.url').split(/[/?]/);
    if (route.length === 1 || route[1] === "")
      route = 'index';
    else
      route = route[1];

    console.log('analytics: init:'+route);
    var self = this;
    Ember.run.scheduleOnce('afterRender', this, function() {
      self.send('screenView', route);
    });
  },

  updateDimensions: function() {
    var isAuthenticated = this.get('session.isAuthenticated');
    if (typeof isAuthenticated === 'undefined')
      isAuthenticated = false;
    ga('set', 'dimension1', isAuthenticated);
  }.observes('session.isAuthenticated').on('init'),

  actions: {
    willTransition: function(transition) {
      this.send('screenView', transition.targetName);
    },

    screenView: function(screen) {
      ga('send', 'screenview', {
        'screenName': screen
      });
    },

    analyticsEvent: function(category, action, label, value) {
      var eventParams = {
        'hitType': 'event',
        'eventCategory': category, // like 'button',
        'eventAction': action // like 'click'
      };
      if (typeof label !== 'undefined')
        eventParams.eventLabel = label;
      if (typeof value !== 'undefined')
        eventParams.eventValue = value;

      ga('send', eventParams);
    },

    updateAnalyticsDimension: function(dimension, value) {
      ga('set', dimension, value);
    }
  }
});
