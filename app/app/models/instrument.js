
export default DS.Model.extend({
  user: DS.belongsTo('user'),
  json: DS.attr('string'),
  created: DS.attr('date'),
  branchedParent: DS.belongsTo('instrument'),
  isPrivate: DS.attr('bool'),
  likes: DS.hasMany('user'),
  tags: DS.attr('string')
});