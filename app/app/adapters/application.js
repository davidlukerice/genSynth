import Ember from 'ember';
import config from '../config/environment';

//export default DS.FixtureAdapter.extend();

export default DS.RESTAdapter.extend({
  namespace: '',
  host: config.apiUrl,

  // modified ajax call to allow session header
  ajax: function(url, type, hash) {
    var adapter = this;

    return new Ember.RSVP.Promise(function(resolve, reject) {
      hash = adapter.ajaxOptions(url, type, hash);

      hash.success = function(json) {
        Ember.run(null, resolve, json);
      };

      hash.error = function(jqXHR) {
        Ember.run(null, reject, adapter.ajaxError(jqXHR));
      };

      hash.xhrFields = {
        withCredentials: true
      };

      Ember.$.ajax(hash);
    }, "DS: RestAdapter#ajax " + type + " to " + url);
  }
});
