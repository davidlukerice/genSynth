
export default DS.Model.extend({
  email: DS.attr('string'),
  username: DS.attr('string'),
  instruments: DS.hasMany('instrument', {
    inverse: 'user'
  }),
  likes: DS.hasMany('instrument', {
    invers: 'tags'
  }),
  created: DS.attr('date')
});