
export default DS.Model.extend({
  created: DS.attr('date'),
  user: DS.belongsTo('user', {
    inverse: 'instruments'
  }),
  name: DS.attr('string'),
  json: DS.attr('string'),
  branchedParent: DS.belongsTo('instrument'),
  isPrivate: DS.attr('boolean'),
  likes: DS.hasMany('user', {
    inverse: 'likes'
  }),
  tags: DS.attr('string')
});
