var mongoose = require('mongoose'),
    _ = require('lodash'),
    Utils = require('./utils');

module.exports.createRoute = function(app, scaffold) {

  // ex name: someName, ns = nameSpace (false to not use)
  // nameSpace-
  var dashedPrefix = scaffold.namespace ? (scaffold.namespace+'-') : '',
  // nameSpace/
      slashedPrefix = scaffold.namespace ? (scaffold.namespace+'/') : '',
  // nameSpace/someName
      prefixSlashedName = slashedPrefix+scaffold.name,
  // name-space/some-name
      dasherizedPrefixSlashedName = Utils.convertCamelToDasherized(prefixSlashedName),
  // nameSpace-someName
      prefixedName = dashedPrefix+scaffold.name,
  // NameSpace-someName
      upName = Utils.upperCaseFirstLetter(prefixedName),
  // NameSpaceSomeName
      upNameCamel = Utils.convertDasherizedToCamel(upName),
  // SomeNames
      pluralName = scaffold.name+'s',
  // nameSpace-SomeNames
      prefixPluralName = prefixedName+'s',
  // NameSpaceSomeName
      prefixedPluralNameCamel = Utils.convertDasherizedToCamel(prefixPluralName),
  // /api/nameSpace/someNames
      path = '/api/' + slashedPrefix + pluralName;

  console.log('path: '+ path.info);

  // PUT Update
  app.put(path+'/:id', function(req, res) {
    var params = req.body[prefixSlashedName],
        id = req.params.id;

    scaffold.Model.findById(id, function(err, model) {
      if (err || !model)
        res.json(err);
      else {
        _.forEach(scaffold.params, function(name) {
          model[name] = params[name];
        });
        model.save(function(err, model) {
          if (err)
            res.json(err);
          else {
            var out = {};
            out[dasherizedPrefixSlashedName] = model;
            res.json(out);
          }
        });
      }
    });
  });

  // POST Create
  app.post(path, function(req, res) {
    var params = req.body[prefixSlashedName];
    var model = new scaffold.Model(
      _.extend(params, {
      created: Date.now()
    }));
    model.save(function(err) {
      if(err) {
        res.json(err);
      } else {
        var out = {};
        out[dasherizedPrefixSlashedName] = model;
        res.json(out);
      }
    });
  });

  // DELETE Delete
  app.delete(path+'/:id', function(req, res) {
    var id = req.params.id;
    scaffold.Model.findByIdAndRemove(id, function(err, model) {
      if (err || !model)
        res.json(err);
      else {
        var out = {};
        out[dasherizedPrefixSlashedName] = model;
        res.json(out);
      }
    });
  });

  // GET Find All
  app.get(path, function(req, res) {
    var query = req.query;
    scaffold.Model.find(query, function(err, models) {
      if (err || !models)
        res.json(err);
      else {
        var out = {};
        out[dasherizedPrefixSlashedName] = toObjects(models);
        res.json(out);
      }
    });
  });

  // GET Find
  app.get(path+'/:id', function(req, res) {
    var id = req.params.id;
    scaffold.Model.findById(id, function(err, model) {
      if (err || !model)
        res.json(err);
      else {
        var out = {};
        out[dasherizedPrefixSlashedName] = model;
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