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

  actions: {
    willTransition: function(transition) {
      console.log('analytics: will Transition: ' + transition.targetName);
      this.send('screenView', transition.targetName);
    },

    screenView: function(screen) {
      console.log('analytics: screenView: ' + screen);
      ga('send', 'screenview', {
        'screenName': screen
      });
    }
  }
});
