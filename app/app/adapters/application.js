//export default DS.FixtureAdapter.extend();

export default DS.RESTAdapter.extend({
  namespace: '',
  host: 'http://localhost:3000'
});