/* global require, module */

var EmberApp = require('ember-cli/lib/broccoli/ember-app');

var app = new EmberApp();

// Use `app.import` to add additional libraries to the generated
// output files.
//
// If you need to use different assets in different
// environments, specify an object as the first parameter. That
// object's keys should be the environment name and the values
// should be the asset to use in that environment.
//
// If the library that you are including contains AMD or ES6
// modules that you would like to import into your application
// please specify an object with the list of modules as keys
// along with the exports of each module as its value.

app.import('vendor/bootstrap/dist/css/bootstrap.min.css');
app.import('vendor/asNEAT-visualizer/dist/asNEAT-visualizer.css');

app.import('vendor/WebMIDIAPIShim/WebMIDIAPI.js');
app.import({
  development: 'vendor/jquery/dist/jquery.js',
  production: 'vendor/jquery/dist/jquery.min.js'
});
app.import({
  development: 'vendor/bootstrap/dist/js/bootstrap.js',
  production: 'vendor/bootstrap/dist/js/bootstrap.min.js'
});
app.import({
  development: 'vendor/lodash/dist/lodash.js',
  production: 'vendor/lodash/dist/lodash.min.js'
});
app.import({
  development: 'vendor/d3/d3.js',
  production: 'vendor/d3/d3.min.js'
});
app.import({
  development: 'vendor/chroma-js/chroma.js',
  production: 'vendor/chroma-js/chroma.min.js'
});
app.import({
  development: 'vendor/asNEAT/dist/asNEAT.js',
  production: 'vendor/asNEAT/dist/asNEAT.min.js'
});
app.import({
  development: 'vendor/asNEAT-visualizer/dist/asNEAT-visualizer.js',
  production: 'vendor/asNEAT-visualizer/dist/asNEAT-visualizer.min.js'
});
app.import('vendor/ember-simple-auth/simple-auth.amd.js');
app.import('vendor/torii/dist/torii.amd.js');

module.exports = app.toTree();
