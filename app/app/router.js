import Ember from 'ember';

var Router = Ember.Router.extend({
  location: GenSynthENV.locationType
});

Router.map(function() {
  this.route('index', {path: '/'});
  this.route('evolve', {path: '/evolve'});
  this.route('user', {path: 'user/:user_id'});
  this.route('instrument', {path: 'instrument/:instrument_id'});
  this.route('feedback');
});

export default Router;
