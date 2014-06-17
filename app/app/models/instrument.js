
export default DS.Model.extend({
  useId: DS.attr('string'),
  json: DS.attr('string'),
  created: DS.attr('date')
});