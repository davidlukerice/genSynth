
export default DS.Model.extend({
  user: DS.belongsTo('user', {
    inverse: 'instruments'
  }),
  json: DS.attr('string'),
  created: DS.attr('date'),
  branchedParent: DS.belongsTo('instrument'),
  isPrivate: DS.attr('boolean'),
  likes: DS.hasMany('user', {
    inverse: 'likes'
  }),
  tags: DS.attr('string')
});