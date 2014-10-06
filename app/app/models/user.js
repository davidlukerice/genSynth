
export default DS.Model.extend({
  username: DS.attr('string'),
  instruments: DS.hasMany('instrument', {
    inverse: 'user',
    async: true
  }),
  unpublishedCount: DS.attr('number'),
  stars: DS.hasMany('instrument', {
    inverse: 'stars',
    async: true
  }),
  created: DS.attr('date')
});
