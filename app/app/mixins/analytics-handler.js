import Ember from 'ember';

/**
 * Dimensions:
 *   dimension1: isAuthenticated: true/false [0|1]
 *   dimension2: onscreenPianoIsOn: true/false
 *   dimension3: MIDIIsTurnedOn: true/false
 *   dimension4: webAudioSupported: true/false
 *   dimension5: numberMIDIDevices: 0,1,2,3,4...
 * metrics:
 *
 * Events:
 *
 */
export default Ember.Mixin.create({
  init: function() {
    this._super();

    var self = this,
        route = this.getCurrentRoute();
    console.log('analytics: init:'+route);
    Ember.run.scheduleOnce('afterRender', this, function() {
      self.send('screenView', route);
    });
  },

  getCurrentRoute: function() {
    var route = this.get('router.url').split(/[/?]/);
    if (route.length === 1 || route[1] === "")
      route = 'index';
    else
      route = route[1];
    return route;
  },

  updateDimensions: function() {
    var isAuthenticated = this.get('session.isAuthenticated');
    if (typeof isAuthenticated === 'undefined')
      isAuthenticated = false;
    ga('set', 'dimension1', isAuthenticated);
  }.observes('session.isAuthenticated').on('init'),

  setInitialNonObservedDimensions: function() {
    // both usingKeyboard and usingMIDI are enabled by default
    ga('set', 'dimension2', true);
    ga('set', 'dimension3', true);
  }.on('init'),

  actions: {
    analyticsWillTransition: function(transition) {
      this.send('screenView', transition.targetName);
    },

    screenView: function(screen) {
      ga('send', 'screenview', {
        'screenName': screen
      });
    },

    analyticsEventWithRoute: function(category, action) {
      this.send('analyticsEvent', category, action, this.getCurrentRoute());
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

    updateAnalyticsMetric: function(metricId, value) {
      ga('set', metricId, value);
    },

    updateAnalyticsDimension: function(dimensionId, value) {
      ga('set', dimensionId, value);
    }
  }
});
