var mongoose = require('mongoose'),
    Model = require('../models/instrument'),
    path = '/api/instrument';

module.exports.createRoute = function(app) {

  // POST Create
  app.post(path, function(req, res) {
    var instrument = new Model({
      userId: '00000',
      json: '{}'
      created: Date.now()
    });
    instrument.save(function(err) {
      if(err) {
        console.log(err);
      } else {
        console.log("saving instrument ...");
        
        //TODO: Return the newly created thing
      };
    });
  });

  // DELETE Delete
  app.delete(path+'/:id', function(req, res) {
    //TODO: 
  });

  // GET Find All
  app.get(path, function(req, res) {
    //TODO: 
  });

  // GET Find
  app.get(path+'/:id', function(req, res) {
    //TODO: 
  });
};