var Router = Ember.Router.extend(); // ensure we don't share routes between all Router instances

Router.map(function() {
  this.route('index', {path: '/'});
  this.route('evolve', {path: '/evolve'});
  this.route('feedback');
});

export default Router;
