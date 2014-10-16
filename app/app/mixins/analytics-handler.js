import Ember from 'ember';

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

  updateDimensionsAndMetrics: function() {
    var isAuthenticated = this.get('session.isAuthenticated');
    if (typeof isAuthenticated === 'undefined')
      isAuthenticated = false;
    ga('set', 'dimension1', isAuthenticated);
    //ga('set', 'metric1', 1);
  }.observes('session.isAuthenticated'),

  actions: {
    willTransition: function(transition) {
      this.send('screenView', transition.targetName);
    },

    screenView: function(screen) {
      ga('send', 'screenview', {
        'screenName': screen
      });
    },

    analyticsEvent: function(category, action) {
      ga('send', {
        'hitType': 'event',
        'eventCategory': category, // like 'button',
        'eventAction': action // like 'click'
        //'eventLabel': 'nav buttons',
        //'eventValue': 4
      });
    }
  }
});
