
export default DS.Model.extend({
  username: DS.attr('string'),
  instruments: DS.hasMany('instrument', {
    inverse: 'user',
    async: true
  }),
  stars: DS.hasMany('instrument', {
    inverse: 'tags',
    async: true
  }),
  created: DS.attr('date')
});
