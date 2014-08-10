/* global require, module */
var pickFiles = require('broccoli-static-compiler');
var mergeTrees = require('broccoli-merge-trees');
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

app.import('bower_components/asNEAT-visualizer/dist/asNEAT-visualizer.css');

app.import('bower_components/WebMIDIAPIShim/WebMIDIAPI.js');
app.import({
  development: 'bower_components/jquery/dist/jquery.js',
  production: 'bower_components/jquery/dist/jquery.min.js'
});
app.import({
  development: 'bower_components/bootstrap-sass-official/assets/js/bootstrap.js',
  production: 'bower_components/bootstrap-sass-official/assets/js/bootstrap.js',
});
app.import({
  development: 'bower_components/lodash/dist/lodash.js',
  production: 'bower_components/lodash/dist/lodash.min.js'
});
app.import({
  development: 'bower_components/d3/d3.js',
  production: 'bower_components/d3/d3.min.js'
});
app.import({
  development: 'bower_components/chroma-js/chroma.js',
  production: 'bower_components/chroma-js/chroma.min.js'
});
app.import({
  development: 'bower_components/asNEAT/dist/asNEAT.js',
  production: 'bower_components/asNEAT/dist/asNEAT.min.js'
});
app.import({
  development: 'bower_components/asNEAT-visualizer/dist/asNEAT-visualizer.js',
  production: 'bower_components/asNEAT-visualizer/dist/asNEAT-visualizer.min.js'
});

var awesomeFontTree = pickFiles('bower_components/font-awesome/fonts', {
  srcDir: '/',
  files: ['*'],
  destDir: '/assets/fonts'
});
var bootstrapFontTree = pickFiles('bower_components/bootstrap-sass-official/assets/fonts/bootstrap', {
  srcDir: '/',
  files: ['*'],
  destDir: '/assets/fonts'
});

var fontTree = mergeTrees([awesomeFontTree, bootstrapFontTree]);

module.exports = mergeTrees([app.toTree(), fontTree]);
