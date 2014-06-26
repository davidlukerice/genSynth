import Ember from 'ember';

var Router = Ember.Router.extend({
  location: GenSynthENV.locationType
});

Router.map(function() {
  this.route('index', {path: '/'});
  this.route('evolve', {path: '/evolve'});
  this.route('feedback');
});

export default Router;
