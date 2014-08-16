import Ember from 'ember';
var Network = require('asNEAT/network')['default'];

export default Ember.Controller.extend({
  // setByRoute:
  // instrument

  needs: ['application'],

  publishErrorMessage: null,
  clearPublishError: function() {
    this.set('publishErrorMessage', null);
  },

  tempName: "",
  updateTempName: function() {
    this.set('tempName', this.get('instrument.name'));
  }.observes('instrument.name'),

  nameHasChanged: function() {
    var instrument = this.get('instrument'),
        temp = this.get('tempName');
    this.clearPublishError();
    return instrument && temp !== instrument.get('name');
  }.property('tempName', 'instrument.name'),
  hasName: function() {
    var tempName = this.get('tempName');
    return tempName && tempName !== "";
  }.property('tempName'),

  tempInstrumentTags: "",

  // Using an observer/field instead of a computed property since
  // changes weren't being propogated for some reason...
  splitTempInstrumentTags: [],
  updateSplitTempInstrumentTags: function() {
    var tags = this.get('tempInstrumentTags');
    if (!tags || tags.length === 0)
      this.set('splitTempInstrumentTags', Ember.Array.constructor([]));
    else
      this.set('splitTempInstrumentTags', Ember.Array.constructor(tags.split(' ')));
  }.observes('tempInstrumentTags'),

  updateTempTags: function() {
    this.set('tempInstrumentTags', this.get('instrument.tags'));
  }.observes('instrument.tags.@each'),

  tagsHaveChanged: function() {
    var instrument = this.get('instrument'),
        temp = this.get('tempInstrumentTags');
    return instrument && temp !== instrument.get('tags');
  }.property('tempInstrumentTags', 'instrument.tags.@each'),

  isCreator: function() {
    var application = this.get('controllers.application');
    return this.get('instrument.user.id') ===
      application.get('currentUser.id');
  }.property(
    'instrument.user.id',
    'controllers.application.currentUser.id'),

  instrumentParams: function() {
    var instrument = this.get('instrument');
    var instrumentParams = {
          instrumentNetwork: Network.createFromJSON(instrument.get('json')),
          selected: false,
          isLive: true,
          index: 0,
          instrumentModel: instrument
    };

    this.get('controllers.application')
        .set('activeInstrument', instrumentParams);

    return instrumentParams;
  }.property('instrument.json'),

  isPublished: function() {
    var isPrivate = this.get('instrument.isPrivate');
    return !isPrivate;
  }.property('instrument.isPrivate'),

  branchedParentParams: function() {
    var parent = this.get('instrument.branchedParent');
    if (!parent || !parent.isFulfilled)
      return null;

    return {
      instrumentNetwork: Network.createFromJSON(parent.get('json')),
      selected: false,
      isLive: false,
      index: 0,
      instrumentModel: parent
    };
  }.property('instrument.branchedParent.json'),

  branchedChildrenParams: function() {
    var children = this.get('instrument.branchedChildren');
    if (!children.toArray)
      return [];
    children = children.toArray();

    var params = [];
    _.forEach(children, function(child) {
      params.push({
        instrumentNetwork: Network.createFromJSON(child.get('json')),
        selected: false,
        isLive: false,
        index: 0,
        instrumentModel: child
      });
    });

    return params;
  }.property('instrument.branchedChildren.@each.json'),

  actions: {
    saveName: function() {
      // TODO: Profanity check? Server side?
      // https://www.npmjs.org/package/profanity-filter

      var instrument = this.get('instrument'),
          temp = this.get('tempName');
      if (instrument &&
          temp !== instrument.get('name') &&
          this.get('hasName'))
      {
        instrument.set('name', temp);
        instrument.save();
      }
    },
    cancelName: function() {
      this.set('tempName', this.get('instrument.name'));
    },

    addTempTag: function(tag) {
      var tags = this.get('splitTempInstrumentTags');
      if (tags.contains(tag))
        return;
      tags.pushObject(tag);
      this.set('tempInstrumentTags', tags.join(' '));
    },
    removeTempTag: function(tag) {
      var tags = this.get('splitTempInstrumentTags');
      tags.removeObject(tag);
      this.set('tempInstrumentTags', tags.join(' '));
    },
    saveTags: function() {
      // TODO: Profanity check? Server side?
      // https://www.npmjs.org/package/profanity-filter

      var instrument = this.get('instrument'),
          temp = this.get('tempInstrumentTags');
      if (instrument && temp !== instrument.get('tags')) {
        instrument.set('tags', temp);
        instrument.save();
      }
    },
    cancelTags: function() {
      this.set('tempInstrumentTags', this.get('instrument.tags'));
    },

    publish: function() {
      var instrument = this.get('instrument');
      if (!instrument.set) {
        instrument = instrument.get('content');
      }
      if (this.get('hasName')) {
        instrument.set('isPrivate', false)
                  .save();
      }
      else {
        this.set('publishErrorMessage', 'Instrument must be named.');
      }
    }
  }
});
