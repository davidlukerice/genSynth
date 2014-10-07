import Ember from 'ember';

var SortingTypes = {
  CREATED_INC: 'created',
  CREATED_DEC: '-created',
  STARS_INC: 'starsCount',
  STARS_DEC: '-starsCount',
  BRANCHES_INC: 'branchedChildrenCount',
  BRANCHES_DEC: '-branchedChildrenCount'
};

var component = Ember.Component.extend({
  sorting: SortingTypes.CREATED_DEC,
  changeSortingHandler: '',

  clearSorting: function() {
    this.set('sorting', SortingTypes.CREATED_DEC);
  },

  createdIncSelected: function() {
    var sorting = this.get('sorting');
    return sorting === SortingTypes.CREATED_INC;
  }.property('sorting'),

  createdDecSelected: function() {
    var sorting = this.get('sorting');
    return sorting === SortingTypes.CREATED_DEC;
  }.property('sorting'),

  starsIncSelected: function() {
    var sorting = this.get('sorting');
    return sorting === SortingTypes.STARS_INC;
  }.property('sorting'),

  starsDecSelected: function() {
    var sorting = this.get('sorting');
    return sorting === SortingTypes.STARS_DEC;
  }.property('sorting'),

  branchIncSelected: function() {
    var sorting = this.get('sorting');
    return sorting === SortingTypes.BRANCHES_INC;
  }.property('sorting'),

  branchDecSelected: function() {
    var sorting = this.get('sorting');
    return sorting === SortingTypes.BRANCHES_DEC;
  }.property('sorting'),

  actions: {
    changeSorting: function(sortingType) {
      this.sendAction('changeSortingHandler', sortingType);
    }
  }
});

component.SortingTypes = SortingTypes;

export default component;
