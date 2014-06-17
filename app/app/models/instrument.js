
export default DS.Model.extend({
  userId: DS.attr('string'),
  json: DS.attr('string'),
  created: DS.attr('date')
});