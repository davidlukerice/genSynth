var mongoose = require('mongoose'),
    Utils = require('../utils'),
    Instrument = require('../models/instrument');

// ex name: someName, ns = nameSpace (false to not use)
// someName
var name = "instrument",
    namespace = false;

// nameSpace-
var dashedPrefix = namespace ? (namespace+'-') : '',
// nameSpace/
    slashedPrefix = namespace ? (namespace+'/') : '',
// nameSpace/someName
    prefixSlashedName = slashedPrefix+name,
// name-space/some-name
    dasherizedPrefixSlashedName = Utils.convertCamelToDasherized(prefixSlashedName),
// nameSpace-someName
    prefixedName = dashedPrefix+name,
// NameSpace-someName
    upName = Utils.upperCaseFirstLetter(prefixedName),
// NameSpaceSomeName
    upNameCamel = Utils.convertDasherizedToCamel(upName),
// SomeNames
    pluralName = name+'s',
// nameSpace-SomeNames
    prefixPluralName = prefixedName+'s',
// NameSpaceSomeName
    prefixedPluralNameCamel = Utils.convertDasherizedToCamel(prefixPluralName),
// /api/nameSpace/
    path = '/api/' + slashedPrefix;

module.exports.createRoute = function(app) {

  // PUT Update
  app.put(path+'/:id', function(req, res) {
    var params = req.body[prefixSlashedName],
        id = req.params.id;

    Instrument.findOne({ 'id' : id }, function(err, instrument) {
      if (err || !instrument)
        res.json(err);
      else {
        instrument.userId = params.userId;
        instrument.json = params.json;
        instrument.created = params.created;
        instrument.save(function(err) {
          if (err)
            res.json(err);
          else
            res.json( {
              dasherizedPrefixSlashedName: instrument
            });
        });
      }
    });
  });

  // POST Create
  app.post(path, function(req, res) {
    var instrument = new Instrument({
      userId: '00000',
      json: '{}',
      created: Date.now()
    });
    instrument.save(function(err) {
      if(err) {
        console.log(err);
      } else {
        console.log("saving instrument ...");
        
        //TODO: Return the newly created thing
      }
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