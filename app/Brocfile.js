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

app.import('vendor/asNEAT-visualizer/dist/asNEAT-visualizer.css');
app.import('vendor/tag-it/css/jquery.tagit.css');
app.import('vendor/tag-it/css/tagit.ui-zendesk.css');

app.import('vendor/WebMIDIAPIShim/WebMIDIAPI.js');
app.import({
  development: 'vendor/jquery/dist/jquery.js',
  production: 'vendor/jquery/dist/jquery.min.js'
});
app.import({
  development: 'vendor/jquery-ui/jquery-ui.js',
  production: 'vendor/jquery-ui/jquery-ui.min.js'
});
app.import({
  development: 'vendor/tag-it/js/tag-it.js',
  production: 'vendor/tag-it/js/tag-it.min.js'
});
app.import({
  development: 'vendor/bootstrap/dist/js/bootstrap.js',
  production: 'vendor/bootstrap/dist/js/bootstrap.min.js',
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

var awesomeFontTree = pickFiles('vendor/font-awesome/fonts', {
  srcDir: '/',
  files: ['*'],
  destDir: '/assets/fonts'
});
var bootstrapFontTree = pickFiles('vendor/bootstrap-sass-official/assets/fonts/bootstrap', {
  srcDir: '/',
  files: ['*'],
  destDir: '/assets/fonts'
});

var fontTree = mergeTrees([awesomeFontTree, bootstrapFontTree]);

module.exports = mergeTrees([app.toTree(), fontTree]);
