var Instrument = require('../models/instrument');

module.exports = {
  name: 'instrument',
  namespace: false,
  Model: Instrument.Model,
  params: ['user', 'json', 'created', 'branchedParent',
           'isPrivate', 'likes', 'tags']
};