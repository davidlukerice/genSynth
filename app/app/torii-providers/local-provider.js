import Ember from 'ember';

export default Ember.Object.extend({
  open: function(options) {
    console.log('options: '+JSON.stringify(options));
    return new Ember.RSVP.Promise(function(resolve, reject){
      // TODO Send out request to the server
      resolve({
        authPassed: true,
        token: 'xxxxxxxxxxxxxx'
      });
    });
  }
});
