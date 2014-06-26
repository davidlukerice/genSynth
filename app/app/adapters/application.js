//export default DS.FixtureAdapter.extend();

export default DS.RESTAdapter.extend({
  namespace: 'api',
  host: 'http://localhost:3000'
});