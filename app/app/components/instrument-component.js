import Ember from 'ember';
import config from '../config/environment';
var Visualizer = require('asNEAT/asNEAT-visualizer')['default'];

var chars = 'abcdefghjkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWYZ23456789';
function getRandHash(len) {
  var str = "";
  for (var i=0; i<len; ++i)
    str+=chars[Math.floor(Math.random()*chars.length)];
  return str;
}

export default Ember.Component.extend({
  // passed in
  instrumentNetwork: null,
  selected: false,
  isLive: false,
  index: 0,

  selectable: false,
  showAdvanced: false,

  instrumentModel: null,
  branchedParent: null,

  makeLiveHandler: null,

  width: "100%",
  height: "100%",

  // created on init
  visualization: null,
  isShowingNetwork: false,

  isSaved: function() {
    var model = this.get('instrumentModel');
    return model !== null && model !== undefined;
  }.property('instrumentModel'),

  isPublished: function() {
    var isPrivate = this.get('instrumentModel.isPrivate');
    return (typeof isPrivate !== 'undefined') && !isPrivate;
  }.property('instrumentModel.isPrivate'),

  selector: function() {
    return "#"+this.elementId+' .visualizer';
  }.property('elementId'),

  currentUserStarred: function() {
    var applicationCtrl = this.get('targetObject.controllers.application'),
        currentUserId = applicationCtrl.get('currentUser.id'),
        model = this.get('instrumentModel');
    if (typeof currentUserId === 'undefined' ||
       !model.get('stars').isFulfilled )
    {
      return false;
    }

    return _.find(model.get('stars').content.toArray(),
      function(record) {
        return record.id === currentUserId;
    });
  }.property('instrumentModel.stars.@each.id',
             'targetObject.controllers.application.currentUser.id'),

  splitTags: function() {
    var tags = this.get('instrumentModel.tags');
    if (tags)
      return tags.split(' ');
    else
      return [];
  }.property('instrumentModel.tags'),

  initVisualization: function() {
    Ember.run.scheduleOnce('afterRender', this, function() {
      var visualization = Visualizer.createInstrumentVisualization({
        network: this.get('instrumentNetwork'),
        selector: this.get('selector'),
        width: this.get('width'),
        height: this.get('height'),
        // offwhite, green, yellow, Orange, red, purple, black
        colorScaleColors: ['#f8f8f8', '#308014', '#b2b200', '#cc8400', '#cc0000', '#660066', '#000000'],
        // following y=sqrt(x) for x_delta = 0.166667
        colorScalePositions: [0,0.40824829,0.577350269,0.707106781,0.816496581,0.912870929,1]
      });
      visualization.init();
      visualization.start();
      this.set('visualization', visualization);
    });
  }.on('init'),

  willDestroy: function() {
    this._super();
    this.get('visualization').stop();
  },

  actions: {
    play: function() {
      this.get('instrumentNetwork').play();
    },

    save: function() {
      var controller = this.get('targetObject'),
          applicationCtrl = controller.get('controllers.application');

      // Check if user is logged in first
      if (!controller.get('session').get('isAuthenticated')) {
        controller.send('analyticsEventWithRoute', 'showLogin', 'save');
        applicationCtrl.send('showLogin', 'save');
        return;
      }

      var self = this,
          store = controller.get('.store'),
          branchedParent = this.get('branchedParent');
      var instrument = store.createRecord('instrument', {
        created: Date.now(),
        name: 'Instr_'+getRandHash(5),
        json: this.get('instrumentNetwork').toJSON(),
        isPrivate: true,
        branchedParent: branchedParent,
        branchedGeneration: branchedParent ? (branchedParent.get('branchedGeneration') + 1): 0
      });
      instrument.save().then(function(instrument) {
        self.set('instrumentModel', instrument);
        if (branchedParent) {
          branchedParent.get('branchedChildren').then(function(children) {
            children.pushObject(instrument);
          });
          branchedParent.set('branchedChildrenCount',
            branchedParent.get('branchedChildrenCount') + 1);
        }
        applicationCtrl.set('currentUser.unpublishedCount',
          applicationCtrl.get('currentUser.unpublishedCount') + 1);
      }, function(error) {
        // TODO: Show error?
        console.log('error saving: '+error);
      });
    },

    toggleSelected: function() {
      if (this.get('selectable'))
        this.set('selected', !this.get('selected'));
    },

    makeLive: function() {
      var makeLiveHandler = this.get('makeLiveHandler');
      this.get('targetObject').send(makeLiveHandler, this);
    },

    toggleNetwork: function() {
      var vis = this.get('visualization');
      if (vis.isShowingNetwork) {
        vis.hideNetwork();
        this.set('isShowingNetwork', false);
      }
      else {
        vis.showNetwork();
        this.set('isShowingNetwork', true);
      }
    },

    starInstrument: function() {
      var controller = this.get('targetObject'),
          applicationCtrl = controller.get('controllers.application');

      controller.send('analyticsEvent', 'stars', 'star');

      // Check if user is logged in first
      if (!controller.get('session').get('isAuthenticated')) {
        applicationCtrl.send('showLogin', 'star');
        controller.send('analyticsEventWithRoute', 'showLogin', 'star');
        return;
      }

      var model = this.get('instrumentModel'),
          currentUser = applicationCtrl.get('currentUser');

      Ember.$.ajax({
        url: config.apiUrl+'/starInstrument/'+model.id,
        type: 'GET',
        xhrFields: {
          withCredentials: true
        }
      }).then(function(output) {
        model.set('starsCount', output.starsCount);
        model.get('stars').pushObject(currentUser);
      });
    },

    unstarInstrument: function() {
      var controller = this.get('targetObject'),
          applicationCtrl = controller.get('controllers.application');

      controller.send('analyticsEvent', 'stars', 'unstar');

      // Check if user is logged in first
      if (!controller.get('session').get('isAuthenticated')) {
        applicationCtrl.send('showLogin', 'unstar');
        controller.send('analyticsEventWithRoute', 'showLogin', 'unstar');
        return;
      }

      var model = this.get('instrumentModel'),
          currentUser = applicationCtrl.get('currentUser');

      Ember.$.ajax({
        url: config.apiUrl+'/unstarInstrument/'+model.id,
        type: 'GET',
        xhrFields: {
          withCredentials: true
        }
      }).then(function(output) {
        model.set('starsCount', output.starsCount);
        model.get('stars').removeObject(currentUser);
      });
    },

    searchLabel: function(label) {
      var controller = this.get('targetObject');
      controller.send('analyticsEvent', 'searches', 'tag', label);
      controller.transitionToRoute('search', {queryParams: {query: label}});
    },

    seeUser: function() {
      var controller = this.get('targetObject');
      controller.send('analyticsEvent', 'instrument', 'user');
      controller.transitionToRoute('user', this.get('instrumentModel.user'));
    },

    seeInstrument: function() {
      var controller = this.get('targetObject');
      controller.send('analyticsEvent', 'instrument', 'details');
      controller.transitionToRoute('instrument', this.get('instrumentModel'));
    },

    seePrivateInstrument: function() {
      var controller = this.get('targetObject');
      controller.send('analyticsEvent', 'instrument', 'private');
      controller.transitionToRoute('instrument', this.get('instrumentModel'));
    }
  }
});
