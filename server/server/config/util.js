
var _ = require('lodash');

function sanitizeStr(str) {
  return str.replace(/[.]/g, '．').replace(/[$]/g, '＄');
}

function sanitize(input) {
  if (typeof input === 'string') {
    return sanitizeStr(input);
  }
  if (typeof input === 'object') {
    return _.reduce(input, function(out, val, key) {
      out[sanitizeStr(key)] = sanitize(val);
      return out;
    }, {});
  }
  return input;
}

module.exports = {
  sanitize: sanitize
};
