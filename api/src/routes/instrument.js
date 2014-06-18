var mongoose = require('mongoose'),
    _ = require('lodash'),
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
// /api/nameSpace/someNames
    path = '/api/' + slashedPrefix + pluralName;

module.exports.createRoute = function(app) {

  console.log('path: '+ path.info);

  // PUT Update
  app.put(path+'/:id', function(req, res) {
    var params = req.body[prefixSlashedName],
        id = req.params.id;

    Instrument.findById(id, function(err, instrument) {
      if (err || !instrument)
        res.json(err);
      else {
        instrument.userId = params.userId;
        instrument.json = params.json;
        instrument.created = params.created;
        instrument.save(function(err, instrument) {
          if (err)
            res.json(err);
          else {
            var out = {};
            out[dasherizedPrefixSlashedName] = instrument;
            res.json(out);
          }
        });
      }
    });
  });

  // POST Create
  app.post(path, function(req, res) {
    var params = req.body[prefixSlashedName];
    var instrument = new Instrument(
      _.extend(params, {
      created: Date.now()
    }));
    instrument.save(function(err) {
      if(err) {
        res.json(err);
      } else {
        var out = {};
        out[dasherizedPrefixSlashedName] = instrument;
        res.json(out);
      }
    });
  });

  // DELETE Delete
  app.delete(path+'/:id', function(req, res) {
    var params = req.body[prefixSlashedName],
        id = req.params.id;

    Instrument.findByIdAndRemove(id, function(err, instrument) {
      if (err || !instrument)
        res.json(err);
      else {
        var out = {};
        out[dasherizedPrefixSlashedName] = instrument;
        res.json(out);
      }
    });
  });

  // GET Find All
  app.get(path, function(req, res) {
    var params = req.body[prefixSlashedName];
    Instrument.find(params, function(err, instruments) {
      if (err || !instruments)
        res.json(err);
      else {
        var out = {};
        out[dasherizedPrefixSlashedName] = toObjects(instruments);
        res.json(out);
      }
    });
  });

  // GET Find
  app.get(path+'/:id', function(req, res) {
    var params = req.body[prefixSlashedName],
        id = req.params.id;
    Instrument.findById(params, function(err, instrument) {
      if (err || !instrument)
        res.json(err);
      else {
        var out = {};
        out[dasherizedPrefixSlashedName] = instrument;
        res.json(out);
      }
    });
  });
};

function toObjects(arr) {
  var objs = [];
  _.forEach(arr, function(item) {
    objs.push(item.toObject({virtuals: true}));
  });
  return objs;
}