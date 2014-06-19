var Instrument = require('../models/instrument');

module.exports = {
  name: 'instrument',
  namespace: false,
  Model: Instrument,
  params: ['userId', 'json', 'created']
};