import Ember from 'ember';

var SortingTypes = {
  CREATED_INC: 'createdInc',
  CREATED_DEC: 'createdDec',
  STARS_INC: 'starsInc',
  STARS_DEC: 'starsDec',
  BRANCHES_INC: 'branchInc',
  BRANCHES_DEC: 'branchDec'
};

var mixin = Ember.Mixin.create({
  page: 1,
  sorting: SortingTypes.CREATED_DEC,
  clearSorting: function() {
    this.set('sorting', SortingTypes.CREATED_DEC);
  },

  actions: {

  }
});

mixin.SortingTypes = SortingTypes;

export default mixin;
