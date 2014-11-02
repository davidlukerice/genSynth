import Ember from 'ember';
import config from './config/environment';

var Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
  this.route('index', {path: '/'});
  this.route('evolve', {path: '/evolve'});
  this.route('branch', {path: '/branch/:instrument_id'});
  this.route('search', {path: '/search'});
  this.route('user', {path: 'user/:user_id'});
  this.route('instrument', {path: 'instrument/:instrument_id'});
  this.route('feedback');
  this.route('credits');
  this.route('terms');
  this.route('redirect', { path: '*:' });
});

export default Router;
