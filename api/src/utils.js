
// Changes the first character to upper case
// ex. name --> Name
exports.upperCaseFirstLetter = function(word) {
  return word.charAt(0).toUpperCase() + word.slice(1);
};

// Changes any dashes to uperased lettrs
// ex. some-name --> someName
exports.convertDasherizedToCamel = function(word) {
  var index;
  while( (index=word.indexOf('-')) !== -1) {
    var firstHalf = word.slice(0, index);
    var secondHalf = word.slice(index+1);
    secondHalf = exports.upperCaseFirstLetter(secondHalf);
    word = firstHalf+secondHalf;
  }
  return word;
};

// ex. someName --> some-Name
exports.convertCamelToDasherized = function(word) {
  return word.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
};
