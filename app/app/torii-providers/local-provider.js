import Ember from 'ember';
import config from '../config/environment';

export default Ember.Object.extend({
  open: function(options) {
    console.log('options: '+JSON.stringify(options));
    return new Ember.RSVP.Promise(function(resolve, reject){
      Ember.$.ajax({
        url: config.apiUrl+'/auth/local',
        type: 'POST',
        data: {
          email: options.email,
          password: options.password
        },
        xhrFields: {
          withCredentials: true
        }
      }).then(function(response) {
        resolve({
          authPassed: true,
          user: response.user
        });
      }, function() {
        reject({
          authPassed: false
        });
      });
    });
  }
});
