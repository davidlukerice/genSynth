
export default DS.Model.extend({
  created: DS.attr('date'),
  user: DS.belongsTo('user', {
    inverse: 'instruments',
    async: true
  }),
  name: DS.attr('string'),
  json: DS.attr('string'),
  branchedParent: DS.belongsTo('instrument',{
    async: true
  }),
  isPrivate: DS.attr('boolean'),
  stars: DS.hasMany('user', {
    inverse: 'stars',
    async: true
  }),
  tags: DS.attr('string')
});
